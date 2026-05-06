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
const { requirePermission } = require('../middleware/permissionMiddleware');
const { logActivity } = require('../middleware/activityMiddleware');

// All employee routes are protected — require valid JWT
router.use(authenticateToken);

// GET    /api/employees
router.get('/', requirePermission('VIEW_EMPLOYEES'), getAllEmployees);

// GET    /api/employees/:id
router.get('/:id', requirePermission('VIEW_EMPLOYEES'), getEmployeeById);

// POST   /api/employees
router.post('/', requirePermission('CREATE_EMPLOYEE'), logActivity('CREATE_EMPLOYEE'), createEmployee);

// PUT    /api/employees/:id
router.put('/:id', requirePermission('UPDATE_EMPLOYEE'), logActivity('UPDATE_EMPLOYEE'), updateEmployee);

// DELETE /api/employees/:id
router.delete('/:id', requirePermission('DELETE_EMPLOYEE'), logActivity('DELETE_EMPLOYEE'), deleteEmployee);

module.exports = router;
