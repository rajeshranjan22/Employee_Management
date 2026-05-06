require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const connectDB = require("./db/connection");

const { PORT } = require("./config/config");
const authRoutes = require("./routes/authRoutes");
const employeeRoutes = require("./routes/employeeRoutes");
const { errorHandler } = require("./middleware/errorHandler");

// Connect to Database
connectDB();

const app = express();

//  Global Middleware
const corsOptions = {
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));
app.use(morgan("dev"));
app.use(express.json());

//  Routes
app.use("/api/auth", authRoutes);
app.use("/api/employees", employeeRoutes);

//  Health Check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "Employee Management API is running." });
});

//  404 Handler
app.use((req, res) => {
  res.status(404).json({ error: "Route not found." });
});

//  Global Error Handler
app.use(errorHandler);

//  Start Server
app.listen(PORT, () => {
  console.log(` Backend server running on http://localhost:${PORT}`);
  console.log(`   Auth    → http://localhost:${PORT}/api/auth`);
  console.log(`   Employees → http://localhost:${PORT}/api/employees`);
});
