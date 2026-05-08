import { useContext, useState, useEffect } from "react";
import { AttendanceContext } from "../context/AttendanceContext";
import {
  Box,
  Typography,
  Button,
  CircularProgress,
  Alert,
  Paper,
  Chip
} from "@mui/material";
import TimerIcon from "@mui/icons-material/Timer";
import MeetingRoomIcon from "@mui/icons-material/MeetingRoom";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";

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
    <Paper className="glass-panel" sx={{ p: 3, mb: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6" fontWeight="bold">Attendance Status</Typography>
        <Typography variant="subtitle1" color="var(--text-muted)">{time}</Typography>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
        {!todayAttendance && (
          <Button
            variant="contained"
            startIcon={<MeetingRoomIcon />}
            onClick={handleClockIn}
            disabled={loading}
            fullWidth
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : 'Clock In'}
          </Button>
        )}

        {isClockedIn && (
          <Box sx={{ width: '100%' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <Chip label="Clocked In" color="success" variant="outlined" />
              <Typography variant="body2" color="var(--text-muted)">
                at {new Date(todayAttendance.clockIn).toLocaleTimeString()}
              </Typography>
              {todayAttendance.status === 'Late' && (
                <Chip label="Late Arrival" color="error" size="small" />
              )}
            </Box>
            <Button
              variant="contained"
              color="error"
              startIcon={<ExitToAppIcon />}
              onClick={clockOut}
              disabled={loading}
              fullWidth
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : 'Clock Out'}
            </Button>
          </Box>
        )}

        {isClockedOut && (
          <Box sx={{ textAlign: 'center', width: '100%' }}>
            <Alert severity="success">
              Shift Completed! You clocked out at {new Date(todayAttendance.clockOut).toLocaleTimeString()}.
            </Alert>
            <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center', gap: 2 }}>
                <Typography variant="body2">Work Hours: {Math.floor(todayAttendance.workHours / 60)}h {todayAttendance.workHours % 60}m</Typography>
                {todayAttendance.overtime > 0 && (
                    <Typography variant="body2" color="success.main">Overtime: {Math.floor(todayAttendance.overtime / 60)}h {todayAttendance.overtime % 60}m</Typography>
                )}
            </Box>
          </Box>
        )}
      </Box>
    </Paper>
  );
};

export default AttendanceWidget;
