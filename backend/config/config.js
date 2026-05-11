require('dotenv').config();

module.exports = {
  PORT: process.env.PORT || 5000,
  NODE_ENV: process.env.NODE_ENV || 'development',

  // Database
  MONGO_URI: process.env.MONGO_URI,

  // JWT
  JWT_ACCESS_SECRET:  process.env.JWT_ACCESS_SECRET  || 'access_secret_change_in_production',
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET || 'refresh_secret_change_in_production',
  JWT_ACCESS_EXPIRES_IN:  process.env.JWT_ACCESS_EXPIRES_IN  || '15m',
  JWT_REFRESH_EXPIRES_IN: process.env.JWT_REFRESH_EXPIRES_IN || '7d',

  // Email (Nodemailer)
  EMAIL_HOST:     process.env.EMAIL_HOST     || 'smtp.gmail.com',
  EMAIL_PORT:     parseInt(process.env.EMAIL_PORT || '587', 10),
  EMAIL_SECURE:   process.env.EMAIL_SECURE   === 'true',
  EMAIL_USER:     process.env.EMAIL_USER     || '',
  EMAIL_PASS:     process.env.EMAIL_PASS     || '',
  EMAIL_FROM:     process.env.EMAIL_FROM     || 'noreply@ems.local',

  // Google OAuth
  GOOGLE_CLIENT_ID:     process.env.GOOGLE_CLIENT_ID     || '',
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET || '',
  GOOGLE_CALLBACK_URL:  process.env.GOOGLE_CALLBACK_URL  || 'http://localhost:5000/api/auth/google/callback',

  // Client
  CLIENT_URL: process.env.CLIENT_URL || 'http://localhost:5173',

  // Cookie
  COOKIE_SECRET: process.env.COOKIE_SECRET || 'cookie_secret_change_in_production',
};
