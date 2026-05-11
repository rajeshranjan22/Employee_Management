const crypto = require('crypto');
const User = require('../../../models/User');
const Role = require('../../../models/Role');
const Session = require('../models/Session');
const {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
  hashToken,
} = require('../utils/token.util');
const {
  sendVerificationEmail,
  sendForgotPasswordEmail,
  sendPasswordChangedEmail,
} = require('../utils/email.util');
const { JWT_REFRESH_EXPIRES_IN } = require('../../../config/config');

// ── Parse refresh token expiry into milliseconds ───────────────────────────────
const parseMs = (str) => {
  const unit = str.slice(-1);
  const val  = parseInt(str.slice(0, -1), 10);
  const map  = { s: 1000, m: 60_000, h: 3_600_000, d: 86_400_000 };
  return val * (map[unit] || 86_400_000);
};

// ── Parse User-Agent into a human-readable device string ──────────────────────
const parseDevice = (userAgent = '') => {
  if (!userAgent) return 'Unknown Device';
  if (/mobile/i.test(userAgent))  return 'Mobile Device';
  if (/tablet/i.test(userAgent))  return 'Tablet';
  if (/windows/i.test(userAgent)) return 'Windows PC';
  if (/mac/i.test(userAgent))     return 'Mac';
  if (/linux/i.test(userAgent))   return 'Linux';
  return 'Desktop Browser';
};

// ── Set Refresh Token in httpOnly cookie ──────────────────────────────────────
const setRefreshCookie = (res, rawRefreshToken) => {
  res.cookie('refreshToken', rawRefreshToken, {
    httpOnly:  true,
    secure:    process.env.NODE_ENV === 'production',
    sameSite:  'lax',
    maxAge:    parseMs(JWT_REFRESH_EXPIRES_IN),
    path:      '/api/auth',
  });
};

// ── Clear Refresh Token Cookie ────────────────────────────────────────────────
const clearRefreshCookie = (res) => {
  res.clearCookie('refreshToken', { path: '/api/auth' });
};

// ═════════════════════════════════════════════════════════════════════════════
// REGISTER
// ═════════════════════════════════════════════════════════════════════════════
const registerUser = async (data) => {
  const { name, email, password, department } = data;

  // Check duplicate
  const existing = await User.findOne({ email });
  if (existing) {
    const err = new Error('An account with this email already exists.');
    err.statusCode = 409;
    throw err;
  }

  // Default role
  let defaultRole = await Role.findOne({ name: 'Employee' });
  if (!defaultRole) {
    defaultRole = await Role.create({
      name: 'Employee', permissions: [], description: 'Default employee role', isCustom: false,
    });
  }

  // Create user
  const user = new User({ name, email, password, role: defaultRole._id, department });

  // Generate verification token
  const rawToken = user.generateVerificationToken();
  await user.save();

  // Send verification email (non-blocking — don't fail registration if email fails)
  try {
    await sendVerificationEmail(user, rawToken);
  } catch (emailErr) {
    console.error('[Auth] Verification email failed:', emailErr.message);
  }

  const populated = await User.findById(user._id).populate('role');
  return {
    id:         populated._id,
    name:       populated.name,
    email:      populated.email,
    role:       populated.role,
    department: populated.department,
    emailVerified: populated.emailVerified,
  };
};

// ═════════════════════════════════════════════════════════════════════════════
// LOGIN
// ═════════════════════════════════════════════════════════════════════════════
const loginUser = async (email, password, meta = {}) => {
  const { userAgent = '', ip = '' } = meta;

  const user = await User.findOne({ email })
    .select('+password +refreshTokens')
    .populate('role');

  if (!user || !user.password) {
    const err = new Error('Invalid email or password.');
    err.statusCode = 401;
    throw err;
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    const err = new Error('Invalid email or password.');
    err.statusCode = 401;
    throw err;
  }

  if (!user.isActive) {
    const err = new Error('Your account has been deactivated. Please contact an administrator.');
    err.statusCode = 403;
    throw err;
  }

  if (!user.emailVerified && process.env.NODE_ENV !== 'development') {
    const err = new Error('Please verify your email address before logging in. Check your inbox for the verification link.');
    err.statusCode = 403;
    err.code = 'EMAIL_NOT_VERIFIED';
    throw err;
  }

  // Generate tokens
  const accessToken  = generateAccessToken(user._id);
  const rawRefresh   = generateRefreshToken(user._id);
  const refreshHash  = hashToken(rawRefresh);
  const sessionId    = crypto.randomBytes(16).toString('hex');
  const device       = parseDevice(userAgent);

  // Store hashed refresh token
  user.refreshTokens.push({ tokenHash: refreshHash, userAgent, ip });

  // Store session
  const expiresAt = new Date(Date.now() + parseMs(JWT_REFRESH_EXPIRES_IN));
  await Session.create({ userId: user._id, sessionId, device, ip, expiresAt });

  user.activeSessions.push({ sessionId, device, ip });
  user.lastLogin = new Date();
  await user.save();

  return {
    accessToken,
    rawRefreshToken: rawRefresh,
    user: {
      id:           user._id,
      name:         user.name,
      email:        user.email,
      role:         user.role,
      department:   user.department,
      emailVerified: user.emailVerified,
      lastLogin:    user.lastLogin,
    },
  };
};

