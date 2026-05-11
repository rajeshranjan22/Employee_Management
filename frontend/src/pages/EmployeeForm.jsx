import { useState, useContext, useEffect } from "react";
import { EmployeeContext } from "../context/EmployeeContext";
import { useNavigate, useParams } from "react-router-dom";
import { 
  Alert, 
  TextField, 
  Button, 
  MenuItem, 
  Select, 
  InputLabel, 
  FormControl, 
  Paper, 
  Box, 
  Typography, 
  Grid,
  Avatar,
  Divider,
  CircularProgress
} from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import SaveIcon from "@mui/icons-material/Save";

const DEPARTMENTS = ["Engineering", "Design", "HR", "Marketing", "Finance", "Operations", "Sales"];
const ROLES = ["Admin", "Manager", "Developer", "Designer", "HR Specialist", "Sales Lead", "Intern"];

const EmployeeForm = () => {
  const { employees, addEmployee, updateEmployee } = useContext(EmployeeContext);
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
    <Box sx={{ maxWidth: "900px", margin: "0 auto" }}>
      <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 4 }}>
        <IconButton onClick={() => navigate("/employees")} sx={{ color: "var(--text-muted)" }}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h4" sx={{ fontWeight: "700" }}>
          {isEditing ? "Update Employee Profile" : "Add New Employee"}
        </Typography>
      </Box>

      {submitError && (
        <Alert severity="error" sx={{ mb: 3, borderRadius: "10px" }}>
          {submitError}
        </Alert>
      )}

      <form onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          {/* Left Column: Avatar & Basic Info */}
          <Grid item xs={12} md={4}>
            <Paper className="glass-panel" sx={{ p: 4, textAlign: "center", height: "100%" }}>
              <Box sx={{ position: "relative", display: "inline-block", mb: 3 }}>
                <Avatar
                  src={formData.avatar}
                  sx={{ 
                    width: 120, 
                    height: 120, 
                    margin: "0 auto", 
                    bgcolor: "var(--accent-color)",
                    fontSize: "3rem",
                    boxShadow: "0 8px 25px rgba(59, 130, 246, 0.4)"
                  }}
                >
                  {formData.name?.charAt(0) || <PersonIcon sx={{ fontSize: 60 }} />}
                </Avatar>
              </Box>
              <Typography variant="h6" sx={{ fontWeight: "600", mb: 1 }}>
                {formData.name || "Employee Name"}
              </Typography>
              <Typography variant="body2" sx={{ color: "var(--text-muted)", mb: 3 }}>
                {formData.role || "Designation"}
              </Typography>
              
              <TextField
                fullWidth
                label="Avatar URL"
                name="avatar"
                value={formData.avatar}
                onChange={handleChange}
                placeholder="https://image.url"
                size="small"
                sx={inputStyles}
              />
              <Typography variant="caption" sx={{ color: "var(--text-muted)", mt: 1, display: "block" }}>
                Provide a URL for the profile picture.
              </Typography>
            </Paper>
          </Grid>

          {/* Right Column: Detailed Info */}
          <Grid item xs={12} md={8}>
            <Paper className="glass-panel" sx={{ p: 4 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: "700", mb: 3, color: "var(--accent-color)" }}>
                Personal & Professional Details
              </Typography>
              
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Full Name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    sx={inputStyles}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
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
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Phone Number"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    sx={inputStyles}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth sx={inputStyles}>
                    <InputLabel id="dept-label">Department</InputLabel>
                    <Select
                      labelId="dept-label"
                      name="department"
                      value={formData.department}
                      label="Department"
                      onChange={handleChange}
                      required
                    >
                      {DEPARTMENTS.map(dept => (
                        <MenuItem key={dept} value={dept}>{dept}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth sx={inputStyles}>
                    <InputLabel id="role-label">Designation</InputLabel>
                    <Select
                      labelId="role-label"
                      name="role"
                      value={formData.role}
                      label="Designation"
                      onChange={handleChange}
                      required
                    >
                      {ROLES.map(role => (
                        <MenuItem key={role} value={role}>{role}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Annual Salary ($)"
                    name="salary"
                    type="number"
                    value={formData.salary}
                    onChange={handleChange}
                    sx={inputStyles}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
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
                </Grid>
                <Grid item xs={12}>
                  <FormControl fullWidth sx={inputStyles}>
                    <InputLabel id="status-label">Employment Status</InputLabel>
                    <Select
                      labelId="status-label"
                      name="status"
                      value={formData.status}
                      label="Employment Status"
                      onChange={handleChange}
                    >
                      <MenuItem value="Active">Active</MenuItem>
                      <MenuItem value="On Leave">On Leave</MenuItem>
                      <MenuItem value="Inactive">Inactive</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>

              <Divider sx={{ my: 4, borderColor: "rgba(255,255,255,0.05)" }} />

              <Box sx={{ display: "flex", gap: 2 }}>
                <Button
                  type="submit"
                  variant="contained"
                  disabled={submitting}
                  startIcon={submitting ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
                  sx={{ 
                    background: "var(--accent-color)", 
                    flex: 2,
                    padding: "12px",
                    fontWeight: "700",
                    "&:hover": { background: "var(--accent-hover)" }
                  }}
                >
                  {submitting ? "Processing..." : isEditing ? "Save Changes" : "Create Employee"}
                </Button>
                <Button
                  variant="outlined"
                  onClick={() => navigate("/employees")}
                  sx={{ 
                    flex: 1,
                    borderColor: "var(--border-color)",
                    color: "var(--text-main)",
                    fontWeight: "600"
                  }}
                >
                  Cancel
                </Button>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </form>
    </Box>
  );
};

export default EmployeeForm;
