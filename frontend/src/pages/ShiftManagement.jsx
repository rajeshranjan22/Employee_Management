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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
  IconButton
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const ShiftManagement = () => {
  const [shifts, setShifts] = useState([]);
  const [open, setOpen] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({ id: null, name: '', startTime: '09:00', endTime: '18:00', gracePeriod: 15 });

  const fetchShifts = async () => {
    try {
      const res = await fetch(`${API_BASE}/shifts`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });
      const data = await res.json();
      if (res.ok) setShifts(data);
    } catch (err) {
      console.error("Failed to fetch shifts", err);
    }
  };

  useEffect(() => {
    fetchShifts();
  }, []);

  const handleOpen = (shift = null) => {
    if (shift) {
      setFormData({ id: shift._id, name: shift.name, startTime: shift.startTime, endTime: shift.endTime, gracePeriod: shift.gracePeriod });
    } else {
      setFormData({ id: null, name: '', startTime: '09:00', endTime: '18:00', gracePeriod: 15 });
    }
    setError('');
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  const handleSubmit = async () => {
    try {
      const isEdit = !!formData.id;
      const url = isEdit ? `${API_BASE}/shifts/${formData.id}` : `${API_BASE}/shifts`;
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

      await fetchShifts();
      handleClose();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this shift?")) return;
    try {
      await fetch(`${API_BASE}/shifts/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });
      fetchShifts();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4" fontWeight="bold">Shift Management</Typography>
        <Button variant="contained" onClick={() => handleOpen()}>Create New Shift</Button>
      </Box>

      <TableContainer component={Paper} className="glass-panel">
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold' }}>Shift Name</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Start Time</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>End Time</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Grace Period</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {shifts.map((shift) => (
              <TableRow key={shift._id}>
                <TableCell>{shift.name}</TableCell>
                <TableCell>{shift.startTime}</TableCell>
                <TableCell>{shift.endTime}</TableCell>
                <TableCell>{shift.gracePeriod} mins</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleOpen(shift)} color="primary"><EditIcon /></IconButton>
                  <IconButton onClick={() => handleDelete(shift._id)} color="error"><DeleteIcon /></IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={handleClose} maxWidth="xs" fullWidth>
        <DialogTitle>{formData.id ? 'Edit Shift' : 'Create Shift'}</DialogTitle>
        <DialogContent>
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          <TextField
            fullWidth
            label="Shift Name"
            margin="normal"
            value={formData.name}
            onChange={e => setFormData({...formData, name: e.target.value})}
          />
          <TextField
            fullWidth
            label="Start Time"
            type="time"
            margin="normal"
            value={formData.startTime}
            onChange={e => setFormData({...formData, startTime: e.target.value})}
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            fullWidth
            label="End Time"
            type="time"
            margin="normal"
            value={formData.endTime}
            onChange={e => setFormData({...formData, endTime: e.target.value})}
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            fullWidth
            label="Grace Period (minutes)"
            type="number"
            margin="normal"
            value={formData.gracePeriod}
            onChange={e => setFormData({...formData, gracePeriod: e.target.value})}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">Save</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ShiftManagement;
