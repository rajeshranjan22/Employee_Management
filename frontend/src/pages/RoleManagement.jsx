import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Paper,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Alert
} from "@mui/material";

const ALL_PERMISSIONS = [
  'VIEW_EMPLOYEES',
  'CREATE_EMPLOYEE',
  'UPDATE_EMPLOYEE',
  'DELETE_EMPLOYEE',
  'MANAGE_ROLES',
  'VIEW_ACTIVITY_LOGS'
];

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const RoleManagement = () => {
  const [roles, setRoles] = useState([]);
  const [open, setOpen] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({ id: null, name: '', description: '', permissions: [] });

  const fetchRoles = async () => {
    try {
      const res = await fetch(`${API_BASE}/roles`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });
      const data = await res.json();
      if (res.ok) setRoles(data);
    } catch (err) {
      console.error("Failed to fetch roles", err);
    }
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  const handleOpen = (role = null) => {
    if (role) {
      setFormData({ id: role._id, name: role.name, description: role.description || '', permissions: role.permissions || [] });
    } else {
      setFormData({ id: null, name: '', description: '', permissions: [] });
    }
    setError('');
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  const handlePermissionToggle = (perm) => {
    setFormData(prev => {
      const perms = prev.permissions.includes(perm)
        ? prev.permissions.filter(p => p !== perm)
        : [...prev.permissions, perm];
      return { ...prev, permissions: perms };
    });
  };

  const handleSubmit = async () => {
    try {
      const isEdit = !!formData.id;
      const url = isEdit ? `${API_BASE}/roles/${formData.id}` : `${API_BASE}/roles`;
      const method = isEdit ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify(formData)
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Operation failed');

      await fetchRoles();
      handleClose();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this role?")) return;
    try {
      await fetch(`${API_BASE}/roles/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });
      fetchRoles();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4" fontWeight="bold">Role Management</Typography>
        <Button variant="contained" onClick={() => handleOpen()}>Create Custom Role</Button>
      </Box>

      <TableContainer component={Paper} sx={{ bgcolor: 'background.paper', borderRadius: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold' }}>Role Name</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Type</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Permissions</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {roles.map(role => (
              <TableRow key={role._id}>
                <TableCell>{role.name}</TableCell>
                <TableCell>
                  <Chip size="small" label={role.isCustom ? "Custom" : "System"} color={role.isCustom ? "primary" : "default"} />
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {role.permissions.map(p => (
                      <Chip key={p} label={p} size="small" variant="outlined" />
                    ))}
                  </Box>
                </TableCell>
                <TableCell>
                  {role.isCustom && (
                    <>
                      <Button size="small" onClick={() => handleOpen(role)}>Edit</Button>
                      <Button size="small" color="error" onClick={() => handleDelete(role._id)}>Delete</Button>
                    </>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>{formData.id ? 'Edit Role' : 'Create Role'}</DialogTitle>
        <DialogContent>
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          <TextField
            fullWidth
            label="Role Name"
            margin="normal"
            value={formData.name}
            onChange={e => setFormData({...formData, name: e.target.value})}
          />
          <TextField
            fullWidth
            label="Description"
            margin="normal"
            value={formData.description}
            onChange={e => setFormData({...formData, description: e.target.value})}
          />
          <Typography variant="subtitle1" sx={{ mt: 2, mb: 1, fontWeight: 'bold' }}>Permissions</Typography>
          <FormControl component="fieldset">
            <FormGroup>
              {ALL_PERMISSIONS.map(perm => (
                <FormControlLabel
                  key={perm}
                  control={<Checkbox checked={formData.permissions.includes(perm)} onChange={() => handlePermissionToggle(perm)} />}
                  label={perm}
                />
              ))}
            </FormGroup>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">Save</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default RoleManagement;
