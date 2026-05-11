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
  Alert,
  CircularProgress,
  IconButton,
  Tooltip,
  Divider
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import SecurityIcon from "@mui/icons-material/Security";
import api from "../api/axios.instance";

const ALL_PERMISSIONS = [
  'VIEW_EMPLOYEES',
  'CREATE_EMPLOYEE',
  'UPDATE_EMPLOYEE',
  'DELETE_EMPLOYEE',
  'MANAGE_ROLES',
  'VIEW_ATTENDANCE',
  'MANAGE_ATTENDANCE',
  'MANAGE_SHIFTS',
  'VIEW_ACTIVITY_LOGS'
];

const RoleManagement = () => {
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({ id: null, name: '', description: '', permissions: [] });

  const fetchRoles = async () => {
    try {
      setLoading(true);
      const { data } = await api.get("/roles");
      setRoles(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch roles");
    } finally {
      setLoading(false);
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
    if (!formData.name.trim()) {
      setError("Role name is required");
      return;
    }
    try {
      setSaving(true);
      setError('');
      const isEdit = !!formData.id;
      
      if (isEdit) {
        await api.put(`/roles/${formData.id}`, formData);
      } else {
        await api.post("/roles", formData);
      }

      await fetchRoles();
      handleClose();
    } catch (err) {
      setError(err.response?.data?.error || err.response?.data?.message || 'Operation failed');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this role? This might affect users assigned to it.")) return;
    try {
      await api.delete(`/roles/${id}`);
      await fetchRoles();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete role");
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" fontWeight="bold">Role & Permissions</Typography>
        <Button 
          variant="contained" 
          startIcon={<AddIcon />} 
          onClick={() => handleOpen()}
          sx={{ background: "var(--accent-color)" }}
        >
          Create Custom Role
        </Button>
      </Box>

      {error && !open && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <TableContainer component={Paper} className="glass-panel">
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold', color: 'var(--text-muted)' }}>Role Name</TableCell>
              <TableCell sx={{ fontWeight: 'bold', color: 'var(--text-muted)' }}>Type</TableCell>
              <TableCell sx={{ fontWeight: 'bold', color: 'var(--text-muted)' }}>Permissions</TableCell>
              <TableCell sx={{ fontWeight: 'bold', color: 'var(--text-muted)' }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={4} align="center" sx={{ py: 4 }}>
                  <CircularProgress size={32} />
                </TableCell>
              </TableRow>
            ) : roles.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} align="center" sx={{ py: 4, color: 'var(--text-muted)' }}>
                  No roles found.
                </TableCell>
              </TableRow>
            ) : (
              roles.map(role => (
                <TableRow key={role._id} hover>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <SecurityIcon fontSize="small" sx={{ color: role.isCustom ? 'var(--accent-color)' : 'var(--text-muted)' }} />
                      <Typography fontWeight={500}>{role.name}</Typography>
                    </Box>
                    <Typography variant="caption" color="var(--text-muted)">{role.description}</Typography>
                  </TableCell>
                  <TableCell>
                    <Chip 
                      size="small" 
                      label={role.isCustom ? "Custom" : "System"} 
                      sx={{ 
                        background: role.isCustom ? 'rgba(59, 130, 246, 0.1)' : 'rgba(148, 163, 184, 0.1)',
                        color: role.isCustom ? 'var(--accent-color)' : 'var(--text-muted)',
                        fontWeight: 600
                      }} 
                    />
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, maxWidth: 500 }}>
                      {role.name === 'Super Admin' ? (
                        <Chip label="ALL ACCESS" size="small" color="primary" variant="filled" />
                      ) : (
                        role.permissions.map(p => (
                          <Chip key={p} label={p} size="small" variant="outlined" sx={{ fontSize: '0.65rem' }} />
                        ))
                      )}
                    </Box>
                  </TableCell>
                  <TableCell>
                    {role.isCustom ? (
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Tooltip title="Edit Role">
                          <IconButton size="small" color="primary" onClick={() => handleOpen(role)}>
                            <EditIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete Role">
                          <IconButton size="small" color="error" onClick={() => handleDelete(role._id)}>
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    ) : (
                      <Typography variant="caption" color="var(--text-muted)">System Default</Typography>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 'bold' }}>
          {formData.id ? 'Edit Role' : 'Create Custom Role'}
        </DialogTitle>
        <Divider />
        <DialogContent>
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          <TextField
            fullWidth
            label="Role Name"
            margin="normal"
            value={formData.name}
            onChange={e => setFormData({...formData, name: e.target.value})}
            placeholder="e.g. Project Manager"
          />
          <TextField
            fullWidth
            label="Description"
            margin="normal"
            multiline
            rows={2}
            value={formData.description}
            onChange={e => setFormData({...formData, description: e.target.value})}
            placeholder="Briefly describe the purpose of this role"
          />
          
          <Box sx={{ mt: 3 }}>
            <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 'bold', color: 'var(--accent-color)' }}>
              Permissions
            </Typography>
            <Paper variant="outlined" sx={{ p: 2, background: 'rgba(0,0,0,0.05)' }}>
              <FormGroup sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1 }}>
                {ALL_PERMISSIONS.map(perm => (
                  <FormControlLabel
                    key={perm}
                    control={
                      <Checkbox 
                        size="small"
                        checked={formData.permissions.includes(perm)} 
                        onChange={() => handlePermissionToggle(perm)} 
                      />
                    }
                    label={<Typography variant="body2">{perm.replace(/_/g, ' ')}</Typography>}
                  />
                ))}
              </FormGroup>
            </Paper>
            <Typography variant="caption" color="var(--text-muted)" sx={{ mt: 1, display: 'block' }}>
              Select the actions this role is allowed to perform across the system.
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={handleClose} disabled={saving}>Cancel</Button>
          <Button 
            onClick={handleSubmit} 
            variant="contained" 
            disabled={saving}
            startIcon={saving && <CircularProgress size={16} color="inherit" />}
          >
            {saving ? 'Saving...' : formData.id ? 'Update Role' : 'Create Role'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default RoleManagement;
