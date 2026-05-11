import { useContext } from "react";
import { NavLink } from "react-router-dom";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PeopleIcon from "@mui/icons-material/People";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import SecurityIcon from "@mui/icons-material/Security";
import HistoryIcon from "@mui/icons-material/History";
import TimerIcon from "@mui/icons-material/Timer";
import WorkOutlinedIcon from "@mui/icons-material/WorkOutlined";
import SettingsIcon from "@mui/icons-material/Settings";
import { AuthContext } from "../context/AuthContext";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";

const Sidebar = () => {
  const { hasPermission } = useContext(AuthContext);

  const adminItems = [
    { name: "Employee Directory", path: "/employees", icon: <PeopleIcon />, permission: 'VIEW_EMPLOYEES' },
    { name: "Add Employee", path: "/add-employee", icon: <PersonAddIcon />, permission: 'CREATE_EMPLOYEE' },
    { name: "Attendance Logs", path: "/admin/attendance", icon: <HistoryIcon />, permission: 'MANAGE_ATTENDANCE' },
    { name: "Shift Schedules", path: "/shifts", icon: <WorkOutlinedIcon />, permission: 'MANAGE_SHIFTS' },
    { name: "Roles & Access", path: "/roles", icon: <SecurityIcon />, permission: 'MANAGE_ROLES' },
    { name: "System Audit", path: "/activities", icon: <HistoryIcon />, permission: 'VIEW_ACTIVITY_LOGS' },
  ];

  const userItems = [
    { name: "Overview", path: "/", icon: <DashboardIcon /> },
    { name: "My Attendance", path: "/attendance", icon: <TimerIcon />, permission: 'VIEW_ATTENDANCE' },
  ];

  const renderMenuItems = (items) => {
    return items.map((item) => {
      if (item.permission && !hasPermission(item.permission)) return null;
      return (
        <NavLink
          key={item.name}
          to={item.path}
          style={({ isActive }) => ({
            display: "flex",
            alignItems: "center",
            padding: "0.85rem 1.2rem",
            borderRadius: "12px",
            color: isActive ? "#fff" : "var(--text-muted)",
            background: isActive ? "linear-gradient(135deg, var(--accent-color) 0%, #2563eb 100%)" : "transparent",
            transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
            gap: "14px",
            textDecoration: "none",
            fontWeight: isActive ? "600" : "500",
            fontSize: "0.9rem",
            boxShadow: isActive ? "0 8px 20px rgba(59, 130, 246, 0.35)" : "none",
            marginBottom: "4px"
          })}
          className={({ isActive }) => isActive ? "" : "hover-scale"}
        >
          <Box sx={{ display: "flex", alignItems: "center", opacity: 0.9 }}>
            {item.icon}
          </Box>
          {item.name}
        </NavLink>
      );
    });
  };

  return (
    <div
      style={{
        width: "280px",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        background: "rgba(15, 23, 42, 0.95)",
        borderRight: "1px solid var(--border-color)",
        zIndex: 10,
      }}
    >
      {/* Sidebar Header */}
      <div
        style={{
          padding: "2.5rem 2rem",
          display: "flex",
          alignItems: "center",
          gap: "12px",
        }}
      >
        <Box 
          sx={{ 
            width: 40, 
            height: 40, 
            borderRadius: "10px", 
            background: "var(--accent-color)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 0 20px rgba(59, 130, 246, 0.5)"
          }}
        >
          <PeopleIcon sx={{ color: "#fff" }} />
        </Box>
        <Typography variant="h6" sx={{ fontWeight: "800", color: "#fff", letterSpacing: "-0.5px" }}>
          EMS <span style={{ color: "var(--accent-color)" }}>PRO</span>
        </Typography>
      </div>

      <div style={{ padding: "0 1.2rem", flexGrow: 1, overflowY: "auto" }}>
        {/* User Section */}
        <Typography 
          variant="caption" 
          sx={{ 
            px: 2, 
            mb: 2, 
            display: "block", 
            color: "rgba(255,255,255,0.3)", 
            fontWeight: "700", 
            textTransform: "uppercase",
            letterSpacing: "1px"
          }}
        >
          Main Menu
        </Typography>
        {renderMenuItems(userItems)}

        <Divider sx={{ my: 3, borderColor: "rgba(255,255,255,0.05)", mx: 2 }} />

        {/* Admin Section */}
        {hasPermission('VIEW_EMPLOYEES') && (
          <>
            <Typography 
              variant="caption" 
              sx={{ 
                px: 2, 
                mb: 2, 
                display: "block", 
                color: "rgba(255,255,255,0.3)", 
                fontWeight: "700", 
                textTransform: "uppercase",
                letterSpacing: "1px"
              }}
            >
              Administration
            </Typography>
            {renderMenuItems(adminItems)}
          </>
        )}
      </div>

      {/* Sidebar Footer */}
      <div style={{ padding: "1.5rem", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
        <Box 
          sx={{ 
            padding: "1rem", 
            borderRadius: "12px", 
            background: "rgba(255,255,255,0.03)",
            display: "flex",
            alignItems: "center",
            gap: "12px",
            cursor: "pointer",
            "&:hover": { background: "rgba(255,255,255,0.05)" }
          }}
        >
          <SettingsIcon sx={{ color: "var(--text-muted)" }} />
          <Typography sx={{ fontSize: "0.85rem", color: "var(--text-muted)", fontWeight: "500" }}>
            Settings
          </Typography>
        </Box>
      </div>
    </div>
  );
};

export default Sidebar;
