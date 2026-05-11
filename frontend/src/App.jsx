import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider, createTheme } from "@mui/material";
import { EmployeeProvider } from "./context/EmployeeContext";
import { AuthProvider } from "./context/AuthContext";
import { AttendanceProvider } from "./context/AttendanceContext";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import EmployeeList from "./pages/EmployeeList";
import EmployeeForm from "./pages/EmployeeForm";
import RoleManagement from "./pages/RoleManagement";
import ActivityLogs from "./pages/ActivityLogs";
import AttendanceHistory from "./pages/AttendanceHistory";
import ShiftManagement from "./pages/ShiftManagement";
import AdminAttendance from "./pages/AdminAttendance";
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
import ForgotPassword from "./pages/Auth/ForgotPassword";
import ResetPassword from "./pages/Auth/ResetPassword";
import ProtectedRoute from "./components/ProtectedRoute";
import HasPermission from "./components/HasPermission";
import "./styles/index.css";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary:    { main: "#3b82f6" },
    secondary:  { main: "#a855f7" },
    success:    { main: "#10b981" },
    warning:    { main: "#f59e0b" },
    error:      { main: "#ef4444" },
    background: { default: "#0f172a", paper: "#1e293b" },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: { textTransform: "none", borderRadius: 8 },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: { fontWeight: 500 },
      },
    },
  },
});

const AccessDenied = () => (
  <div style={{
    display: "flex", flexDirection: "column",
    alignItems: "center", justifyContent: "center",
    height: "60vh", gap: "1rem",
    color: "var(--text-muted)", textAlign: "center",
  }}>
    <span style={{ fontSize: "3rem" }}>🔒</span>
    <h2 style={{ color: "var(--text-main)" }}>Access Denied</h2>
    <p>You don't have permission to view this page.</p>
  </div>
);

const App = () => {
  return (
    <ThemeProvider theme={darkTheme}>
      <AuthProvider>
        <AttendanceProvider>
          <EmployeeProvider>
            <BrowserRouter>
              <Routes>
                {/* Public routes */}
                <Route path="/login"           element={<Login />} />
                <Route path="/register"        element={<Register />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/reset-password"  element={<ResetPassword />} />

                {/* Protected layout routes */}
                <Route
                  path="/"
                  element={
                    <ProtectedRoute>
                      <Layout />
                    </ProtectedRoute>
                  }
                >
                  <Route index element={<Dashboard />} />

                  <Route path="employees" element={
                    <HasPermission required="VIEW_EMPLOYEES" fallback={<AccessDenied />}>
                      <EmployeeList />
                    </HasPermission>
                  } />

                  <Route path="add-employee" element={
                    <HasPermission required="CREATE_EMPLOYEE" fallback={<AccessDenied />}>
                      <EmployeeForm />
                    </HasPermission>
                  } />

                  <Route path="edit-employee/:id" element={
                    <HasPermission required="UPDATE_EMPLOYEE" fallback={<AccessDenied />}>
                      <EmployeeForm />
                    </HasPermission>
                  } />

                  <Route path="attendance" element={
                    <HasPermission required="VIEW_ATTENDANCE" fallback={<AccessDenied />}>
                      <AttendanceHistory />
                    </HasPermission>
                  } />

                  <Route path="admin/attendance" element={
                    <HasPermission required="MANAGE_ATTENDANCE" fallback={<AccessDenied />}>
                      <AdminAttendance />
                    </HasPermission>
                  } />

                  <Route path="shifts" element={
                    <HasPermission required="MANAGE_SHIFTS" fallback={<AccessDenied />}>
                      <ShiftManagement />
                    </HasPermission>
                  } />

                  <Route path="roles" element={
                    <HasPermission required="MANAGE_ROLES" fallback={<AccessDenied />}>
                      <RoleManagement />
                    </HasPermission>
                  } />

                  <Route path="activities" element={
                    <HasPermission required="VIEW_ACTIVITY_LOGS" fallback={<AccessDenied />}>
                      <ActivityLogs />
                    </HasPermission>
                  } />
                </Route>
              </Routes>
            </BrowserRouter>
          </EmployeeProvider>
        </AttendanceProvider>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
