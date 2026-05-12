# 🚀 Employee Management System (EMS)

A professional, enterprise-grade Employee Management System built with the MERN stack (MongoDB, Express, React, Node.js). 
This application provides a secure, scalable solution for organizations to manage their workforce, featuring robust authentication, role-based access control, and comprehensive employee directories. 
Designed with a sleek, glassmorphism UI/UX to deliver a premium user experience and intuitive management workflows.

---

## ✨ Features

- **🔐 Enterprise Authentication**: Advanced JWT system with Access/Refresh token rotation, secure cookie storage, email verification, and password reset flows.
- **🌐 Google OAuth Integration**: Seamless third-party login via Google.
- **🛡️ Role-Based Access Control (RBAC)**: Distinct permissions for Admin and Employee roles.
- **📋 Employee Directory**: Dynamic table with search, filtering, and real-time updates.
- **🖼️ Profile Avatars**: Support for employee profile pictures with fallback initials.
- **💰 Financial Tracking**: Manage salary details and onboarding dates.
- **🔍 Live Search**: Real-time filtering by Name, Department, or Role.
- **🎨 Modern UI/UX**: Glassmorphism effects, responsive design, and smooth animations using Material UI (MUI).
- **📝 Complete CRUD**: Full ability to Add, View, Edit, and Delete employee records.
- **🔒 Security Hardened Backend**: Comprehensive security with rate limiting, Helmet, input validation, and secure session management.

---

## 🛠️ Tech Stack

**Frontend:**
- React (Vite)
- Material UI (MUI) & DataGrid
- React Router DOM
- Context API (for Global State)

**Backend:**
- Node.js & Express
- MongoDB Atlas & Mongoose
- JSON Web Token (JWT)
- Morgan (Request Logging)
- Security (Helmet, Express Rate Limit)
- Email (Nodemailer)
- OAuth (Passport.js)

---

## 📸 Screenshots


<div style="display: flex; flex-wrap: wrap; gap: 15px; margin-bottom: 20px;">
  <img src="https://via.placeholder.com/600x350.png?text=Dashboard+Screenshot" alt="Dashboard View" width="400" style="border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);"/>
  <img src="https://via.placeholder.com/600x350.png?text=Employee+Directory+Screenshot" alt="Employee Directory" width="400" style="border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);"/>
</div>

---

## 🚦 Getting Started

### 1. Prerequisites
- Node.js installed
- MongoDB Atlas Account (or local MongoDB)
- Google Cloud Console Account (for OAuth 2.0 Credentials)
- App Password from your Email Provider (for SMTP)

### 2. Installation
Clone the repository and install dependencies for both frontend and backend:

```bash
# Install Backend Dependencies
cd backend
npm install

# Install Frontend Dependencies
cd ../frontend
npm install
```

### 3. Environment Variables

Create `.env` files for both frontend and backend by copying the provided example files:

```bash
# Setup Backend Environment
cd backend
cp .env.example .env

# Setup Frontend Environment
cd ../frontend
cp .env.example .env
```

Review both `.env` files and fill in your actual credentials (MongoDB URI, JWT secrets, Email SMTP settings, Google OAuth credentials).

### 4. Database Seeding
To populate the database with professional sample data (Admin account & 5 Employees):

```bash
cd backend
npm run seed
```

### 5. Running the Application

**Start Backend:**
```bash
cd backend
npm run dev
```

**Start Frontend:**
```bash
cd frontend
npm run dev
```


