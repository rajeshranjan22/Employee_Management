const nodemailer = require('nodemailer');
const {
  EMAIL_HOST, EMAIL_PORT, EMAIL_SECURE,
  EMAIL_USER, EMAIL_PASS, EMAIL_FROM, CLIENT_URL,
} = require('../../../config/config');

// ── Transporter ────────────────────────────────────────────────────────────────
const transporter = nodemailer.createTransport({
  host:   EMAIL_HOST,
  port:   EMAIL_PORT,
  secure: EMAIL_SECURE,
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASS,
  },
});

// ── Shared Layout Wrapper ──────────────────────────────────────────────────────
const emailLayout = (title, content) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${title}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { background: #0f172a; font-family: 'Segoe UI', Arial, sans-serif; padding: 40px 16px; }
    .wrapper { max-width: 560px; margin: 0 auto; }
    .card {
      background: linear-gradient(135deg, #1e293b 0%, #162032 100%);
      border: 1px solid #334155;
      border-radius: 16px;
      overflow: hidden;
    }
    .header {
      background: linear-gradient(135deg, #3b82f6 0%, #6366f1 100%);
      padding: 32px 40px;
      text-align: center;
    }
    .header h1 { color: #fff; font-size: 24px; font-weight: 700; letter-spacing: -0.5px; }
    .header p  { color: rgba(255,255,255,0.85); font-size: 14px; margin-top: 4px; }
    .logo { font-size: 32px; margin-bottom: 12px; }
    .body { padding: 40px; }
    .body p { color: #cbd5e1; font-size: 15px; line-height: 1.7; margin-bottom: 16px; }
    .body strong { color: #f1f5f9; }
    .btn {
      display: block;
      width: fit-content;
      margin: 28px auto;
      padding: 14px 36px;
      background: linear-gradient(135deg, #3b82f6 0%, #6366f1 100%);
      color: #fff !important;
      text-decoration: none;
      border-radius: 8px;
      font-weight: 600;
      font-size: 15px;
      text-align: center;
    }
    .divider { border: none; border-top: 1px solid #334155; margin: 24px 0; }
    .link-box {
      background: #0f172a;
      border: 1px solid #334155;
      border-radius: 8px;
      padding: 12px 16px;
      word-break: break-all;
      font-size: 13px;
      color: #64748b;
    }
    .footer {
      text-align: center;
      padding: 20px 40px;
      border-top: 1px solid #1e293b;
    }
    .footer p { color: #475569; font-size: 13px; }
    .warning { color: #f59e0b !important; font-size: 13px !important; }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="card">
      <div class="header">
        <div class="logo">🏢</div>
        <h1>Employee Management System</h1>
        <p>Enterprise HR Platform</p>
      </div>
      <div class="body">
        ${content}
      </div>
      <div class="footer">
        <p>This email was sent by the EMS system. Please do not reply.</p>
        <p style="margin-top:8px">© ${new Date().getFullYear()} Employee Management System</p>
      </div>
    </div>
  </div>
</body>
</html>`;

// ── Send Verification Email ────────────────────────────────────────────────────
const sendVerificationEmail = async (user, rawToken) => {
  const verifyUrl = `${CLIENT_URL}/verify-email?token=${rawToken}`;

  const content = `
    <p>Hi <strong>${user.name}</strong>,</p>
    <p>Welcome to the Employee Management System! To complete your registration, please verify your email address by clicking the button below.</p>
    <a href="${verifyUrl}" class="btn">✉️ Verify Email Address</a>
    <hr class="divider" />
    <p>Or copy and paste this link into your browser:</p>
    <div class="link-box">${verifyUrl}</div>
    <p class="warning" style="margin-top:16px">⚠️ This link expires in <strong>24 hours</strong>.</p>
    <p>If you did not create an account, please ignore this email.</p>`;

  await transporter.sendMail({
    from:    EMAIL_FROM,
    to:      user.email,
    subject: '✉️ Verify Your Email — EMS',
    html:    emailLayout('Verify Your Email', content),
  });
};

// ── Send Forgot Password Email ─────────────────────────────────────────────────
const sendForgotPasswordEmail = async (user, rawToken) => {
  const resetUrl = `${CLIENT_URL}/reset-password?token=${rawToken}`;

  const content = `
    <p>Hi <strong>${user.name}</strong>,</p>
    <p>We received a request to reset the password for your EMS account. Click the button below to choose a new password.</p>
    <a href="${resetUrl}" class="btn">🔐 Reset My Password</a>
    <hr class="divider" />
    <p>Or copy and paste this link into your browser:</p>
    <div class="link-box">${resetUrl}</div>
    <p class="warning" style="margin-top:16px">⚠️ This link expires in <strong>1 hour</strong>.</p>
    <p>If you did not request a password reset, you can safely ignore this email. Your password will not change.</p>`;

  await transporter.sendMail({
    from:    EMAIL_FROM,
    to:      user.email,
    subject: '🔐 Password Reset Request — EMS',
    html:    emailLayout('Reset Your Password', content),
  });
};

// ── Send Password Changed Confirmation Email ───────────────────────────────────
const sendPasswordChangedEmail = async (user) => {
  const content = `
    <p>Hi <strong>${user.name}</strong>,</p>
    <p>This is a confirmation that the password for your EMS account (<strong>${user.email}</strong>) was <strong>successfully changed</strong>.</p>
    <p>The change was made on <strong>${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}</strong> (IST).</p>
    <hr class="divider" />
    <p class="warning">⚠️ If you did not make this change, please contact your system administrator immediately or use the Forgot Password feature to secure your account.</p>`;

  await transporter.sendMail({
    from:    EMAIL_FROM,
    to:      user.email,
    subject: '✅ Password Changed Successfully — EMS',
    html:    emailLayout('Password Changed', content),
  });
};

module.exports = {
  sendVerificationEmail,
  sendForgotPasswordEmail,
  sendPasswordChangedEmail,
};