// ═════════════════════════════════════════════════════════════════════════════
// REFRESH ACCESS TOKEN  (token rotation)
// ═════════════════════════════════════════════════════════════════════════════
const refreshAccessToken = async (rawRefreshToken, meta = {}) => {
  const { userAgent = '', ip = '' } = meta;

  // Verify JWT signature & expiry
  let decoded;
  try {
    decoded = verifyRefreshToken(rawRefreshToken);
  } catch {
    const err = new Error('Invalid or expired refresh token.');
    err.statusCode = 401;
    throw err;
  }

  if (decoded.type !== 'refresh') {
    const err = new Error('Invalid token type.');
    err.statusCode = 401;
    throw err;
  }

  const incomingHash = hashToken(rawRefreshToken);
  const user = await User.findById(decoded.id).select('+refreshTokens').populate('role');

  if (!user) {
    const err = new Error('User not found.');
    err.statusCode = 401;
    throw err;
  }

  const storedToken = user.refreshTokens.find((t) => t.tokenHash === incomingHash);
  if (!storedToken) {
    // Token reuse detected — invalidate ALL refresh tokens (security measure)
    user.refreshTokens = [];
    user.activeSessions = [];
    await user.save();
    await Session.deleteMany({ userId: user._id });

    const err = new Error('Refresh token reuse detected. All sessions have been terminated for your security.');
    err.statusCode = 401;
    throw err;
  }

  // Remove old refresh token (rotation)
  user.refreshTokens = user.refreshTokens.filter((t) => t.tokenHash !== incomingHash);

  // Issue new tokens
  const newAccessToken  = generateAccessToken(user._id);
  const newRawRefresh   = generateRefreshToken(user._id);
  const newRefreshHash  = hashToken(newRawRefresh);
  const device          = parseDevice(userAgent);

  user.refreshTokens.push({ tokenHash: newRefreshHash, userAgent, ip });
  await user.save();

  return {
    accessToken:     newAccessToken,
    rawRefreshToken: newRawRefresh,
    user: {
      id:           user._id,
      name:         user.name,
      email:        user.email,
      role:         user.role,
      department:   user.department,
      emailVerified: user.emailVerified,
    },
  };
};

// ═════════════════════════════════════════════════════════════════════════════
// LOGOUT (current device)
// ═════════════════════════════════════════════════════════════════════════════
const logoutUser = async (userId, rawRefreshToken) => {
  const user = await User.findById(userId).select('+refreshTokens');
  if (!user) return;

  if (rawRefreshToken) {
    const hash = hashToken(rawRefreshToken);
    user.refreshTokens = user.refreshTokens.filter((t) => t.tokenHash !== hash);
    await Session.deleteOne({ userId, sessionId: { $exists: true } });
  }

  await user.save();
};

// ═════════════════════════════════════════════════════════════════════════════
// LOGOUT ALL DEVICES
// ═════════════════════════════════════════════════════════════════════════════
const logoutAllDevices = async (userId) => {
  await User.findByIdAndUpdate(userId, {
    $set: { refreshTokens: [], activeSessions: [] },
  });
  await Session.deleteMany({ userId });
};

// ═════════════════════════════════════════════════════════════════════════════
// FORGOT PASSWORD
// ═════════════════════════════════════════════════════════════════════════════
const forgotPassword = async (email) => {
  const user = await User.findOne({ email });

  // Always return success to prevent email enumeration
  if (!user) return;

  const rawToken = user.generatePasswordResetToken();
  await user.save({ validateBeforeSave: false });

  try {
    await sendForgotPasswordEmail(user, rawToken);
  } catch (emailErr) {
    // Revert token on email failure
    user.resetPasswordToken   = undefined;
    user.resetPasswordExpire  = undefined;
    await user.save({ validateBeforeSave: false });
    console.error('[Auth] Forgot-password email failed:', emailErr.message);
    throw emailErr;
  }
};

