const employeeStore = require('../models/employeeStore');

// GET /api/employees
const getAllEmployees = (req, res) => {
  const employees = employeeStore.getAll();
  res.json(employees);
};

// GET /api/employees/:id
const getEmployeeById = (req, res) => {
  const id = parseInt(req.params.id);
  const employee = employeeStore.getById(id);

  if (!employee) {
    return res.status(404).json({ error: 'Employee not found.' });
  }

  res.json(employee);
};

// POST /api/employees
const createEmployee = (req, res) => {
  const { name, department, role, email, status } = req.body;

  if (!name || !department || !role || !email) {
    return res.status(400).json({ error: 'Name, department, role and email are required.' });
  }

  const newEmployee = employeeStore.create({ name, department, role, email, status });
  res.status(201).json(newEmployee);
};

// PUT /api/employees/:id
const updateEmployee = (req, res) => {
  const id = parseInt(req.params.id);
  const { name, department, role, email, status } = req.body;

  const updated = employeeStore.update(id, { name, department, role, email, status });

  if (!updated) {
    return res.status(404).json({ error: 'Employee not found.' });
  }

  res.json(updated);
};

// DELETE /api/employees/:id
const deleteEmployee = (req, res) => {
  const id = parseInt(req.params.id);
  const deleted = employeeStore.remove(id);

  if (!deleted) {
    return res.status(404).json({ error: 'Employee not found.' });
  }

  res.json({ message: 'Employee deleted successfully.' });
};

module.exports = {
  getAllEmployees,
  getEmployeeById,
  createEmployee,
  updateEmployee,
  deleteEmployee,
};
