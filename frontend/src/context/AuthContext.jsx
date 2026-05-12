import { createContext, useState, useEffect, useCallback } from 'react';
import api from '../api/axios.instance';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // Access token lives ONLY in memory (not localStorage) to prevent XSS theft
  const [accessToken, setAccessToken] = useState(null);
  // User object is persisted to localStorage for UX continuity across page reloads
  const [user, setUser]       = useState(() => {
    try { return JSON.parse(localStorage.getItem('ems_user') || 'null'); }
    catch { return null; }
  });
  const [loading, setLoading] = useState(true);

  // ── Sync access token into axios headers whenever it changes ────────────────
  useEffect(() => {
    if (accessToken) {
      api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
    } else {
      delete api.defaults.headers.common['Authorization'];
    }
  }, [accessToken]);

  // ── On mount: silently attempt a token refresh (user may have a valid cookie) ─
  useEffect(() => {
    const tryRefresh = async () => {
      try {
        const { data } = await api.post('/auth/refresh');
        const newToken = data.data?.accessToken;
        const freshUser = data.data?.user;
        if (newToken) {
          setAccessToken(newToken);
          if (freshUser) {
            setUser(freshUser);
            localStorage.setItem('ems_user', JSON.stringify(freshUser));
          }
        }
      } catch {
        // No valid refresh cookie — user is not logged in
        setUser(null);
        localStorage.removeItem('ems_user');
      } finally {
        setLoading(false);
      }
    };
    tryRefresh();
  }, []);

  // ── Listen for forced logout events from the axios interceptor ───────────────
  useEffect(() => {
    const handleForceLogout = () => {
      setAccessToken(null);
      setUser(null);
      localStorage.removeItem('ems_user');
    };
    window.addEventListener('auth:logout', handleForceLogout);
    return () => window.removeEventListener('auth:logout', handleForceLogout);
  }, []);

  // ── LOGIN ───────────────────────────────────────────────────────────────────
  const login = async (email, password) => {
    try {
      const { data } = await api.post('/auth/login', { email, password });
      const { accessToken: token, user: loggedInUser } = data.data;

      setAccessToken(token);
      setUser(loggedInUser);
      localStorage.setItem('ems_user', JSON.stringify(loggedInUser));
      return { success: true };
    } catch (err) {
      const msg   = err.response?.data?.message || 'Login failed.';
      const code  = err.response?.data?.code;
      return { success: false, error: msg, code };
    }
  };

  // ── REGISTER ────────────────────────────────────────────────────────────────
  const register = async (name, email, password, department = 'All') => {
    try {
      const { data } = await api.post('/auth/register', { name, email, password, department });
      return { success: true, message: data.message };
    } catch (err) {
      const errors = err.response?.data?.errors;
      const msg    = err.response?.data?.message || 'Registration failed.';
      return { success: false, error: msg, errors };
    }
  };

  // ── LOGOUT (current device) ─────────────────────────────────────────────────
  const logout = useCallback(async () => {
    try {
      await api.post('/auth/logout');
    } catch {
      // Proceed even if the call fails
    } finally {
      setAccessToken(null);
      setUser(null);
      localStorage.removeItem('ems_user');
    }
  }, []);

  // ── LOGOUT ALL DEVICES ──────────────────────────────────────────────────────
  const logoutAll = useCallback(async () => {
    try {
      await api.post('/auth/logout-all');
    } catch {
      // Proceed even if the call fails
    } finally {
      setAccessToken(null);
      setUser(null);
      localStorage.removeItem('ems_user');
    }
  }, []);

  // ── FORGOT PASSWORD ─────────────────────────────────────────────────────────
  const forgotPassword = async (email) => {
    try {
      const { data } = await api.post('/auth/forgot-password', { email });
      return { success: true, message: data.message };
    } catch (err) {
      return { success: false, error: err.response?.data?.message || 'Request failed.' };
    }
  };

  // ── RESET PASSWORD ──────────────────────────────────────────────────────────
  const resetPassword = async (token, password) => {
    try {
      const { data } = await api.post('/auth/reset-password', { token, password });
      return { success: true, message: data.message };
    } catch (err) {
      return { success: false, error: err.response?.data?.message || 'Reset failed.' };
    }
  };

  // ── RESEND VERIFICATION EMAIL ───────────────────────────────────────────────
  const resendVerification = async (email) => {
    try {
      const { data } = await api.post('/auth/resend-verification', { email });
      return { success: true, message: data.message };
    } catch (err) {
      return { success: false, error: err.response?.data?.message || 'Failed to resend.' };
    }
  };

  // ── VERIFY EMAIL (used by VerifyEmail page on mount) ─────────────────────────
  const verifyEmail = async (token) => {
    try {
      const { data } = await api.get(`/auth/verify-email?token=${encodeURIComponent(token)}`);
      return { success: true, message: data.message };
    } catch (err) {
      return { success: false, error: err.response?.data?.message || 'Verification failed.' };
    }
  };

  // ── GOOGLE OAUTH — called by OAuthCallback after backend redirect ─────────────
  // Sets the access token in memory, fetches the full user profile (role, permissions),
  // and persists user to localStorage for UX continuity.
  const loginWithOAuthToken = async (token) => {
    // Immediately attach the token so /auth/me can be called
    setAccessToken(token);
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

    const { data } = await api.get('/auth/me');
    const userData = data.data?.user;
    if (!userData) throw new Error('Failed to fetch user profile after OAuth login.');

    setUser(userData);
    localStorage.setItem('ems_user', JSON.stringify(userData));
  };

  // ── PERMISSION CHECK ────────────────────────────────────────────────────────
  const hasPermission = (permission) => {
    if (!user?.role) return false;
    if (user.role.name === 'Super Admin') return true;
    return user.role.permissions?.includes(permission) ?? false;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        accessToken,
        isAuthenticated: !!user && !!accessToken,
        login,
        register,
        logout,
        logoutAll,
        forgotPassword,
        resetPassword,
        resendVerification,
        verifyEmail,
        loginWithOAuthToken,
        hasPermission,
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
};
