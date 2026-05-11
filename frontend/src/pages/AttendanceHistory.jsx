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
  CircularProgress,
  Alert,
  LinearProgress,
  Tooltip
} from "@mui/material";
import FilterListIcon from "@mui/icons-material/FilterList";
import api from "../api/axios.instance";

const AttendanceHistory = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [startDate, setStartDate] = useState(
    new Date(new Date().setDate(new Date().getDate() - 30)).toISOString().split("T")[0]
  );
  const [endDate, setEndDate] = useState(new Date().toISOString().split("T")[0]);

  const fetchLogs = async () => {
    try {
      setLoading(true);
      setError("");
      const params = new URLSearchParams({ startDate, endDate });
      const { data } = await api.get(`/attendance/logs?${params}`);
      setLogs(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to fetch attendance records.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case "Present":  return "success";
      case "Late":     return "warning";
      case "Half-Day": return "error";
      default:         return "default";
    }
  };

  // Summary stats
  const totalDays     = logs.length;
  const presentDays   = logs.filter((l) => l.status === "Present").length;
  const lateDays      = logs.filter((l) => l.status === "Late").length;
  const totalHours    = logs.reduce((acc, l) => acc + (l.workHours || 0), 0);
  const totalOT       = logs.reduce((acc, l) => acc + (l.overtime || 0), 0);
  const attendancePct = totalDays > 0 ? Math.round(((presentDays + lateDays) / totalDays) * 100) : 0;

  return (
    <Box>
      <Typography variant="h4" fontWeight="bold" sx={{ mb: 3 }}>
        My Attendance History
      </Typography>

      {/* Stats row */}
      <Box sx={{ display: "flex", gap: 2, mb: 3, flexWrap: "wrap" }}>
        {[
          { label: "Days Worked",   value: `${presentDays + lateDays} / ${totalDays}`, color: "#3b82f6" },
          { label: "Total Hours",   value: `${Math.floor(totalHours / 60)}h ${totalHours % 60}m`, color: "#10b981" },
          { label: "Overtime",      value: totalOT > 0 ? `${Math.floor(totalOT / 60)}h ${totalOT % 60}m` : "0h 0m", color: "#f59e0b" },
        ].map((s) => (
          <Paper key={s.label} className="glass-panel" sx={{ p: 2, flex: "1 1 150px", textAlign: "center" }}>
            <Typography variant="h5" fontWeight="bold" sx={{ color: s.color }}>{s.value}</Typography>
            <Typography variant="caption" color="var(--text-muted)">{s.label}</Typography>
          </Paper>
        ))}
        <Paper className="glass-panel" sx={{ p: 2, flex: "1 1 200px" }}>
          <Typography variant="caption" color="var(--text-muted)" display="block" sx={{ mb: 1 }}>
            Attendance Rate
          </Typography>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <LinearProgress
              variant="determinate"
              value={attendancePct}
              sx={{ flex: 1, height: 8, borderRadius: 4 }}
              color={attendancePct >= 80 ? "success" : attendancePct >= 60 ? "warning" : "error"}
            />
            <Typography variant="body2" fontWeight="bold">{attendancePct}%</Typography>
          </Box>
        </Paper>
      </Box>

      {/* Filters */}
      <Box sx={{ display: "flex", gap: 2, mb: 3, alignItems: "center", flexWrap: "wrap" }}>
        <TextField
          type="date" label="Start Date" value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          InputLabelProps={{ shrink: true }} size="small"
        />
        <TextField
          type="date" label="End Date" value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          InputLabelProps={{ shrink: true }} size="small"
        />
        <Button
          variant="contained"
          startIcon={loading ? <CircularProgress size={16} color="inherit" /> : <FilterListIcon />}
          onClick={fetchLogs}
          disabled={loading}
        >
          {loading ? "Loading…" : "Filter"}
        </Button>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      {/* Table */}
      <TableContainer component={Paper} className="glass-panel">
        <Table>
          <TableHead>
            <TableRow>
              {["Date", "Clock In", "Clock Out", "Status", "Work Hours", "Overtime"].map((h) => (
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
            ) : logs.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center" sx={{ py: 4, color: "var(--text-muted)" }}>
                  No attendance records found for the selected period.
                </TableCell>
              </TableRow>
            ) : (
              logs.map((log) => (
                <TableRow key={log._id} hover>
                  <TableCell sx={{ fontWeight: 500 }}>{log.date}</TableCell>
                  <TableCell>{log.clockIn ? new Date(log.clockIn).toLocaleTimeString() : "—"}</TableCell>
                  <TableCell>{log.clockOut ? new Date(log.clockOut).toLocaleTimeString() : "—"}</TableCell>
                  <TableCell>
                    <Chip label={log.status} color={getStatusColor(log.status)} size="small" />
                  </TableCell>
                  <TableCell>{Math.floor(log.workHours / 60)}h {log.workHours % 60}m</TableCell>
                  <TableCell>
                    {log.overtime > 0 ? (
                      <Tooltip title="Overtime hours beyond shift end">
                        <Typography color="success.main" variant="body2" fontWeight="bold">
                          +{Math.floor(log.overtime / 60)}h {log.overtime % 60}m
                        </Typography>
                      </Tooltip>
                    ) : (
                      <Typography variant="body2" color="var(--text-muted)">—</Typography>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default AttendanceHistory;
