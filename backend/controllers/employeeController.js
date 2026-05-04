const Employee = require('../models/Employee');

// GET /api/employees
const getAllEmployees = async (req, res, next) => {
  try {
    const employees = await Employee.find().sort({ createdAt: -1 });
    res.json(employees);
  } catch (err) {
    next(err);
  }
};

// GET /api/employees/:id
const getEmployeeById = async (req, res, next) => {
  try {
    const employee = await Employee.findById(req.params.id);

    if (!employee) {
      return res.status(404).json({ error: 'Employee not found.' });
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

    const updated = await Employee.findByIdAndUpdate(
      req.params.id,
      { name, department, role, email, status, phone, salary },
      { new: true, runValidators: true }
    );

    if (!updated) {
      return res.status(404).json({ error: 'Employee not found.' });
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
    const deleted = await Employee.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({ error: 'Employee not found.' });
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
