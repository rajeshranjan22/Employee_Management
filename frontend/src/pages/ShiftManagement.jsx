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
  IconButton,
  Chip,
  CircularProgress,
  Tooltip
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import api from "../api/axios.instance";

const ShiftManagement = () => {
  const [shifts, setShifts]     = useState([]);
  const [open, setOpen]         = useState(false);
  const [error, setError]       = useState("");
  const [loading, setLoading]   = useState(false);
  const [saving, setSaving]     = useState(false);
  const [formData, setFormData] = useState({
    id: null, name: "", startTime: "09:00", endTime: "18:00", gracePeriod: 15,
  });

  const fetchShifts = async () => {
    try {
      setLoading(true);
      const { data } = await api.get("/shifts");
      setShifts(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to fetch shifts", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchShifts(); }, []);

  const handleOpen = (shift = null) => {
    setFormData(
      shift
        ? { id: shift._id, name: shift.name, startTime: shift.startTime, endTime: shift.endTime, gracePeriod: shift.gracePeriod }
        : { id: null, name: "", startTime: "09:00", endTime: "18:00", gracePeriod: 15 }
    );
    setError("");
    setOpen(true);
  };

  const handleClose = () => { setOpen(false); setSaving(false); };

  const handleSubmit = async () => {
    if (!formData.name.trim()) { setError("Shift name is required."); return; }
    try {
      setSaving(true);
      setError("");
      if (formData.id) {
        await api.put(`/shifts/${formData.id}`, formData);
      } else {
        await api.post("/shifts", formData);
      }
      await fetchShifts();
      handleClose();
    } catch (err) {
      setError(err.response?.data?.error || "Operation failed.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this shift?")) return;
    try {
      await api.delete(`/shifts/${id}`);
      fetchShifts();
    } catch (err) {
      console.error("Delete failed", err);
    }
  };

  // Calculate duration display
  const shiftDuration = (start, end) => {
    const [sh, sm] = start.split(":").map(Number);
    const [eh, em] = end.split(":").map(Number);
    const mins = (eh * 60 + em) - (sh * 60 + sm);
    if (mins <= 0) return "—";
    return `${Math.floor(mins / 60)}h ${mins % 60}m`;
  };

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
        <Typography variant="h4" fontWeight="bold">Shift Management</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpen()}
        >
          Create New Shift
        </Button>
      </Box>

      {/* Stats */}
      <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
        <Paper className="glass-panel" sx={{ p: 2, flex: 1, textAlign: "center" }}>
          <Typography variant="h4" fontWeight="bold" color="primary.main">{shifts.length}</Typography>
          <Typography variant="caption" color="var(--text-muted)">Total Shifts</Typography>
        </Paper>
        <Paper className="glass-panel" sx={{ p: 2, flex: 1, textAlign: "center" }}>
          <Typography variant="h4" fontWeight="bold" color="success.main">
            {shifts.filter((s) => {
              const dur = shiftDuration(s.startTime, s.endTime);
              const h = parseInt(dur.split("h")[0]);
              return h >= 8;
            }).length}
          </Typography>
          <Typography variant="caption" color="var(--text-muted)">Full-Day Shifts (8h+)</Typography>
        </Paper>
      </Box>

      {/* Table */}
      <TableContainer component={Paper} className="glass-panel">
        <Table>
          <TableHead>
            <TableRow>
              {["Shift Name", "Start Time", "End Time", "Duration", "Grace Period", "Actions"].map((h) => (
                <TableCell key={h} sx={{ fontWeight: "bold", color: "var(--text-muted)" }}>{h}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                  <CircularProgress size={32} />
                </TableCell>
              </TableRow>
            ) : shifts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center" sx={{ py: 4, color: "var(--text-muted)" }}>
                  No shifts configured yet. Create your first shift.
                </TableCell>
              </TableRow>
            ) : (
              shifts.map((shift) => (
                <TableRow key={shift._id} hover>
                  <TableCell>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <AccessTimeIcon fontSize="small" sx={{ color: "var(--accent-color)" }} />
                      <Typography fontWeight={500}>{shift.name}</Typography>
                    </Box>
                  </TableCell>
                  <TableCell>{shift.startTime}</TableCell>
                  <TableCell>{shift.endTime}</TableCell>
                  <TableCell>
                    <Chip
                      label={shiftDuration(shift.startTime, shift.endTime)}
                      size="small"
                      color="primary"
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell>{shift.gracePeriod} mins</TableCell>
                  <TableCell>
                    <Tooltip title="Edit shift">
                      <IconButton onClick={() => handleOpen(shift)} color="primary" size="small">
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete shift">
                      <IconButton onClick={() => handleDelete(shift._id)} color="error" size="small">
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Create / Edit Dialog */}
      <Dialog open={open} onClose={handleClose} maxWidth="xs" fullWidth>
        <DialogTitle>{formData.id ? "Edit Shift" : "Create New Shift"}</DialogTitle>
        <DialogContent>
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          <TextField
            fullWidth label="Shift Name" margin="normal"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="e.g. Morning Shift"
          />
          <TextField
            fullWidth label="Start Time" type="time" margin="normal"
            value={formData.startTime}
            onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            fullWidth label="End Time" type="time" margin="normal"
            value={formData.endTime}
            onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            fullWidth label="Grace Period (minutes)" type="number" margin="normal"
            value={formData.gracePeriod}
            onChange={(e) => setFormData({ ...formData, gracePeriod: Number(e.target.value) })}
            inputProps={{ min: 0, max: 60 }}
            helperText="Allowable late arrival buffer in minutes"
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={handleClose} disabled={saving}>Cancel</Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            disabled={saving}
            startIcon={saving && <CircularProgress size={14} color="inherit" />}
          >
            {saving ? "Saving…" : "Save Shift"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ShiftManagement;
