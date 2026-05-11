const Joi = require('joi');

// ── Password Rule (reused across schemas) ──────────────────────────────────────
const passwordRule = Joi.string()
  .min(8)
  .max(128)
  .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/)
  .message(
    'Password must be at least 8 characters and include uppercase, lowercase, a number, and a special character (@$!%*?&)'
  );

// ── Register ───────────────────────────────────────────────────────────────────
const registerSchema = Joi.object({
  name: Joi.string().trim().min(2).max(100).required().messages({
    'string.min': 'Name must be at least 2 characters',
    'string.max': 'Name cannot exceed 100 characters',
    'any.required': 'Name is required',
  }),
  email: Joi.string().email({ tlds: { allow: false } }).lowercase().required().messages({
    'string.email': 'Please provide a valid email address',
    'any.required': 'Email is required',
  }),
  password: passwordRule.required(),
  department: Joi.string()
    .valid('Engineering', 'Design', 'HR', 'Marketing', 'Finance', 'Operations', 'Sales', 'Other', 'All')
    .default('All'),
});

// ── Login ──────────────────────────────────────────────────────────────────────
const loginSchema = Joi.object({
  email: Joi.string().email({ tlds: { allow: false } }).lowercase().required().messages({
    'string.email': 'Please provide a valid email address',
    'any.required': 'Email is required',
  }),
  password: Joi.string().required().messages({
    'any.required': 'Password is required',
  }),
});

// ── Forgot Password ────────────────────────────────────────────────────────────
const forgotPasswordSchema = Joi.object({
  email: Joi.string().email({ tlds: { allow: false } }).lowercase().required().messages({
    'string.email': 'Please provide a valid email address',
    'any.required': 'Email is required',
  }),
});

// ── Reset Password ─────────────────────────────────────────────────────────────
const resetPasswordSchema = Joi.object({
  token:    Joi.string().required().messages({ 'any.required': 'Reset token is required' }),
  password: passwordRule.required(),
});

// ── Change Password ────────────────────────────────────────────────────────────
const changePasswordSchema = Joi.object({
  currentPassword: Joi.string().required(),
  newPassword:     passwordRule.required(),
});

// ── Resend Verification ────────────────────────────────────────────────────────
const resendVerificationSchema = Joi.object({
  email: Joi.string().email({ tlds: { allow: false } }).lowercase().required(),
});

module.exports = {
  registerSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  changePasswordSchema,
  resendVerificationSchema,
};
