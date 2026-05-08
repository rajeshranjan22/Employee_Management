import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from "@mui/material";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const AdminAttendance = () => {
  const [logs, setLogs] = useState([]);
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);
  const [department, setDepartment] = useState('All');

  const fetchAllLogs = async () => {
    try {
      const res = await fetch(`${API_BASE}/attendance/admin/logs?startDate=${startDate}&endDate=${endDate}&department=${department}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });
      const data = await res.json();
      if (res.ok) setLogs(data);
    } catch (err) {
      console.error("Failed to fetch admin attendance logs", err);
    }
  };

  useEffect(() => {
    fetchAllLogs();
  }, []);

  return (
    <Box>
      <Typography variant="h4" fontWeight="bold" sx={{ mb: 3 }}>Employee Attendance Tracking</Typography>

      <Box sx={{ display: 'flex', gap: 2, mb: 3, alignItems: 'center', flexWrap: 'wrap' }}>
        <TextField
          type="date"
          label="Start Date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          InputLabelProps={{ shrink: true }}
          size="small"
        />
        <TextField
          type="date"
          label="End Date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          InputLabelProps={{ shrink: true }}
          size="small"
        />
        <FormControl size="small" sx={{ minWidth: 150 }}>
          <InputLabel>Department</InputLabel>
          <Select
            value={department}
            label="Department"
            onChange={(e) => setDepartment(e.target.value)}
          >
            <MenuItem value="All">All Departments</MenuItem>
            <MenuItem value="Engineering">Engineering</MenuItem>
            <MenuItem value="Design">Design</MenuItem>
            <MenuItem value="HR">HR</MenuItem>
            <MenuItem value="Marketing">Marketing</MenuItem>
          </Select>
        </FormControl>
        <Button variant="contained" onClick={fetchAllLogs}>Generate Report</Button>
      </Box>

      <TableContainer component={Paper} className="glass-panel">
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold' }}>Employee</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Dept</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Date</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Clock In</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Clock Out</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Work Hours</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {logs.map((log) => (
              <TableRow key={log._id}>
                <TableCell>
                    <Typography variant="body2" fontWeight="bold">{log.user?.name}</Typography>
                    <Typography variant="caption" color="var(--text-muted)">{log.user?.email}</Typography>
                </TableCell>
                <TableCell>{log.user?.department}</TableCell>
                <TableCell>{log.date}</TableCell>
                <TableCell>{new Date(log.clockIn).toLocaleTimeString()}</TableCell>
                <TableCell>{log.clockOut ? new Date(log.clockOut).toLocaleTimeString() : '---'}</TableCell>
                <TableCell>
                  <Chip 
                    label={log.status} 
                    color={log.status === 'Present' ? 'success' : log.status === 'Late' ? 'warning' : 'error'} 
                    size="small" 
                  />
                </TableCell>
                <TableCell>{Math.floor(log.workHours / 60)}h {log.workHours % 60}m</TableCell>
              </TableRow>
            ))}
            {logs.length === 0 && (
                <TableRow>
                    <TableCell colSpan={7} align="center">No attendance records found.</TableCell>
                </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default AdminAttendance;
