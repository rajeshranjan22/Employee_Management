import { useState, useEffect, useContext } from "react";
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
  Button
} from "@mui/material";
import { AuthContext } from "../context/AuthContext";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const AttendanceHistory = () => {
  const [logs, setLogs] = useState([]);
  const [startDate, setStartDate] = useState(new Date(new Date().setDate(new Date().getDate() - 30)).toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);

  const fetchLogs = async () => {
    try {
      const res = await fetch(`${API_BASE}/attendance/logs?startDate=${startDate}&endDate=${endDate}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });
      const data = await res.json();
      if (res.ok) setLogs(data);
    } catch (err) {
      console.error("Failed to fetch attendance logs", err);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'Present': return 'success';
      case 'Late': return 'warning';
      case 'Half-Day': return 'error';
      default: return 'default';
    }
  };

  return (
    <Box>
      <Typography variant="h4" fontWeight="bold" sx={{ mb: 3 }}>Attendance History</Typography>

      <Box sx={{ display: 'flex', gap: 2, mb: 3, alignItems: 'center' }}>
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
        <Button variant="contained" onClick={fetchLogs}>Filter</Button>
      </Box>

      <TableContainer component={Paper} className="glass-panel">
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold' }}>Date</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Clock In</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Clock Out</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Work Hours</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Overtime</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {logs.map((log) => (
              <TableRow key={log._id}>
                <TableCell>{log.date}</TableCell>
                <TableCell>{new Date(log.clockIn).toLocaleTimeString()}</TableCell>
                <TableCell>{log.clockOut ? new Date(log.clockOut).toLocaleTimeString() : '---'}</TableCell>
                <TableCell>
                  <Chip label={log.status} color={getStatusColor(log.status)} size="small" />
                </TableCell>
                <TableCell>{Math.floor(log.workHours / 60)}h {log.workHours % 60}m</TableCell>
                <TableCell>
                    {log.overtime > 0 ? (
                        <Typography color="success.main" variant="body2">+{Math.floor(log.overtime / 60)}h {log.overtime % 60}m</Typography>
                    ) : '---'}
                </TableCell>
              </TableRow>
            ))}
            {logs.length === 0 && (
                <TableRow>
                    <TableCell colSpan={6} align="center">No records found for the selected period.</TableCell>
                </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default AttendanceHistory;