// ═════════════════════════════════════════════════════════════════════════════
// RESET PASSWORD
// ═════════════════════════════════════════════════════════════════════════════
const resetPassword = async (rawToken, newPassword) => {
  const hashedToken = crypto.createHash('sha256').update(rawToken).digest('hex');

  const user = await User.findOne({
    resetPasswordToken:  hashedToken,
    resetPasswordExpire: { $gt: Date.now() },
  }).select('+resetPasswordToken +resetPasswordExpire +refreshTokens');

  if (!user) {
    const err = new Error('Password reset token is invalid or has expired.');
    err.statusCode = 400;
    throw err;
  }

  user.password             = newPassword;
  user.resetPasswordToken   = undefined;
  user.resetPasswordExpire  = undefined;
  // Invalidate all sessions for security
  user.refreshTokens        = [];
  user.activeSessions       = [];
  await user.save();
  await Session.deleteMany({ userId: user._id });

  // Fire-and-forget confirmation email
  sendPasswordChangedEmail(user).catch((e) =>
    console.error('[Auth] Password-changed email failed:', e.message)
  );
};

// ═════════════════════════════════════════════════════════════════════════════
// VERIFY EMAIL
// ═════════════════════════════════════════════════════════════════════════════
const verifyEmail = async (rawToken) => {
  const hashedToken = crypto.createHash('sha256').update(rawToken).digest('hex');

  const user = await User.findOne({
    verificationToken:       hashedToken,
    verificationTokenExpire: { $gt: Date.now() },
  }).select('+verificationToken +verificationTokenExpire');

  if (!user) {
    const err = new Error('Verification link is invalid or has expired.');
    err.statusCode = 400;
    throw err;
  }

  if (user.emailVerified) {
    const err = new Error('Email is already verified.');
    err.statusCode = 400;
    throw err;
  }

  user.emailVerified            = true;
  user.verificationToken        = undefined;
  user.verificationTokenExpire  = undefined;
  await user.save({ validateBeforeSave: false });
};

// ═════════════════════════════════════════════════════════════════════════════
// RESEND VERIFICATION EMAIL
// ═════════════════════════════════════════════════════════════════════════════
const resendVerificationEmail = async (email) => {
  const user = await User.findOne({ email })
    .select('+verificationToken +verificationTokenExpire');

  if (!user) {
    // Prevent enumeration
    return;
  }

  if (user.emailVerified) {
    const err = new Error('This email is already verified.');
    err.statusCode = 400;
    throw err;
  }

  const rawToken = user.generateVerificationToken();
  await user.save({ validateBeforeSave: false });

  try {
    await sendVerificationEmail(user, rawToken);
  } catch (emailErr) {
    console.error('[Auth] Resend verification email failed:', emailErr.message);
    throw emailErr;
  }
};

// ═════════════════════════════════════════════════════════════════════════════
// GOOGLE OAUTH — find or create user and issue tokens
// ═════════════════════════════════════════════════════════════════════════════
const googleOAuthLogin = async (oauthUser, meta = {}) => {
  const { userAgent = '', ip = '' } = meta;

  const user = await User.findById(oauthUser._id)
    .select('+refreshTokens')
    .populate('role');

  const accessToken  = generateAccessToken(user._id);
  const rawRefresh   = generateRefreshToken(user._id);
  const refreshHash  = hashToken(rawRefresh);
  const sessionId    = crypto.randomBytes(16).toString('hex');
  const device       = parseDevice(userAgent);

  user.refreshTokens.push({ tokenHash: refreshHash, userAgent, ip });

  const expiresAt = new Date(Date.now() + parseMs(JWT_REFRESH_EXPIRES_IN));
  await Session.create({ userId: user._id, sessionId, device, ip, expiresAt });

  user.activeSessions.push({ sessionId, device, ip });
  user.lastLogin = new Date();
  await user.save();

  return {
    accessToken,
    rawRefreshToken: rawRefresh,
    user: {
      id:           user._id,
      name:         user.name,
      email:        user.email,
      role:         user.role,
      department:   user.department,
      emailVerified: user.emailVerified,
      lastLogin:    user.lastLogin,
    },
  };
};

// ═════════════════════════════════════════════════════════════════════════════
// GET ACTIVE SESSIONS for a user
// ═════════════════════════════════════════════════════════════════════════════
const getActiveSessions = async (userId) => {
  return Session.find({ userId, isActive: true }).sort({ lastActive: -1 });
};

module.exports = {
  registerUser,
  loginUser,
  refreshAccessToken,
  logoutUser,
  logoutAllDevices,
  forgotPassword,
  resetPassword,
  verifyEmail,
  resendVerificationEmail,
  googleOAuthLogin,
  getActiveSessions,
  setRefreshCookie,
  clearRefreshCookie,
};
