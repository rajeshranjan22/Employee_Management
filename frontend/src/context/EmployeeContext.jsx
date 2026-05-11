import { createContext, useState, useEffect, useCallback, useContext } from "react";
import api from "../api/axios.instance";
import { AuthContext } from "./AuthContext";

export const EmployeeContext = createContext();

export const EmployeeProvider = ({ children }) => {
  const { isAuthenticated } = useContext(AuthContext);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  // ── Fetch all employees from backend
  const fetchEmployees = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const { data } = await api.get("/employees");

      // Map _id to id for frontend compatibility
      const mappedData = data.map((emp) => ({
        ...emp,
        id: emp._id,
      }));

      setEmployees(mappedData);
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Failed to fetch employees.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      fetchEmployees();
    }
  }, [fetchEmployees, isAuthenticated]);

  //  Add employee
  const addEmployee = async (employee) => {
    try {
      const { data } = await api.post("/employees", employee);
      
      // Map _id to id
      const mappedNewEmployee = { ...data, id: data._id };

      setEmployees((prev) => [...prev, mappedNewEmployee]);
      return { success: true };
    } catch (err) {
      return { success: false, error: err.response?.data?.error || err.message || "Failed to add employee." };
    }
  };

  //  Update employee
  const updateEmployee = async (updatedEmployee) => {
    try {
      const { data } = await api.put(`/employees/${updatedEmployee.id}`, updatedEmployee);
      
      // Map _id to id
      const mappedUpdated = { ...data, id: data._id };

      setEmployees((prev) =>
        prev.map((emp) => (emp.id === mappedUpdated.id ? mappedUpdated : emp)),
      );
      return { success: true };
    } catch (err) {
      return { success: false, error: err.response?.data?.error || err.message || "Failed to update employee." };
    }
  };

  //  Delete employee
  const deleteEmployee = async (id) => {
    try {
      await api.delete(`/employees/${id}`);
      setEmployees((prev) => prev.filter((emp) => emp.id !== id));
      return { success: true };
    } catch (err) {
      return { success: false, error: err.response?.data?.message || err.message || "Failed to delete employee." };
    }
  };

  return (
    <EmployeeContext.Provider
      value={{
        employees,
        loading,
        error,
        addEmployee,
        updateEmployee,
        deleteEmployee,
        fetchEmployees,
        searchTerm,
        setSearchTerm,
      }}
    >
      {children}
    </EmployeeContext.Provider>
  );
};
