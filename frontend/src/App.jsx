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
import ProtectedRoute from "./components/ProtectedRoute";
import HasPermission from "./components/HasPermission";
import "./styles/index.css";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#3b82f6",
    },
    background: {
      default: "#0f172a",
      paper: "#1e293b",
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
  },
});

const App = () => {
  return (
    <ThemeProvider theme={darkTheme}>
      <AuthProvider>
        <AttendanceProvider>
          <EmployeeProvider>
            <BrowserRouter>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

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
                  <HasPermission required="VIEW_EMPLOYEES" fallback={<div>Access Denied</div>}>
                    <EmployeeList />
                  </HasPermission>
                } />
                <Route path="add-employee" element={
                  <HasPermission required="CREATE_EMPLOYEE" fallback={<div>Access Denied</div>}>
                    <EmployeeForm />
                  </HasPermission>
                } />
                <Route path="edit-employee/:id" element={
                  <HasPermission required="UPDATE_EMPLOYEE" fallback={<div>Access Denied</div>}>
                    <EmployeeForm />
                  </HasPermission>
                } />
                <Route path="attendance" element={
                  <HasPermission required="VIEW_ATTENDANCE" fallback={<div>Access Denied</div>}>
                    <AttendanceHistory />
                  </HasPermission>
                } />
                <Route path="admin/attendance" element={
                  <HasPermission required="MANAGE_ATTENDANCE" fallback={<div>Access Denied</div>}>
                    <AdminAttendance />
                  </HasPermission>
                } />
                <Route path="shifts" element={
                  <HasPermission required="MANAGE_SHIFTS" fallback={<div>Access Denied</div>}>
                    <ShiftManagement />
                  </HasPermission>
                } />
                <Route path="roles" element={
                  <HasPermission required="MANAGE_ROLES" fallback={<div>Access Denied</div>}>
                    <RoleManagement />
                  </HasPermission>
                } />
                <Route path="activities" element={
                  <HasPermission required="VIEW_ACTIVITY_LOGS" fallback={<div>Access Denied</div>}>
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
