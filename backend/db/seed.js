/**
 * db/seed.js
 * Run once to populate MongoDB with sample data:
 *   node db/seed.js
 */

require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('./connection');
const Employee = require('../models/Employee');
const User = require('../models/User');

const sampleEmployees = [
  { name: 'John Doe',       department: 'Engineering', role: 'Software Engineer',    email: 'john@example.com',    status: 'Active'   },
  { name: 'Jane Smith',     department: 'Design',      role: 'UX Designer',          email: 'jane@example.com',    status: 'Active'   },
  { name: 'Robert Johnson', department: 'HR',          role: 'HR Manager',           email: 'robert@example.com',  status: 'On Leave' },
  { name: 'Emily Davis',    department: 'Marketing',   role: 'Marketing Specialist', email: 'emily@example.com',   status: 'Active'   },
  { name: 'Michael Wilson', department: 'Engineering', role: 'DevOps Engineer',      email: 'michael@example.com', status: 'Inactive' },
];

const sampleAdmin = {
  name: 'Admin User',
  email: 'admin@example.com',
  password: 'admin123',
  role: 'admin',
};

const seedDB = async () => {
  try {
    await connectDB();

    console.log('\n🌱 Seeding database...\n');

    // Clear existing data
    await Employee.deleteMany({});
    await User.deleteMany({});
    console.log('🗑️  Cleared existing employees and users.');

    // Insert Employees
    await Employee.insertMany(sampleEmployees);
    console.log(`✅ Inserted ${sampleEmployees.length} sample employees.`);

    // Insert Admin User
    await User.create(sampleAdmin);
    console.log('✅ Inserted admin user (admin@example.com / admin123).');

    console.log('\n✨ Seeding completed successfully!\n');
    process.exit(0);
  } catch (error) {
    console.error(`❌ Seeding failed: ${error.message}`);
    process.exit(1);
  }
};

seedDB();
