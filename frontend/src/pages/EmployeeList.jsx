import { useContext, useState } from "react";
import { EmployeeContext } from "../context/EmployeeContext";
import { AuthContext } from "../context/AuthContext";
import { DataGrid } from "@mui/x-data-grid";
import { 
  IconButton, 
  CircularProgress, 
  Alert, 
  Avatar, 
  Box, 
  Typography, 
  Chip, 
  Tooltip,
  Paper,
  Button,
  Stack
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import { useNavigate } from "react-router-dom";

const EmployeeList = () => {
  const { employees, loading, error, deleteEmployee, searchTerm } =
    useContext(EmployeeContext);
  const { hasPermission } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleEdit = (id) => {
    navigate(`/edit-employee/${id}`);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to remove this employee?")) {
      await deleteEmployee(id);
    }
  };

  const filteredEmployees = employees.filter(
    (emp) =>
      emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.department.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const columns = [
    {
      field: "user",
      headerName: "Employee",
      width: 250,
      flex: 1.5,
      renderCell: (params) => (
        <Box sx={{ display: "flex", alignItems: "center", gap: 2, height: "100%" }}>
          <Avatar
            src={params.row.avatar}
            alt={params.row.name}
            sx={{
              width: 40,
              height: 40,
              bgcolor: "var(--accent-color)",
              fontSize: "1rem",
              fontWeight: "600",
              boxShadow: "0 4px 10px rgba(0,0,0,0.2)"
            }}
          >
            {params.row.name?.charAt(0) || "?"}
          </Avatar>
          <Box>
            <Typography variant="body2" sx={{ fontWeight: "700", color: "var(--text-main)", lineHeight: 1.2 }}>
              {params.row.name}
            </Typography>
            <Typography variant="caption" sx={{ color: "var(--text-muted)" }}>
              {params.row.email}
            </Typography>
          </Box>
        </Box>
      ),
    },
    { 
      field: "department", 
      headerName: "Department", 
      width: 150,
      renderCell: (params) => (
        <Chip 
          label={params.value} 
          size="small" 
          variant="outlined" 
          sx={{ borderColor: "rgba(255,255,255,0.1)", color: "var(--text-muted)" }} 
        />
      )
    },
    { 
      field: "role", 
      headerName: "Designation", 
      width: 180, 
      flex: 1,
      renderCell: (params) => (
        <Typography variant="body2" sx={{ color: "var(--text-main)", fontWeight: "500" }}>
          {params.value}
        </Typography>
      )
    },
    {
      field: "salary",
      headerName: "Salary",
      width: 130,
      renderCell: (params) => (
        <Typography variant="body2" sx={{ fontWeight: "600", color: "var(--success-color)" }}>
          {params.value ? `$${params.value.toLocaleString()}` : "-"}
        </Typography>
      )
    },
    {
      field: "status",
      headerName: "Status",
      width: 140,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => {
        let color =
          params.value === "Active"
            ? "success"
            : params.value === "On Leave"
              ? "warning"
              : "error";
        return (
          <Chip
            label={params.value}
            color={color}
            size="small"
            variant="soft"
            sx={{ 
              fontWeight: "700", 
              fontSize: "0.7rem", 
              px: 0.5,
              background: color === 'success' ? 'rgba(16, 185, 129, 0.15)' : color === 'warning' ? 'rgba(245, 158, 11, 0.15)' : 'rgba(239, 68, 68, 0.15)',
              color: color === 'success' ? '#10b981' : color === 'warning' ? '#f59e0b' : '#ef4444',
              border: "1px solid transparent"
            }}
          />
        );
      },
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 120,
      sortable: false,
      align: "right",
      headerAlign: "right",
      renderCell: (params) => {
        const canEdit = hasPermission("UPDATE_EMPLOYEE");
        const canDelete = hasPermission("DELETE_EMPLOYEE");

        return (
          <Stack direction="row" spacing={1} sx={{ justifyContent: "flex-end", alignItems: "center", height: "100%" }}>
            {canEdit && (
              <Tooltip title="Edit Employee">
                <IconButton
                  size="small"
                  sx={{ color: "var(--accent-color)", "&:hover": { background: "rgba(59, 130, 246, 0.1)" } }}
                  onClick={() => handleEdit(params.row.id)}
                >
                  <EditIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            )}
            {canDelete && (
              <Tooltip title="Delete Employee">
                <IconButton
                  size="small"
                  sx={{ color: "var(--danger-color)", "&:hover": { background: "rgba(239, 68, 68, 0.1)" } }}
                  onClick={() => handleDelete(params.row.id)}
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            )}
          </Stack>
        );
      },
    },
  ];

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "60vh", flexDirection: "column", gap: 2 }}>
        <CircularProgress sx={{ color: "var(--accent-color)" }} size={50} />
        <Typography color="var(--text-muted)">Loading directory...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ height: "calc(100vh - 180px)", width: "100%" }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 4 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: "700", mb: 0.5 }}>
            Employee Directory
          </Typography>
          <Typography variant="body2" sx={{ color: "var(--text-muted)" }}>
            Manage and view all employee information in one place.
          </Typography>
        </Box>
        {hasPermission("CREATE_EMPLOYEE") && (
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => navigate("/add-employee")}
            sx={{ 
              background: "var(--accent-color)",
              padding: "10px 24px",
              borderRadius: "10px",
              boxShadow: "0 4px 15px rgba(59, 130, 246, 0.3)",
              "&:hover": { background: "var(--accent-hover)" }
            }}
          >
            Add Employee
          </Button>
        )}
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3, borderRadius: "10px" }}>
          {error}
        </Alert>
      )}

      <Paper className="glass-panel" sx={{ height: "100%", width: "100%", overflow: "hidden" }}>
        <DataGrid
          rows={filteredEmployees}
          columns={columns}
          pageSizeOptions={[10, 20, 50]}
          initialState={{
            pagination: { paginationModel: { pageSize: 10 } },
          }}
          disableRowSelectionOnClick
          sx={{ 
            border: 0,
            "& .MuiDataGrid-cell:focus": { outline: "none" },
            "& .MuiDataGrid-columnHeader:focus": { outline: "none" },
            "& .MuiDataGrid-row:hover": {
              backgroundColor: "rgba(255, 255, 255, 0.03)",
            }
          }}
        />
      </Paper>
    </Box>
  );
};

export default EmployeeList;
