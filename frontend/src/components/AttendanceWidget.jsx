import { useContext, useState, useEffect } from "react";
import { AttendanceContext } from "../context/AttendanceContext";
import {
  Box,
  Typography,
  Button,
  CircularProgress,
  Alert,
  Paper,
  Chip,
  Stack,
  Divider,
  Tooltip,
  Zoom
} from "@mui/material";
import TimerIcon from "@mui/icons-material/Timer";
import MeetingRoomIcon from "@mui/icons-material/MeetingRoom";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import LocationOnIcon from "@mui/icons-material/LocationOn";

const AttendanceWidget = () => {
  const { todayAttendance, clockIn, clockOut, loading, error } = useContext(AttendanceContext);
  const [time, setTime] = useState(new Date().toLocaleTimeString());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date().toLocaleTimeString()), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleClockIn = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          clockIn({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude
          });
        },
        () => clockIn() // fallback if permission denied
      );
    } else {
      clockIn();
    }
  };

  const isClockedIn = !!todayAttendance && !todayAttendance.clockOut;
  const isClockedOut = !!todayAttendance && !!todayAttendance.clockOut;

  return (
    <Paper 
      className="glass-panel" 
      sx={{ 
        p: 3, 
        mb: 4, 
        background: "linear-gradient(135deg, rgba(30, 41, 59, 0.7) 0%, rgba(15, 23, 42, 0.8) 100%)",
        position: "relative",
        overflow: "hidden"
      }}
    >
      {/* Decorative background element */}
      <Box sx={{ 
        position: "absolute", 
        top: -20, 
        right: -20, 
        opacity: 0.05, 
        transform: "rotate(15deg)",
        zIndex: 0 
      }}>
        <AccessTimeIcon sx={{ fontSize: 150 }} />
      </Box>

      <Box sx={{ position: "relative", zIndex: 1 }}>
        <Stack direction="row" sx={{ justifyContent: "space-between", alignItems: "center", mb: 3 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <Box sx={{ 
              width: 40, 
              height: 40, 
              borderRadius: "10px", 
              bgcolor: "rgba(59, 130, 246, 0.1)", 
              display: "flex", 
              alignItems: "center", 
              justifyContent: "center",
              color: "var(--accent-color)"
            }}>
              <TimerIcon />
            </Box>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: "700", lineHeight: 1.2 }}>Shift Tracker</Typography>
              <Typography variant="caption" sx={{ color: "var(--text-muted)" }}>
                {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
              </Typography>
            </Box>
          </Box>
          <Typography 
            variant="h5" 
            sx={{ 
              fontWeight: "800", 
              color: "var(--text-main)", 
              letterSpacing: "1px",
              fontFamily: "monospace"
            }}
          >
            {time}
          </Typography>
        </Stack>

        {error && (
          <Zoom in={!!error}>
            <Alert severity="error" sx={{ mb: 3, borderRadius: "12px" }}>{error}</Alert>
          </Zoom>
        )}

        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          {!todayAttendance && (
            <Button
              variant="contained"
              startIcon={<MeetingRoomIcon />}
              onClick={handleClockIn}
              disabled={loading}
              fullWidth
              sx={{ 
                py: 1.5, 
                fontSize: "1rem", 
                background: "var(--accent-color)",
                boxShadow: "0 4px 15px rgba(59, 130, 246, 0.4)",
                "&:hover": { background: "var(--accent-hover)" }
              }}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : 'Clock In for Today'}
            </Button>
          )}

          {isClockedIn && (
            <Box sx={{ width: '100%' }}>
              <Paper 
                variant="outlined" 
                sx={{ 
                  p: 2, 
                  mb: 3, 
                  bgcolor: "rgba(16, 185, 129, 0.05)", 
                  borderColor: "rgba(16, 185, 129, 0.2)",
                  borderRadius: "12px"
                }}
              >
                <Stack direction="row" spacing={3} divider={<Divider orientation="vertical" flexItem sx={{ borderColor: "rgba(255,255,255,0.05)" }} />}>
                  <Box>
                    <Typography variant="caption" sx={{ color: "var(--text-muted)", display: "block" }}>Clock In Time</Typography>
                    <Typography variant="body1" sx={{ fontWeight: "700", color: "#10b981" }}>
                      {new Date(todayAttendance.clockIn).toLocaleTimeString()}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="caption" sx={{ color: "var(--text-muted)", display: "block" }}>Status</Typography>
                    <Chip 
                      label={todayAttendance.status} 
                      color={todayAttendance.status === 'Present' ? 'success' : 'warning'} 
                      size="small" 
                      sx={{ height: 20, fontSize: "0.65rem", fontWeight: "800" }} 
                    />
                  </Box>
                  {todayAttendance.location && (
                    <Box>
                      <Typography variant="caption" sx={{ color: "var(--text-muted)", display: "block" }}>Location</Typography>
                      <Tooltip title={`Lat: ${todayAttendance.location.lat}, Lng: ${todayAttendance.location.lng}`}>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, color: "var(--accent-color)" }}>
                          <LocationOnIcon sx={{ fontSize: 16 }} />
                          <Typography variant="caption" sx={{ fontWeight: "600" }}>Verified</Typography>
                        </Box>
                      </Tooltip>
                    </Box>
                  )}
                </Stack>
              </Paper>
              <Button
                variant="contained"
                color="error"
                startIcon={<ExitToAppIcon />}
                onClick={clockOut}
                disabled={loading}
                fullWidth
                sx={{ 
                  py: 1.5, 
                  fontSize: "1rem", 
                  boxShadow: "0 4px 15px rgba(239, 68, 68, 0.3)",
                  "&:hover": { bgcolor: "#dc2626" }
                }}
              >
                {loading ? <CircularProgress size={24} color="inherit" /> : 'Clock Out Now'}
              </Button>
            </Box>
          )}

          {isClockedOut && (
            <Box sx={{ width: '100%' }}>
              <Alert 
                severity="success" 
                sx={{ 
                  borderRadius: "12px", 
                  bgcolor: "rgba(16, 185, 129, 0.1)",
                  color: "#10b981",
                  "& .MuiAlert-icon": { color: "#10b981" }
                }}
              >
                <Typography variant="body2" sx={{ fontWeight: "600" }}>
                  Shift Completed! You clocked out at {new Date(todayAttendance.clockOut).toLocaleTimeString()}.
                </Typography>
              </Alert>
              <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center', gap: 4 }}>
                <Box sx={{ textAlign: "center" }}>
                  <Typography variant="caption" sx={{ color: "var(--text-muted)", display: "block" }}>Work Hours</Typography>
                  <Typography variant="h6" sx={{ fontWeight: "700" }}>
                    {Math.floor(todayAttendance.workHours / 60)}h {todayAttendance.workHours % 60}m
                  </Typography>
                </Box>
                {todayAttendance.overtime > 0 && (
                  <Box sx={{ textAlign: "center" }}>
                    <Typography variant="caption" sx={{ color: "var(--text-muted)", display: "block" }}>Overtime</Typography>
                    <Typography variant="h6" sx={{ fontWeight: "700", color: "#10b981" }}>
                      +{Math.floor(todayAttendance.overtime / 60)}h {todayAttendance.overtime % 60}m
                    </Typography>
                  </Box>
                )}
              </Box>
            </Box>
          )}
        </Box>
      </Box>
    </Paper>
  );
};

export default AttendanceWidget;
