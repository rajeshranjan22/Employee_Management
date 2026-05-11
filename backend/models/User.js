const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

// ── User Schema ────────────────────────────────────────────────────────────────
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters'],
      maxlength: [100, 'Name cannot exceed 100 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email address'],
    },
    password: {
      type: String,
      minlength: [6, 'Password must be at least 6 characters'],
      select: false, // Never return password in queries by default
    },
    role: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Role',
      required: true,
    },
    department: {
      type: String,
      trim: true,
      enum: {
        values: [
          'Engineering', 'Design', 'HR', 'Marketing',
          'Finance', 'Operations', 'Sales', 'Other', 'All',
        ],
        message: '{VALUE} is not a valid department',
      },
      default: 'All',
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    shift: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Shift',
    },
    lastClockIn: {
      type: Date,
    },

    // ── Google OAuth ───────────────────────────────────────────────────────────
    googleId: {
      type: String,
      sparse: true,
      index: true,
    },

    // ── Email Verification ─────────────────────────────────────────────────────
    emailVerified: {
      type: Boolean,
      default: false,
    },
    verificationToken: {
      type: String,
      select: false,
    },
    verificationTokenExpire: {
      type: Date,
      select: false,
    },

    // ── Password Reset ─────────────────────────────────────────────────────────
    resetPasswordToken: {
      type: String,
      select: false,
    },
    resetPasswordExpire: {
      type: Date,
      select: false,
    },

    // ── Refresh Tokens (hashed, one per device/session) ────────────────────────
    refreshTokens: {
      type: [
        {
          tokenHash: { type: String, required: true },
          createdAt:  { type: Date, default: Date.now },
          userAgent:  { type: String, default: '' },
          ip:         { type: String, default: '' },
        },
      ],
      default: [],
      select: false,
    },

    // ── Active Sessions ────────────────────────────────────────────────────────
    activeSessions: {
      type: [
        {
          sessionId:  { type: String, required: true },
          device:     { type: String, default: 'Unknown' },
          ip:         { type: String, default: '' },
          createdAt:  { type: Date, default: Date.now },
          lastActive: { type: Date, default: Date.now },
        },
      ],
      default: [],
    },

    // ── Audit ──────────────────────────────────────────────────────────────────
    lastLogin: {
      type: Date,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// ── Pre-save Hook: Hash password before saving ─────────────────────────────────
userSchema.pre('save', async function () {
  if (!this.isModified('password') || !this.password) return;
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
});

// ── Instance Method: Compare plain password against hash ──────────────────────
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// ── Instance Method: Generate & store hashed email verification token ──────────
userSchema.methods.generateVerificationToken = function () {
  const rawToken = crypto.randomBytes(32).toString('hex');
  this.verificationToken = crypto.createHash('sha256').update(rawToken).digest('hex');
  this.verificationTokenExpire = Date.now() + 24 * 60 * 60 * 1000; // 24 hours
  return rawToken; // send the raw token in the email URL
};

// ── Instance Method: Generate & store hashed password-reset token ──────────────
userSchema.methods.generatePasswordResetToken = function () {
  const rawToken = crypto.randomBytes(32).toString('hex');
  this.resetPasswordToken = crypto.createHash('sha256').update(rawToken).digest('hex');
  this.resetPasswordExpire = Date.now() + 60 * 60 * 1000; // 1 hour
  return rawToken; // send the raw token in the email URL
};

// ── Export Model ───────────────────────────────────────────────────────────────
const User = mongoose.model('User', userSchema);

module.exports = User;
