// In-memory employee data store (acts as mock database)
// Seeded with the same initial data previously in the frontend

let employees = [
  { id: 1, name: 'John Doe',        department: 'Engineering', role: 'Software Engineer',    email: 'john@example.com',    status: 'Active'   },
  { id: 2, name: 'Jane Smith',      department: 'Design',      role: 'UX Designer',          email: 'jane@example.com',    status: 'Active'   },
  { id: 3, name: 'Robert Johnson',  department: 'HR',          role: 'HR Manager',           email: 'robert@example.com',  status: 'On Leave' },
  { id: 4, name: 'Emily Davis',     department: 'Marketing',   role: 'Marketing Specialist', email: 'emily@example.com',   status: 'Active'   },
  { id: 5, name: 'Michael Wilson',  department: 'Engineering', role: 'DevOps Engineer',      email: 'michael@example.com', status: 'Inactive' },
];

let nextId = 6;

const getAll = () => employees;

const getById = (id) => employees.find((e) => e.id === id);

const create = ({ name, department, role, email, status }) => {
  const newEmployee = { id: nextId++, name, department, role, email, status: status || 'Active' };
  employees.push(newEmployee);
  return newEmployee;
};

const update = (id, updates) => {
  const index = employees.findIndex((e) => e.id === id);
  if (index === -1) return null;
  employees[index] = { ...employees[index], ...updates, id };
  return employees[index];
};

const remove = (id) => {
  const index = employees.findIndex((e) => e.id === id);
  if (index === -1) return false;
  employees.splice(index, 1);
  return true;
};

module.exports = { getAll, getById, create, update, remove };
