const Employee = require('../models/Employee');

// Helper to get department filter based on user
const getDepartmentFilter = (user) => {
  if (user && user.department && user.department !== 'All') {
    return { department: user.department };
  }
  return {};
};

// GET /api/employees
const getAllEmployees = async (req, res, next) => {
  try {
    const filter = getDepartmentFilter(req.user);
    const employees = await Employee.find(filter).sort({ createdAt: -1 });
    res.json(employees);
  } catch (err) {
    next(err);
  }
};

// GET /api/employees/:id
const getEmployeeById = async (req, res, next) => {
  try {
    const filter = getDepartmentFilter(req.user);
    const employee = await Employee.findOne({ _id: req.params.id, ...filter });

    if (!employee) {
      return res.status(404).json({ error: 'Employee not found or access denied.' });
    }

    res.json(employee);
  } catch (err) {
    next(err);
  }
};

// POST /api/employees
const createEmployee = async (req, res, next) => {
  try {
    const { name, department, role, email, status, phone, salary } = req.body;

    if (!name || !department || !role || !email) {
      return res.status(400).json({ error: 'Name, department, role and email are required.' });
    }

    // Check department restriction
    if (req.user && req.user.department !== 'All' && req.user.department !== department) {
      return res.status(403).json({ error: `You can only create employees in the ${req.user.department} department.` });
    }

    const newEmployee = await Employee.create({ 
      name, 
      department, 
      role, 
      email, 
      status,
      phone,
      salary 
    });

    res.status(201).json(newEmployee);
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ error: 'An employee with this email already exists.' });
    }
    next(err);
  }
};

// PUT /api/employees/:id
const updateEmployee = async (req, res, next) => {
  try {
    const { name, department, role, email, status, phone, salary } = req.body;
    const filter = getDepartmentFilter(req.user);

    // If changing department, make sure user has permission to move them to the new department
    if (req.user && req.user.department !== 'All' && department && req.user.department !== department) {
      return res.status(403).json({ error: `You cannot move an employee to a different department.` });
    }

    const updated = await Employee.findOneAndUpdate(
      { _id: req.params.id, ...filter },
      { name, department, role, email, status, phone, salary },
      { new: true, runValidators: true }
    );

    if (!updated) {
      return res.status(404).json({ error: 'Employee not found or access denied.' });
    }

    res.json(updated);
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ error: 'An employee with this email already exists.' });
    }
    next(err);
  }
};

// DELETE /api/employees/:id
const deleteEmployee = async (req, res, next) => {
  try {
    const filter = getDepartmentFilter(req.user);
    const deleted = await Employee.findOneAndDelete({ _id: req.params.id, ...filter });

    if (!deleted) {
      return res.status(404).json({ error: 'Employee not found or access denied.' });
    }

    res.json({ message: 'Employee deleted successfully.' });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getAllEmployees,
  getEmployeeById,
  createEmployee,
  updateEmployee,
  deleteEmployee,
};
