import React, { useContext } from 'react';
import { EmployeeContext } from '../context/EmployeeContext';
import { DataGrid } from '@mui/x-data-grid';
import { IconButton, CircularProgress, Alert } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { useNavigate } from 'react-router-dom';

const EmployeeList = () => {
  const { employees, loading, error, deleteEmployee } = useContext(EmployeeContext);
  const navigate = useNavigate();

  const handleEdit = (id) => {
    navigate(`/edit-employee/${id}`);
  };

  const handleDelete = async (id) => {
    await deleteEmployee(id);
  };

  const columns = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'name', headerName: 'Name', width: 200, flex: 1 },
    { field: 'department', headerName: 'Department', width: 180 },
    { field: 'role', headerName: 'Role', width: 200, flex: 1 },
    { field: 'email', headerName: 'Email', width: 250, flex: 1 },
    {
      field: 'status',
      headerName: 'Status',
      width: 130,
      renderCell: (params) => {
        let color = params.value === 'Active' ? 'var(--success-color)' : 
                    params.value === 'On Leave' ? 'var(--warning-color)' : 'var(--danger-color)';
        return (
          <span style={{
            background: `rgba(255, 255, 255, 0.1)`,
            color: color,
            padding: '4px 12px',
            borderRadius: '20px',
            fontSize: '0.85rem',
            fontWeight: '600',
            border: `1px solid ${color}`
          }}>
            {params.value}
          </span>
        );
      }
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 120,
      renderCell: (params) => (
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', height: '100%' }}>
          <IconButton 
            size="small" 
            style={{ color: 'var(--accent-color)' }}
            onClick={() => handleEdit(params.row.id)}
          >
            <EditIcon fontSize="small" />
          </IconButton>
          <IconButton 
            size="small" 
            style={{ color: 'var(--danger-color)' }}
            onClick={() => handleDelete(params.row.id)}
          >
            <DeleteIcon fontSize="small" />
          </IconButton>
        </div>
      ),
    },
  ];

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
        <CircularProgress style={{ color: 'var(--accent-color)' }} size={60} />
      </div>
    );
  }

  return (
    <div style={{ height: 'calc(100vh - 150px)', width: '100%' }}>
      <h1 style={{ marginBottom: '2rem', fontSize: '2rem', fontWeight: '600' }}>Employee Directory</h1>
      {error && <Alert severity="error" style={{ marginBottom: '1rem' }}>{error}</Alert>}
      <div style={{ height: '100%', width: '100%' }} className="glass-panel">
        <DataGrid
          rows={employees}
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
