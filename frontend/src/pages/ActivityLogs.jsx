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
  Chip
} from "@mui/material";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const ActivityLogs = () => {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const res = await fetch(`${API_BASE}/activities`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
        });
        const data = await res.json();
        if (res.ok) setLogs(data);
      } catch (err) {
        console.error("Failed to fetch activity logs", err);
      }
    };
    fetchLogs();
  }, []);

  return (
    <Box>
      <Typography variant="h4" fontWeight="bold" sx={{ mb: 3 }}>Activity Logs</Typography>

      <TableContainer component={Paper} sx={{ bgcolor: 'background.paper', borderRadius: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold' }}>Timestamp</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>User</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Department</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Action</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Details</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {logs.map(log => (
              <TableRow key={log._id}>
                <TableCell>{new Date(log.createdAt).toLocaleString()}</TableCell>
                <TableCell>{log.user ? log.user.name : 'Unknown User'}</TableCell>
                <TableCell>{log.user ? log.user.department : 'N/A'}</TableCell>
                <TableCell>
                  <Chip size="small" label={log.action} color="primary" variant="outlined" />
                </TableCell>
                <TableCell>
                  <pre style={{ margin: 0, fontSize: '0.8rem', maxWidth: '200px', overflowX: 'auto' }}>
                    {JSON.stringify(log.details, null, 2)}
                  </pre>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default ActivityLogs;
