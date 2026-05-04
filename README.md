# 🚀 Employee Management System (EMS)

A professional, full-stack Employee Management System built with the MERN stack (MongoDB, Express, React, Node.js) featuring secure authentication, role-based access control, and a sleek modern UI.

---

## ✨ Features

- **🔐 Secure Authentication**: JWT-based login and registration with bcrypt password hashing.
- **🛡️ Role-Based Access Control (RBAC)**: Distinct permissions for Admin and Employee roles (e.g., only Admin can delete records).
- **📋 Employee Directory**: Dynamic table with search, filtering, and real-time updates.
- **🖼️ Profile Avatars**: Support for employee profile pictures with fallback initials.
- **💰 Financial Tracking**: Manage salary details and onboarding dates.
- **🔍 Live Search**: Real-time filtering by Name, Department, or Role.
- **🎨 Modern UI/UX**: Glassmorphism effects, responsive design, and smooth animations using Material UI (MUI).
- **📝 Complete CRUD**: Full ability to Add, View, Edit, and Delete employee records.

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

---

## 🚦 Getting Started

### 1. Prerequisites
- Node.js installed
- MongoDB Atlas Account (or local MongoDB)

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
Create a `.env` file in the `backend` directory:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secret_key
JWT_EXPIRES_IN=1d
```

### 4. Database Seeding
To populate the database with professional sample data (Admin account & 5 Employees):

```bash
cd backend
npm run seed
```
*Default Admin Credentials:* `admin@example.com` / `admin123`

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

---

## 📂 Project Structure

```text
Employee_Management/
├── backend/
│   ├── config/         # App configuration
│   ├── controllers/    # Business logic
│   ├── db/             # DB connection & seed scripts
│   ├── middleware/     # Auth & Role verification
│   ├── models/         # Mongoose schemas
│   └── routes/         # API endpoints
└── frontend/
    ├── src/
    │   ├── components/ # Reusable UI components
    │   ├── context/    # Global state (Auth/Employees)
    │   ├── pages/      # Full-page views
    │   └── styles/     # CSS & Design tokens
```

---

## 🛡️ Security Note
- Passwords are never stored in plain text (hashed via bcrypt).
- API routes are protected by a JWT middleware.
- Client-side routes are protected by a `ProtectedRoute` component.

---

## 📜 License
Developed by **Brajesh Sharma**. Free to use for educational purposes.
