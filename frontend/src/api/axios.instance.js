import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

/**
 * Axios instance with base URL and default headers.
 * All API calls in the app should use this instance.
 */
const api = axios.create({
  baseURL:         API_BASE,
  withCredentials: true,   // send httpOnly refresh-token cookie automatically
  headers: {
    'Content-Type': 'application/json',
  },
});

// ── Track whether a refresh is in-flight to avoid multiple parallel refresh calls ──
let isRefreshing = false;
let failedQueue  = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) prom.reject(error);
    else        prom.resolve(token);
  });
  failedQueue = [];
};

// ── Request Interceptor: Attach access token from memory ──────────────────────
api.interceptors.request.use(
  (config) => {
    // Access token is stored in module-level variable (set by AuthContext)
    const token = api.defaults.headers.common['Authorization'];
    if (token) config.headers['Authorization'] = token;
    return config;
  },
  (error) => Promise.reject(error)
);

// ── Response Interceptor: Silent token refresh on 401 ─────────────────────────
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    const isTokenExpired =
      error.response?.status === 401 &&
      (error.response?.data?.code === 'TOKEN_EXPIRED' ||
        error.response?.data?.message === 'Access token expired.') &&
      !originalRequest._retry;

    if (isTokenExpired) {
      originalRequest._retry = true;

      if (isRefreshing) {
        // Queue the request until the refresh resolves
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers['Authorization'] = `Bearer ${token}`;
            return api(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      isRefreshing = true;

      try {
        // Call refresh endpoint — cookie is sent automatically
        const { data } = await axios.post(
          `${API_BASE}/auth/refresh`,
          {},
          { withCredentials: true }
        );

        const newToken = data.data?.accessToken;
        if (!newToken) throw new Error('No access token in refresh response');

        // Store new token globally so future requests use it
        api.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;

        // Notify listeners waiting for the refresh
        processQueue(null, newToken);

        // Retry the original failed request
        originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);

        // Refresh failed — clear auth state and redirect to login
        delete api.defaults.headers.common['Authorization'];
        window.dispatchEvent(new CustomEvent('auth:logout'));
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default api;
