import React, { createContext, useState, useEffect, useCallback } from 'react';

export const EmployeeContext = createContext();

const API_BASE = 'http://localhost:5000/api/employees';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

export const EmployeeProvider = ({ children }) => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ── Fetch all employees from backend ─────────────────────────────────────────
  const fetchEmployees = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(API_BASE, { headers: getAuthHeaders() });
      if (!res.ok) throw new Error('Failed to fetch employees.');
      const data = await res.json();
      
      // Map _id to id for frontend compatibility
      const mappedData = data.map(emp => ({
        ...emp,
        id: emp._id
      }));
      
      setEmployees(mappedData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]);

  // ── Add employee ──────────────────────────────────────────────────────────────
  const addEmployee = async (employee) => {
    try {
      const res = await fetch(API_BASE, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(employee),
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to add employee.');
      }
      const newEmployee = await res.json();
      
      // Map _id to id
      const mappedNewEmployee = { ...newEmployee, id: newEmployee._id };
      
      setEmployees((prev) => [...prev, mappedNewEmployee]);
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  // ── Update employee ───────────────────────────────────────────────────────────
  const updateEmployee = async (updatedEmployee) => {
    try {
      const res = await fetch(`${API_BASE}/${updatedEmployee.id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(updatedEmployee),
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to update employee.');
      }
      const updated = await res.json();
      
      // Map _id to id
      const mappedUpdated = { ...updated, id: updated._id };
      
      setEmployees((prev) =>
        prev.map((emp) => (emp.id === mappedUpdated.id ? mappedUpdated : emp))
      );
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  // ── Delete employee ───────────────────────────────────────────────────────────
  const deleteEmployee = async (id) => {
    try {
      const res = await fetch(`${API_BASE}/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });
      if (!res.ok) throw new Error('Failed to delete employee.');
      setEmployees((prev) => prev.filter((emp) => emp.id !== id));
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  return (
    <EmployeeContext.Provider
      value={{ employees, loading, error, addEmployee, updateEmployee, deleteEmployee, fetchEmployees }}
    >
      {children}
    </EmployeeContext.Provider>
  );
};
