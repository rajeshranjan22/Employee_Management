import { createContext, useState, useEffect, useContext } from "react";
import { AuthContext } from "./AuthContext";

export const AttendanceContext = createContext();

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export const AttendanceProvider = ({ children }) => {
  const { user } = useContext(AuthContext);
  const [todayAttendance, setTodayAttendance] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchTodayStatus = async () => {
    if (!user) return;
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/attendance/today`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });
      const data = await res.json();
      if (res.ok && !data.message) {
        setTodayAttendance(data);
      } else {
        setTodayAttendance(null);
      }
    } catch (err) {
      console.error("Failed to fetch today status", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTodayStatus();
  }, [user]);

  const clockIn = async (location = null) => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/attendance/clock-in`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem("token")}` 
        },
        body: JSON.stringify({ location })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Clock-in failed');
      setTodayAttendance(data);
      return { success: true };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const clockOut = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/attendance/clock-out`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Clock-out failed');
      setTodayAttendance(data);
      return { success: true };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  return (
    <AttendanceContext.Provider value={{ 
      todayAttendance, 
      loading, 
      error, 
      clockIn, 
      clockOut, 
      fetchTodayStatus 
    }}>
      {children}
    </AttendanceContext.Provider>
  );
};
