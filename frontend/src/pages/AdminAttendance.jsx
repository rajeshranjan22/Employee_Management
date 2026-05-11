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
  MenuItem,
  CircularProgress,
  Alert,
  Tooltip,
  Stack
} from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";
import RefreshIcon from "@mui/icons-material/Refresh";
import api from "../api/axios.instance";

const DEPARTMENTS = ["All", "Engineering", "Design", "HR", "Marketing", "Finance", "Operations"];

const AdminAttendance = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [startDate, setStartDate] = useState(
    new Date(new Date().setDate(new Date().getDate() - 7)).toISOString().split("T")[0]
  );
  const [endDate, setEndDate] = useState(new Date().toISOString().split("T")[0]);
  const [department, setDepartment] = useState("All");

  const fetchAllLogs = async () => {
    try {
      setLoading(true);
      setError("");
      const params = new URLSearchParams({ startDate, endDate, department });
      const { data } = await api.get(`/attendance/admin/logs?${params}`);
      setLogs(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to fetch attendance logs.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllLogs();
  }, []);

  // Summary stats
  const total    = logs.length;
  const present  = logs.filter((l) => l.status === "Present").length;
  const late     = logs.filter((l) => l.status === "Late").length;
  const halfDay  = logs.filter((l) => l.status === "Half-Day").length;

  const statusColor = (status) => {
    if (status === "Present")  return "success";
    if (status === "Late")     return "warning";
    if (status === "Half-Day") return "error";
    return "default";
  };

  const handleExport = () => {
    const header = ["Employee", "Email", "Department", "Date", "Clock In", "Clock Out", "Status", "Work Hours"];
    const rows = logs.map((l) => [
      l.user?.name || "",
      l.user?.email || "",
      l.user?.department || "",
      l.date,
      l.clockIn ? new Date(l.clockIn).toLocaleTimeString() : "",
      l.clockOut ? new Date(l.clockOut).toLocaleTimeString() : "",
      l.status,
      `${Math.floor(l.workHours / 60)}h ${l.workHours % 60}m`,
    ]);
    const csv = [header, ...rows].map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement("a");
    a.href = url; a.download = `attendance_${startDate}_${endDate}.csv`; a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
        <Typography variant="h4" fontWeight="bold">
          Employee Attendance Tracking
        </Typography>
        <Tooltip title="Export to CSV">
          <Button
            variant="outlined"
            startIcon={<DownloadIcon />}
            onClick={handleExport}
            disabled={logs.length === 0}
          >
            Export CSV
          </Button>
        </Tooltip>
      </Box>

      {/* Summary Cards */}
      <Stack direction="row" spacing={2} sx={{ mb: 3, flexWrap: "wrap" }}>
        {[
          { label: "Total Records", value: total,   color: "#3b82f6" },
          { label: "Present",       value: present,  color: "#10b981" },
          { label: "Late",          value: late,     color: "#f59e0b" },
          { label: "Half-Day",      value: halfDay,  color: "#ef4444" },
        ].map((stat) => (
          <Paper
            key={stat.label}
            className="glass-panel"
            sx={{ p: 2, minWidth: 140, textAlign: "center", flex: "1 1 120px" }}
          >
            <Typography variant="h4" fontWeight="bold" sx={{ color: stat.color }}>
              {stat.value}
            </Typography>
            <Typography variant="caption" color="var(--text-muted)">
              {stat.label}
            </Typography>
          </Paper>
        ))}
      </Stack>

      {/* Filters */}
      <Box sx={{ display: "flex", gap: 2, mb: 3, alignItems: "center", flexWrap: "wrap" }}>
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
        <FormControl size="small" sx={{ minWidth: 160 }}>
          <InputLabel>Department</InputLabel>
          <Select value={department} label="Department" onChange={(e) => setDepartment(e.target.value)}>
            {DEPARTMENTS.map((d) => (
              <MenuItem key={d} value={d}>{d === "All" ? "All Departments" : d}</MenuItem>
            ))}
          </Select>
        </FormControl>
        <Button
          variant="contained"
          startIcon={loading ? <CircularProgress size={16} color="inherit" /> : <RefreshIcon />}
          onClick={fetchAllLogs}
          disabled={loading}
        >
          {loading ? "Loading…" : "Generate Report"}
        </Button>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      {/* Table */}
      <TableContainer component={Paper} className="glass-panel">
        <Table>
          <TableHead>
            <TableRow>
              {["Employee", "Department", "Date", "Clock In", "Clock Out", "Status", "Work Hours"].map((h) => (
                <TableCell key={h} sx={{ fontWeight: "bold", color: "var(--text-muted)" }}>
                  {h}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                  <CircularProgress size={32} />
                </TableCell>
              </TableRow>
            ) : logs.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} align="center" sx={{ py: 4, color: "var(--text-muted)" }}>
                  No attendance records found for the selected filters.
                </TableCell>
              </TableRow>
            ) : (
              logs.map((log) => (
                <TableRow key={log._id} hover>
                  <TableCell>
                    <Typography variant="body2" fontWeight="bold">{log.user?.name}</Typography>
                    <Typography variant="caption" color="var(--text-muted)">{log.user?.email}</Typography>
                  </TableCell>
                  <TableCell>{log.user?.department || "—"}</TableCell>
                  <TableCell>{log.date}</TableCell>
                  <TableCell>{log.clockIn ? new Date(log.clockIn).toLocaleTimeString() : "—"}</TableCell>
                  <TableCell>{log.clockOut ? new Date(log.clockOut).toLocaleTimeString() : "—"}</TableCell>
                  <TableCell>
                    <Chip label={log.status} color={statusColor(log.status)} size="small" />
                  </TableCell>
                  <TableCell>
                    {Math.floor(log.workHours / 60)}h {log.workHours % 60}m
                    {log.overtime > 0 && (
                      <Typography variant="caption" color="success.main" sx={{ ml: 1 }}>
                        (+{Math.floor(log.overtime / 60)}h {log.overtime % 60}m OT)
                      </Typography>
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

export default AdminAttendance;
