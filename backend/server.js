require('dotenv').config();
const express     = require('express');
const cors        = require('cors');
const morgan      = require('morgan');
const helmet      = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss         = require('xss-clean');
const cookieParser = require('cookie-parser');
const passport    = require('./configs/passport.config');

const connectDB       = require('./db/connection');
const { PORT, CLIENT_URL, COOKIE_SECRET } = require('./config/config');
const { generalLimiter }  = require('./middlewares/rateLimiter');
const { errorHandler }    = require('./middleware/errorHandler');

// ── Route Imports ──────────────────────────────────────────────────────────────
const authRoutes       = require('./modules/auth/routes/auth.routes');  // new auth module
const employeeRoutes   = require('./routes/employeeRoutes');
const roleRoutes       = require('./routes/roleRoutes');
const activityRoutes   = require('./routes/activityRoutes');
const attendanceRoutes = require('./routes/attendanceRoutes');
const shiftRoutes      = require('./routes/shiftRoutes');

// ── Connect to MongoDB ─────────────────────────────────────────────────────────
connectDB();

const app = express();

// ── Security Middleware ────────────────────────────────────────────────────────
// Set secure HTTP headers
app.use(helmet({
  crossOriginEmbedderPolicy: false,   // allow embedding from same origin
  contentSecurityPolicy: false,        // configured separately if needed
}));

// CORS — allow only the React dev server (and production URL)
app.use(cors({
  origin: [
    CLIENT_URL,
    'http://localhost:5173',
    'http://localhost:5174',
    'http://127.0.0.1:5173',
    'http://127.0.0.1:5174'
  ],
  credentials: true,
  methods:     ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Parse JSON and URL-encoded bodies
app.use(express.json({ limit: '10kb' }));          // prevent giant payloads
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// Signed cookies (refresh token)
app.use(cookieParser(COOKIE_SECRET));

// Sanitize MongoDB operators in req.body / req.query (NoSQL injection)
// app.use(mongoSanitize());   // NoSQL injection protection (disabled due to compatibility issues)

// Sanitize HTML tags in req.body / req.query (XSS)
// app.use(xss());             // XSS protection (disabled due to compatibility issues)

// HTTP request logging
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));

// Debug Logger
if (process.env.NODE_ENV === 'development') {
  app.use('/api', (req, res, next) => {
    console.log(`[API Request] ${req.method} ${req.originalUrl}`);
    next();
  });
}

// General rate limiter (200 req / 15 min per IP)
app.use('/api', generalLimiter);

// Initialise Passport (no sessions — JWT only)
app.use(passport.initialize());

// ── Routes ─────────────────────────────────────────────────────────────────────
app.use('/api/auth',       authRoutes);
app.use('/api/employees',  employeeRoutes);
app.use('/api/roles',      roleRoutes);
app.use('/api/activities', activityRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/shifts',     shiftRoutes);

// ── Health Check ───────────────────────────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({
    status:  'ok',
    message: 'Employee Management API is running.',
    env:     process.env.NODE_ENV,
    time:    new Date().toISOString(),
  });
});

// ── 404 Handler ────────────────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route ${req.originalUrl} not found.` });
});

// ── Async Error Handler — attach statusCode from thrown errors ─────────────────
app.use((err, req, res, next) => {
  // If err was thrown with a custom statusCode, use it; else fall back to 500
  const status = err.statusCode || err.status || 500;
  const message = err.message || 'Internal Server Error';

  if (process.env.NODE_ENV === 'development') {
    console.error('[Error]', err);
  }

  res.status(status).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
});

// ── Start Server ───────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`\n🚀 Backend running  → http://localhost:${PORT}`);
  console.log(`   Auth API         → http://localhost:${PORT}/api/auth`);
  console.log(`   Employees API    → http://localhost:${PORT}/api/employees`);
  console.log(`   Health check     → http://localhost:${PORT}/api/health\n`);
});
