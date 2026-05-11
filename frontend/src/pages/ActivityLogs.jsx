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
  TablePagination,
  Chip,
  TextField,
  InputAdornment,
  CircularProgress,
  Alert,
  Tooltip
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import api from "../api/axios.instance";

// Colour-code action types
const actionColor = (action = "") => {
  if (action.includes("DELETE") || action.includes("REMOVE")) return "error";
  if (action.includes("CREATE") || action.includes("ADD"))    return "success";
  if (action.includes("UPDATE") || action.includes("EDIT"))   return "warning";
  if (action.includes("LOGIN")  || action.includes("AUTH"))   return "info";
  return "default";
};

const ActivityLogs = () => {
  const [logs, setLogs]       = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState("");
  const [search, setSearch]   = useState("");
  const [page, setPage]       = useState(0);
  const rowsPerPage           = 15;

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        setLoading(true);
        const { data } = await api.get("/activities");
        setLogs(Array.isArray(data) ? data : []);
      } catch (err) {
        setError(err.response?.data?.error || "Failed to fetch activity logs.");
      } finally {
        setLoading(false);
      }
    };
    fetchLogs();
  }, []);

  const filtered = logs.filter((log) => {
    const q = search.toLowerCase();
    return (
      log.user?.name?.toLowerCase().includes(q) ||
      log.action?.toLowerCase().includes(q)     ||
      log.user?.department?.toLowerCase().includes(q)
    );
  });

  const paginated = filtered.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
        <Typography variant="h4" fontWeight="bold">Activity Logs</Typography>
        <Typography variant="body2" color="var(--text-muted)">
          {filtered.length} record{filtered.length !== 1 ? "s" : ""}
        </Typography>
      </Box>

      {/* Search */}
      <TextField
        fullWidth
        placeholder="Search by user, department, or action…"
        value={search}
        onChange={(e) => { setSearch(e.target.value); setPage(0); }}
        size="small"
        sx={{ mb: 3, maxWidth: 500 }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon sx={{ color: "var(--text-muted)" }} />
            </InputAdornment>
          ),
        }}
      />

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <TableContainer component={Paper} className="glass-panel">
        <Table size="small">
          <TableHead>
            <TableRow>
              {["Timestamp", "User", "Department", "Action", "Details"].map((h) => (
                <TableCell key={h} sx={{ fontWeight: "bold", color: "var(--text-muted)" }}>{h}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} align="center" sx={{ py: 4 }}>
                  <CircularProgress size={32} />
                </TableCell>
              </TableRow>
            ) : paginated.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} align="center" sx={{ py: 4, color: "var(--text-muted)" }}>
                  {search ? "No logs match your search." : "No activity logs found."}
                </TableCell>
              </TableRow>
            ) : (
              paginated.map((log) => (
                <TableRow key={log._id} hover>
                  <TableCell sx={{ whiteSpace: "nowrap", fontSize: "0.8rem", color: "var(--text-muted)" }}>
                    {new Date(log.createdAt).toLocaleString()}
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" fontWeight={500}>
                      {log.user?.name || "Unknown User"}
                    </Typography>
                    <Typography variant="caption" color="var(--text-muted)">
                      {log.user?.email}
                    </Typography>
                  </TableCell>
                  <TableCell>{log.user?.department || "—"}</TableCell>
                  <TableCell>
                    <Chip
                      size="small"
                      label={log.action}
                      color={actionColor(log.action)}
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell sx={{ maxWidth: 220 }}>
                    <Tooltip
                      title={
                        <pre style={{ margin: 0, fontSize: "0.75rem", maxHeight: 200, overflowY: "auto" }}>
                          {JSON.stringify(log.details, null, 2)}
                        </pre>
                      }
                      arrow
                    >
                      <Typography
                        variant="caption"
                        color="var(--text-muted)"
                        sx={{
                          display: "block",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                          cursor: "help",
                          maxWidth: 200,
                        }}
                      >
                        {JSON.stringify(log.details)}
                      </Typography>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
        <TablePagination
          component="div"
          count={filtered.length}
          page={page}
          onPageChange={(_, p) => setPage(p)}
          rowsPerPage={rowsPerPage}
          rowsPerPageOptions={[rowsPerPage]}
          sx={{ color: "var(--text-muted)" }}
        />
      </TableContainer>
    </Box>
  );
};

export default ActivityLogs;
