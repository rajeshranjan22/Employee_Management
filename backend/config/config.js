require('dotenv').config();

module.exports = {
  PORT: process.env.PORT || 5000,
  JWT_SECRET: process.env.JWT_SECRET || 'supersecretkey_employee_management',
  JWT_EXPIRES_IN: '1h',
};
