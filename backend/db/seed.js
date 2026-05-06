/**
 * db/seed.js
 * Run once to populate MongoDB with sample data:
 *   node db/seed.js
 */

require("dotenv").config();
const mongoose = require("mongoose");
const connectDB = require("./connection");
const Employee = require("../models/Employee");
const User = require("../models/User");
const Role = require("../models/Role");

const sampleEmployees = [
  {
    name: "John Doe",
    department: "Engineering",
    role: "Software Engineer",
    email: "john@example.com",
    status: "Active",
    salary: 85000,
    joiningDate: "2023-01-15",
    avatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop",
  },
  {
    name: "Jane Smith",
    department: "Design",
    role: "UX Designer",
    email: "jane@example.com",
    status: "Active",
    salary: 78000,
    joiningDate: "2023-03-10",
    avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
  },
  {
    name: "Robert Johnson",
    department: "HR",
    role: "HR Manager",
    email: "robert@example.com",
    status: "On Leave",
    salary: 72000,
    joiningDate: "2022-11-20",
    avatar:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop",
  },
  {
    name: "Emily Davis",
    department: "Marketing",
    role: "Marketing Specialist",
    email: "emily@example.com",
    status: "Active",
    salary: 65000,
    joiningDate: "2024-02-05",
    avatar:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop",
  },
  {
    name: "Michael Wilson",
    department: "Engineering",
    role: "DevOps Engineer",
    email: "michael@example.com",
    status: "Inactive",
    salary: 92000,
    joiningDate: "2023-06-15",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
  },
];

const defaultRoles = [
  { name: 'Super Admin', permissions: ['VIEW_EMPLOYEES', 'CREATE_EMPLOYEE', 'UPDATE_EMPLOYEE', 'DELETE_EMPLOYEE', 'MANAGE_ROLES', 'VIEW_ACTIVITY_LOGS'], isCustom: false },
  { name: 'HR Manager', permissions: ['VIEW_EMPLOYEES', 'CREATE_EMPLOYEE', 'UPDATE_EMPLOYEE', 'DELETE_EMPLOYEE', 'VIEW_ACTIVITY_LOGS'], isCustom: false },
  { name: 'Team Lead', permissions: ['VIEW_EMPLOYEES', 'UPDATE_EMPLOYEE'], isCustom: false },
  { name: 'Finance Manager', permissions: ['VIEW_EMPLOYEES'], isCustom: false },
  { name: 'Recruiter', permissions: ['VIEW_EMPLOYEES', 'CREATE_EMPLOYEE'], isCustom: false },
  { name: 'Employee', permissions: ['VIEW_EMPLOYEES'], isCustom: false },
];

const seedDB = async () => {
  try {
    await connectDB();

    console.log("\n Seeding database...\n");

    // Clear existing data
    await Employee.deleteMany({});
    await User.deleteMany({});
    await Role.deleteMany({});
    console.log(" Cleared existing employees, users, and roles.");

    // Insert Roles
    const insertedRoles = await Role.insertMany(defaultRoles);
    console.log(`Inserted ${insertedRoles.length} default roles.`);

    const superAdminRole = insertedRoles.find(r => r.name === 'Super Admin');

    // Insert Admin User
    const sampleAdmin = {
      name: "Honey Gupta",
      email: "admin@example.com",
      password: "admin123", // Will be hashed by pre-save hook
      role: superAdminRole._id,
      department: "All"
    };

    await User.create(sampleAdmin);
    console.log("Inserted admin user (admin@example.com / admin123).");

    // Insert Employees
    await Employee.insertMany(sampleEmployees);
    console.log(`Inserted ${sampleEmployees.length} sample employees.`);

    console.log("\n Seeding completed successfully!\n");
    process.exit(0);
  } catch (error) {
    console.error(`Seeding failed: ${error.message}`);
    process.exit(1);
  }
};

seedDB();
