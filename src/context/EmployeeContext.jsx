import React, { createContext, useState } from 'react';

export const EmployeeContext = createContext();

const initialEmployees = [
  { id: 1, name: 'John Doe', department: 'Engineering', role: 'Software Engineer', email: 'john@example.com', status: 'Active' },
  { id: 2, name: 'Jane Smith', department: 'Design', role: 'UX Designer', email: 'jane@example.com', status: 'Active' },
  { id: 3, name: 'Robert Johnson', department: 'HR', role: 'HR Manager', email: 'robert@example.com', status: 'On Leave' },
  { id: 4, name: 'Emily Davis', department: 'Marketing', role: 'Marketing Specialist', email: 'emily@example.com', status: 'Active' },
  { id: 5, name: 'Michael Wilson', department: 'Engineering', role: 'DevOps Engineer', email: 'michael@example.com', status: 'Inactive' },
];

export const EmployeeProvider = ({ children }) => {
  const [employees, setEmployees] = useState(initialEmployees);

  const addEmployee = (employee) => {
    setEmployees([...employees, { ...employee, id: employees.length + 1 }]);
  };

  const updateEmployee = (updatedEmployee) => {
    setEmployees(employees.map(emp => emp.id === updatedEmployee.id ? updatedEmployee : emp));
  };

  const deleteEmployee = (id) => {
    setEmployees(employees.filter(emp => emp.id !== id));
  };

  return (
    <EmployeeContext.Provider value={{ employees, addEmployee, updateEmployee, deleteEmployee }}>
      {children}
    </EmployeeContext.Provider>
  );
};
