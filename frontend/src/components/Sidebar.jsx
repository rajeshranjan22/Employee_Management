import { useContext } from "react";
import { NavLink } from "react-router-dom";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PeopleIcon from "@mui/icons-material/People";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import SecurityIcon from "@mui/icons-material/Security";
import HistoryIcon from "@mui/icons-material/History";
import TimerIcon from "@mui/icons-material/Timer";
import WorkOutlinedIcon from "@mui/icons-material/WorkOutlined";
import HasPermission from "./HasPermission";
import { AuthContext } from "../context/AuthContext";

const Sidebar = () => {
  const { hasPermission } = useContext(AuthContext);

  const menuItems = [
    { name: "Dashboard", path: "/", icon: <DashboardIcon /> },
    { name: "Employee List", path: "/employees", icon: <PeopleIcon />, permission: 'VIEW_EMPLOYEES' },
    { name: "Add Employee", path: "/add-employee", icon: <PersonAddIcon />, permission: 'CREATE_EMPLOYEE' },
    { name: "Attendance", path: "/attendance", icon: <TimerIcon />, permission: 'VIEW_ATTENDANCE' },
    { name: "Employee Attendance", path: "/admin/attendance", icon: <HistoryIcon />, permission: 'MANAGE_ATTENDANCE' },
    { name: "Shift Management", path: "/shifts", icon: <WorkOutlinedIcon />, permission: 'MANAGE_SHIFTS' },
    { name: "Role Management", path: "/roles", icon: <SecurityIcon />, permission: 'MANAGE_ROLES' },
    { name: "Activity Logs", path: "/activities", icon: <HistoryIcon />, permission: 'VIEW_ACTIVITY_LOGS' },
  ];

  return (
    <div
      className="glass-panel"
      style={{
        width: "260px",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        borderRadius: "0",
      }}
    >
      <div
        style={{
          padding: "2rem",
          borderBottom: "1px solid var(--glass-border)",
        }}
      >
        <h2
          style={{
            color: "var(--accent-color)",
            display: "flex",
            alignItems: "center",
            gap: "10px",
          }}
        >
          <PeopleIcon /> EMS Portal
        </h2>
      </div>
      <div
        style={{
          padding: "1rem",
          display: "flex",
          flexDirection: "column",
          gap: "0.5rem",
        }}
      >
        {menuItems.map((item) => {
          if (item.permission && !hasPermission(item.permission)) return null;
          return (
            <NavLink
              key={item.name}
              to={item.path}
              style={({ isActive }) => ({
                display: "flex",
                alignItems: "center",
                padding: "1rem",
                borderRadius: "12px",
                color: isActive ? "var(--text-main)" : "var(--text-muted)",
                background: isActive ? "var(--accent-color)" : "transparent",
                transition: "all 0.3s ease",
                gap: "12px",
                textDecoration: "none",
                fontWeight: isActive ? "600" : "400",
                boxShadow: isActive
                  ? "0 4px 15px rgba(59, 130, 246, 0.4)"
                  : "none",
              })}
              className="hover-scale"
            >
              {item.icon}
              {item.name}
            </NavLink>
          );
        })}
      </div>
    </div>
  );
};

export default Sidebar;
