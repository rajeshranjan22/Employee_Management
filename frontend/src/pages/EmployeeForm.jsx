import { useState, useContext, useEffect } from "react";
import { EmployeeContext } from "../context/EmployeeContext";
import { useNavigate, useParams } from "react-router-dom";
import { Alert } from "@mui/material";
import {
  TextField,
  Button,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
} from "@mui/material";

const EmployeeForm = () => {
  const { employees, addEmployee, updateEmployee } =
    useContext(EmployeeContext);
  const navigate = useNavigate();
  const { id } = useParams();

  const isEditing = Boolean(id);
  const [submitError, setSubmitError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    department: "",
    role: "",
    email: "",
    phone: "",
    salary: "",
    joiningDate: new Date().toISOString().split("T")[0],
    avatar: "",
    status: "Active",
  });

  useEffect(() => {
    if (isEditing) {
      const employeeToEdit = employees.find((emp) => emp.id === id);
      if (employeeToEdit) {
        setFormData({
          ...employeeToEdit,
          joiningDate: employeeToEdit.joiningDate
            ? new Date(employeeToEdit.joiningDate).toISOString().split("T")[0]
            : "",
        });
      }
    }
  }, [id, employees, isEditing]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError(null);
    setSubmitting(true);
    const result = isEditing
      ? await updateEmployee(formData)
      : await addEmployee(formData);
    setSubmitting(false);
    if (result && result.success === false) {
      setSubmitError(result.error || "Operation failed. Please try again.");
      return;
    }
    navigate("/employees");
  };

  const inputStyles = {
    marginBottom: "1.5rem",
    "& .MuiOutlinedInput-root": {
      "& fieldset": { borderColor: "var(--border-color)" },
      "&:hover fieldset": { borderColor: "var(--text-muted)" },
      "&.Mui-focused fieldset": { borderColor: "var(--accent-color)" },
    },
    "& .MuiInputLabel-root": { color: "var(--text-muted)" },
    "& .MuiInputLabel-root.Mui-focused": { color: "var(--accent-color)" },
    "& .MuiInputBase-input": { color: "var(--text-main)" },
  };

  return (
    <div style={{ maxWidth: "600px", margin: "0 auto" }}>
      {submitError && (
        <Alert severity="error" style={{ marginBottom: "1rem" }}>
          {submitError}
        </Alert>
      )}
      <h1 style={{ marginBottom: "2rem", fontSize: "2rem", fontWeight: "600" }}>
        {isEditing ? "Edit Employee" : "Add New Employee"}
      </h1>

      <form
        onSubmit={handleSubmit}
        className="glass-panel"
        style={{ padding: "2.5rem" }}
      >
        <TextField
          fullWidth
          label="Full Name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          sx={inputStyles}
        />

        <TextField
          fullWidth
          label="Email Address"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          required
          sx={inputStyles}
        />

        <TextField
          fullWidth
          label="Phone Number"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          sx={inputStyles}
        />

        <div style={{ display: "flex", gap: "1rem" }}>
          <TextField
            fullWidth
            label="Department"
            name="department"
            value={formData.department}
            onChange={handleChange}
            required
            sx={inputStyles}
          />
          <TextField
            fullWidth
            label="Role"
            name="role"
            value={formData.role}
            onChange={handleChange}
            required
            sx={inputStyles}
          />
        </div>

        <div style={{ display: "flex", gap: "1rem" }}>
          <TextField
            fullWidth
            label="Salary"
            name="salary"
            type="number"
            value={formData.salary}
            onChange={handleChange}
            sx={inputStyles}
          />
          <TextField
            fullWidth
            label="Joining Date"
            name="joiningDate"
            type="date"
            value={formData.joiningDate}
            onChange={handleChange}
            InputLabelProps={{ shrink: true }}
            sx={inputStyles}
          />
        </div>

        <TextField
          fullWidth
          label="Avatar URL (Optional)"
          name="avatar"
          value={formData.avatar}
          onChange={handleChange}
          placeholder="https://example.com/photo.jpg"
          sx={inputStyles}
        />

        <FormControl fullWidth sx={inputStyles}>
          <InputLabel id="status-label">Status</InputLabel>
          <Select
            labelId="status-label"
            name="status"
            value={formData.status}
            label="Status"
            onChange={handleChange}
            sx={{
              color: "var(--text-main)",
              ".MuiOutlinedInput-notchedOutline": {
                borderColor: "var(--border-color)",
              },
              "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                borderColor: "var(--accent-color)",
              },
              "&:hover .MuiOutlinedInput-notchedOutline": {
                borderColor: "var(--text-muted)",
              },
              ".MuiSvgIcon-root ": { fill: "var(--text-muted)" },
            }}
          >
            <MenuItem value="Active">Active</MenuItem>
            <MenuItem value="On Leave">On Leave</MenuItem>
            <MenuItem value="Inactive">Inactive</MenuItem>
          </Select>
        </FormControl>

        <div style={{ display: "flex", gap: "1rem", marginTop: "2rem" }}>
          <Button
            type="submit"
            variant="contained"
            fullWidth
            disabled={submitting}
            style={{
              background: "var(--accent-color)",
              color: "#fff",
              padding: "0.8rem",
              fontWeight: "600",
              fontSize: "1rem",
            }}
            className="hover-scale"
          >
            {submitting
              ? "Saving..."
              : isEditing
                ? "Update Employee"
                : "Save Employee"}
          </Button>
          <Button
            variant="outlined"
            fullWidth
            onClick={() => navigate("/employees")}
            style={{
              borderColor: "var(--border-color)",
              color: "var(--text-main)",
              padding: "0.8rem",
              fontWeight: "600",
            }}
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
};

export default EmployeeForm;
