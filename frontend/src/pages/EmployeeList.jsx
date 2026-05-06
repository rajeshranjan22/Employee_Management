import { useContext } from "react";
import { EmployeeContext } from "../context/EmployeeContext";
import { AuthContext } from "../context/AuthContext";
import { DataGrid } from "@mui/x-data-grid";
import { IconButton, CircularProgress, Alert, Avatar } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { useNavigate } from "react-router-dom";

const EmployeeList = () => {
  const { employees, loading, error, deleteEmployee, searchTerm } =
    useContext(EmployeeContext);
  const { user, hasPermission } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleEdit = (id) => {
    navigate(`/edit-employee/${id}`);
  };

  const handleDelete = async (id) => {
    await deleteEmployee(id);
  };

  const filteredEmployees = employees.filter(
    (emp) =>
      emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.department.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const columns = [
    {
      field: "avatar",
      headerName: "",
      width: 60,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: "100%",
          }}
        >
          <Avatar
            src={params.row.avatar}
            alt={params.row.name}
            style={{
              width: 35,
              height: 35,
              background: "var(--accent-color)",
              fontSize: "0.9rem",
            }}
          >
            {params.row.name?.charAt(0) || "?"}
          </Avatar>
        </div>
      ),
    },
    { field: "name", headerName: "Name", width: 180, flex: 1 },
    { field: "department", headerName: "Department", width: 140 },
    { field: "role", headerName: "Role", width: 160, flex: 1 },
    {
      field: "salary",
      headerName: "Salary",
      width: 120,
      valueFormatter: (value) => (value ? `$${value.toLocaleString()}` : "-"),
    },
    {
      field: "joiningDate",
      headerName: "Joined",
      width: 130,
      valueFormatter: (value) =>
        value ? new Date(value).toLocaleDateString() : "-",
    },
    {
      field: "status",
      headerName: "Status",
      width: 120,
      renderCell: (params) => {
        let color =
          params.value === "Active"
            ? "#10b981"
            : params.value === "On Leave"
              ? "#f59e0b"
              : "#ef4444";
        return (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: "100%",
            }}
          >
            <span
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                background: `${color}15`, // Very light transparent background
                color: color,
                padding: "4px 10px",
                borderRadius: "6px",
                fontSize: "0.8rem",
                fontWeight: "700",
                border: `1px solid ${color}30`, // Semi-transparent border
                textTransform: "uppercase",
                letterSpacing: "0.5px",
              }}
            >
              <span
                style={{
                  width: "6px",
                  height: "6px",
                  borderRadius: "50%",
                  backgroundColor: color,
                  boxShadow: `0 0 8px ${color}`, // Soft glow effect
                }}
              ></span>
              {params.value}
            </span>
          </div>
        );
      },
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 120,
      renderCell: (params) => {
        const canEdit = hasPermission("UPDATE_EMPLOYEE");
        const canDelete = hasPermission("DELETE_EMPLOYEE");

        return (
          <div
            style={{
              display: "flex",
              gap: "0.5rem",
              alignItems: "center",
              height: "100%",
            }}
          >
            {canEdit && (
              <IconButton
                size="small"
                style={{ color: "var(--accent-color)" }}
                onClick={() => handleEdit(params.row.id)}
              >
                <EditIcon fontSize="small" />
              </IconButton>
            )}
            {canDelete && (
              <IconButton
                size="small"
                style={{ color: "var(--danger-color)" }}
                onClick={() => handleDelete(params.row.id)}
              >
                <DeleteIcon fontSize="small" />
              </IconButton>
            )}
          </div>
        );
      },
    },
  ];

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "60vh",
        }}
      >
        <CircularProgress style={{ color: "var(--accent-color)" }} size={60} />
      </div>
    );
  }

  return (
    <div style={{ height: "calc(100vh - 150px)", width: "100%" }}>
      <h1 style={{ marginBottom: "2rem", fontSize: "2rem", fontWeight: "600" }}>
        Employee Directory
      </h1>
      {error && (
        <Alert severity="error" style={{ marginBottom: "1rem" }}>
          {error}
        </Alert>
      )}
      <div style={{ height: "100%", width: "100%" }} className="glass-panel">
        <DataGrid
          rows={filteredEmployees}
          columns={columns}
          pageSizeOptions={[5, 10, 20]}
          initialState={{
            pagination: { paginationModel: { pageSize: 10 } },
          }}
          disableRowSelectionOnClick
          sx={{ border: 0 }}
        />
      </div>
    </div>
  );
};

export default EmployeeList;
