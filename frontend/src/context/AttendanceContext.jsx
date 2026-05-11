import { createContext, useState, useEffect, useContext } from "react";
import { AuthContext } from "./AuthContext";
import api from "../api/axios.instance";

export const AttendanceContext = createContext();

export const AttendanceProvider = ({ children }) => {
  const { user } = useContext(AuthContext);
  const [todayAttendance, setTodayAttendance] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchTodayStatus = async () => {
    if (!user) return;
    try {
      setLoading(true);
      const { data } = await api.get("/attendance/today");
      // Backend returns the record or { message: "No record" }
      if (data && !data.message) {
        setTodayAttendance(data);
      } else {
        setTodayAttendance(null);
      }
    } catch (err) {
      // 404 means no record yet today — not an error
      if (err.response?.status === 404) {
        setTodayAttendance(null);
      } else {
        console.error("Failed to fetch today status", err);
      }
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
      setError(null);
      const { data } = await api.post("/attendance/clock-in", { location });
      setTodayAttendance(data);
      return { success: true };
    } catch (err) {
      const msg = err.response?.data?.error || err.message || "Clock-in failed";
      setError(msg);
      return { success: false, error: msg };
    } finally {
      setLoading(false);
    }
  };

  const clockOut = async () => {
    try {
      setLoading(true);
      setError(null);
      const { data } = await api.post("/attendance/clock-out");
      setTodayAttendance(data);
      return { success: true };
    } catch (err) {
      const msg = err.response?.data?.error || err.message || "Clock-out failed";
      setError(msg);
      return { success: false, error: msg };
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
