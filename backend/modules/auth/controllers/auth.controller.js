const { CLIENT_URL } = require('../../../config/config');
const { successResponse, errorResponse } = require('../../../utils/response.helper');
const authService = require('../services/auth.service');

// ── Helper: extract metadata from request ─────────────────────────────────────
const getMeta = (req) => ({
  userAgent: req.headers['user-agent'] || '',
  ip: req.ip || req.connection?.remoteAddress || '',
});

// ═══════════════════════════════════════════════════════════════════════════════
// POST /api/auth/register
// ═══════════════════════════════════════════════════════════════════════════════
const register = async (req, res, next) => {
  try {
    const user = await authService.registerUser(req.body);
    return successResponse(
      res,
      { user },
      'Registration successful! Please check your email to verify your account.',
      201
    );
  } catch (err) {
    next(err);
  }
};

// ═══════════════════════════════════════════════════════════════════════════════
// POST /api/auth/login
// ═══════════════════════════════════════════════════════════════════════════════
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const result = await authService.loginUser(email, password, getMeta(req));

    // Set refresh token in httpOnly cookie
    authService.setRefreshCookie(res, result.rawRefreshToken);

    return successResponse(res, {
      accessToken: result.accessToken,
      user: result.user,
    }, 'Login successful.');
  } catch (err) {
    next(err);
  }
};

// ═══════════════════════════════════════════════════════════════════════════════
// POST /api/auth/refresh  — silent token refresh
// ═══════════════════════════════════════════════════════════════════════════════
const refreshToken = async (req, res, next) => {
  try {
    const rawRefreshToken = req.cookies?.refreshToken;
    if (!rawRefreshToken) {
      return errorResponse(res, 'No refresh token provided.', 401);
    }

    const result = await authService.refreshAccessToken(rawRefreshToken, getMeta(req));

    // Rotate cookie
    authService.setRefreshCookie(res, result.rawRefreshToken);

    return successResponse(res, {
      accessToken: result.accessToken,
      user: result.user,
    }, 'Token refreshed.');
  } catch (err) {
    // Clear stale cookie on any refresh error
    authService.clearRefreshCookie(res);
    next(err);
  }
};

// ═══════════════════════════════════════════════════════════════════════════════
// POST /api/auth/logout
// ═══════════════════════════════════════════════════════════════════════════════
const logout = async (req, res, next) => {
  try {
    const rawRefreshToken = req.cookies?.refreshToken;
    await authService.logoutUser(req.user._id, rawRefreshToken);
    authService.clearRefreshCookie(res);
    return successResponse(res, null, 'Logged out successfully.');
  } catch (err) {
    next(err);
  }
};

// ═══════════════════════════════════════════════════════════════════════════════
// POST /api/auth/logout-all
// ═══════════════════════════════════════════════════════════════════════════════
const logoutAll = async (req, res, next) => {
  try {
    await authService.logoutAllDevices(req.user._id);
    authService.clearRefreshCookie(res);
    return successResponse(res, null, 'Logged out from all devices successfully.');
  } catch (err) {
    next(err);
  }
};

// ═══════════════════════════════════════════════════════════════════════════════
// GET /api/auth/me  — protected
// ═══════════════════════════════════════════════════════════════════════════════
const getMe = (req, res) => {
  const { _id, name, email, role, department, emailVerified, lastLogin, activeSessions } = req.user;
  return successResponse(res, {
    user: { id: _id, name, email, role, department, emailVerified, lastLogin, activeSessions },
  });
};

// ═══════════════════════════════════════════════════════════════════════════════
// POST /api/auth/forgot-password
// ═══════════════════════════════════════════════════════════════════════════════
const forgotPassword = async (req, res, next) => {
  try {
    await authService.forgotPassword(req.body.email);
    // Always return 200 to prevent email enumeration attacks
    return successResponse(
      res,
      null,
      'If an account with that email exists, a password reset link has been sent.'
    );
  } catch (err) {
    next(err);
  }
};

// ═══════════════════════════════════════════════════════════════════════════════
// POST /api/auth/reset-password
// ═══════════════════════════════════════════════════════════════════════════════
const resetPassword = async (req, res, next) => {
  try {
    const { token, password } = req.body;
    await authService.resetPassword(token, password);
    authService.clearRefreshCookie(res);
    return successResponse(res, null, 'Password reset successful. Please log in with your new password.');
  } catch (err) {
    next(err);
  }
};

// ═══════════════════════════════════════════════════════════════════════════════
// GET /api/auth/verify-email?token=
// ═══════════════════════════════════════════════════════════════════════════════
const verifyEmail = async (req, res, next) => {
  try {
    const { token } = req.query;
    if (!token) return errorResponse(res, 'Verification token is required.', 400);
    await authService.verifyEmail(token);
    return successResponse(res, null, 'Email verified successfully! You can now log in.');
  } catch (err) {
    next(err);
  }
};

// ═══════════════════════════════════════════════════════════════════════════════
// POST /api/auth/resend-verification
// ═══════════════════════════════════════════════════════════════════════════════
const resendVerification = async (req, res, next) => {
  try {
    await authService.resendVerificationEmail(req.body.email);
    return successResponse(
      res,
      null,
      'If your email is registered and unverified, a new verification link has been sent.'
    );
  } catch (err) {
    next(err);
  }
};

// ═══════════════════════════════════════════════════════════════════════════════
// GET /api/auth/sessions  — protected
// ═══════════════════════════════════════════════════════════════════════════════
const getSessions = async (req, res, next) => {
  try {
    const sessions = await authService.getActiveSessions(req.user._id);
    return successResponse(res, { sessions });
  } catch (err) {
    next(err);
  }
};

// ═══════════════════════════════════════════════════════════════════════════════
// GET /api/auth/google  — redirect to Google
// GET /api/auth/google/callback — Google callback
// ═══════════════════════════════════════════════════════════════════════════════
const googleCallback = async (req, res, next) => {
  try {
    // req.user is set by Passport after successful OAuth
    const result = await authService.googleOAuthLogin(req.user, getMeta(req));

    // Set refresh cookie
    authService.setRefreshCookie(res, result.rawRefreshToken);

    // Redirect to frontend with access token in query (frontend stores it in memory)
    const params = new URLSearchParams({
      token: result.accessToken,
      name:  result.user.name,
      email: result.user.email,
    });
    return res.redirect(`${CLIENT_URL}/oauth-callback?${params.toString()}`);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  register,
  login,
  refreshToken,
  logout,
  logoutAll,
  getMe,
  forgotPassword,
  resetPassword,
  verifyEmail,
  resendVerification,
  getSessions,
  googleCallback,
};
