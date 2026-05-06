import { NavLink } from "react-router-dom";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PeopleIcon from "@mui/icons-material/People";
import PersonAddIcon from "@mui/icons-material/PersonAdd";

const Sidebar = () => {
  const menuItems = [
    { name: "Dashboard", path: "/", icon: <DashboardIcon /> },
    { name: "Employee List", path: "/employees", icon: <PeopleIcon /> },
    { name: "Add Employee", path: "/add-employee", icon: <PersonAddIcon /> },
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
        {menuItems.map((item) => (
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
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
