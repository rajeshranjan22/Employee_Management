const express = require('express');
const router = express.Router();
const {
  getAllEmployees,
  getEmployeeById,
  createEmployee,
  updateEmployee,
  deleteEmployee,
} = require('../controllers/employeeController');
const { authenticateToken } = require('../middleware/authMiddleware');

// All employee routes are protected — require valid JWT
router.use(authenticateToken);

// GET    /api/employees
router.get('/', getAllEmployees);

// GET    /api/employees/:id
router.get('/:id', getEmployeeById);

// POST   /api/employees
router.post('/', createEmployee);

// PUT    /api/employees/:id
router.put('/:id', updateEmployee);

// DELETE /api/employees/:id
router.delete('/:id', deleteEmployee);

module.exports = router;
