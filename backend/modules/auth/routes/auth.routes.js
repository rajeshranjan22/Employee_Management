const express = require('express');
const passport = require('passport');
const router = express.Router();

const controller = require('../controllers/auth.controller');
const { authenticateToken } = require('../../../middleware/authMiddleware');
const { validate } = require('../middleware/validate.middleware');
const { authLimiter } = require('../../../middlewares/rateLimiter');
const {
  registerSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  resendVerificationSchema,
} = require('../validators/auth.validator');

// ── Public routes (rate-limited) ───────────────────────────────────────────────
router.post('/register',             authLimiter, validate(registerSchema),             controller.register);
router.post('/login',                authLimiter, validate(loginSchema),                controller.login);
router.post('/forgot-password',      authLimiter, validate(forgotPasswordSchema),       controller.forgotPassword);
router.post('/resend-verification',  authLimiter, validate(resendVerificationSchema),   controller.resendVerification);

// ── Token routes (cookie-based, no Bearer required) ───────────────────────────
router.post('/refresh',              controller.refreshToken);

// ── Reset password (token in body, rate-limited) ──────────────────────────────
router.post('/reset-password',       authLimiter, validate(resetPasswordSchema),        controller.resetPassword);

// ── Email verification (token in query) ───────────────────────────────────────
router.get('/verify-email',          controller.verifyEmail);

// ── Protected routes (require valid access token) ─────────────────────────────
router.get('/me',          authenticateToken, controller.getMe);
router.post('/logout',     authenticateToken, controller.logout);
router.post('/logout-all', authenticateToken, controller.logoutAll);
router.get('/sessions',    authenticateToken, controller.getSessions);

// ── Google OAuth ───────────────────────────────────────────────────────────────
// Step 1: Redirect user to Google's consent screen
router.get(
  '/google',
  passport.authenticate('google', { scope: ['profile', 'email'], session: false })
);

// Step 2: Google redirects back here after user consents
router.get(
  '/google/callback',
  passport.authenticate('google', {
    failureRedirect: '/login?error=google_auth_failed',
    session: false,
  }),
  controller.googleCallback
);

module.exports = router;
