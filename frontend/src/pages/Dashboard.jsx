import { useContext, useEffect, useState } from "react";
import { EmployeeContext } from "../context/EmployeeContext";
import { AuthContext } from "../context/AuthContext";
import PeopleAlt from "@mui/icons-material/PeopleAlt";
import WorkOutlinedIcon from "@mui/icons-material/WorkOutlined";
import CheckCircleOutlinedIcon from "@mui/icons-material/CheckCircleOutlined";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const StatCard = ({ title, value, icon, color }) => (
  <div
    className="glass-panel hover-scale"
    style={{
      padding: "1.5rem",
      display: "flex",
      alignItems: "center",
      gap: "1.5rem",
      flex: 1,
    }}
  >
    <div
      style={{
        background: `rgba(${color}, 0.1)`,
        padding: "1rem",
        borderRadius: "12px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: `rgb(${color})`,
      }}
    >
      {icon}
    </div>
    <div>
      <h3
        style={{
          color: "var(--text-muted)",
          fontSize: "0.9rem",
          marginBottom: "0.5rem",
          fontWeight: "500",
        }}
      >
        {title}
      </h3>
      <div
        style={{
          fontSize: "1.8rem",
          fontWeight: "700",
          color: "var(--text-main)",
        }}
      >
        {value}
      </div>
    </div>
  </div>
);

const Dashboard = () => {
  const { employees } = useContext(EmployeeContext);
  const { hasPermission } = useContext(AuthContext);
  const [activities, setActivities] = useState([]);

  useEffect(() => {
    if (hasPermission('VIEW_ACTIVITY_LOGS')) {
      const fetchActivities = async () => {
        try {
          const res = await fetch(`${API_BASE}/activities`, {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
          });
          const data = await res.json();
          if (res.ok) setActivities(data.slice(0, 3));
        } catch (err) {
          console.error("Failed to fetch dashboard activities", err);
        }
      };
      fetchActivities();
    }
  }, [hasPermission]);

  const totalEmployees = employees.length;
  const activeEmployees = employees.filter(
    (emp) => emp.status === "Active",
  ).length;
  const departments = new Set(employees.map((emp) => emp.department)).size;

  return (
    <div>
      <h1 style={{ marginBottom: "2rem", fontSize: "2rem", fontWeight: "600" }}>
        Overview
      </h1>

      <div
        style={{
          display: "flex",
          gap: "1.5rem",
          flexWrap: "wrap",
          marginBottom: "2rem",
        }}
      >
        <StatCard
          title="Total Employees"
          value={totalEmployees}
          icon={<PeopleAlt fontSize="large" />}
          color="59, 130, 246" // Blue
        />
        <StatCard
          title="Active Employees"
          value={activeEmployees}
          icon={<CheckCircleOutlinedIcon fontSize="large" />}
          color="16, 185, 129" // Green
        />
        <StatCard
          title="Departments"
          value={departments}
          icon={<WorkOutlinedIcon fontSize="large" />}
          color="245, 158, 11" // Amber
        />
      </div>

      <div className="glass-panel" style={{ padding: "2rem" }}>
        <h2
          style={{
            marginBottom: "1.5rem",
            fontSize: "1.2rem",
            color: "var(--text-main)",
          }}
        >
          {activities.length > 0 ? "System Activity" : "Recent Employees"}
        </h2>
        <div
          style={{
            color: "var(--text-muted)",
            display: "flex",
            flexDirection: "column",
            gap: "1rem",
          }}
        >
          {activities.length > 0 ? (
            activities.map((log, idx) => (
              <div
                key={idx}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "1rem",
                  paddingBottom: "1rem",
                  borderBottom:
                    idx !== activities.length - 1 ? "1px solid var(--border-color)" : "none",
                }}
              >
                <div
                  style={{
                    width: "10px",
                    height: "10px",
                    borderRadius: "50%",
                    background: "var(--accent-color)",
                  }}
                ></div>
                <p>
                  <strong style={{ color: "var(--text-main)" }}>
                    {log.user?.name || 'System'}
                  </strong>{" "}
                  performed{" "}
                  <strong style={{ color: "var(--accent-color)" }}>
                    {log.action}
                  </strong>{" "}
                  - {new Date(log.createdAt).toLocaleTimeString()}
                </p>
              </div>
            ))
          ) : (
            employees
              .slice(-3)
              .reverse()
              .map((emp, idx) => (
                <div
                  key={idx}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "1rem",
                    paddingBottom: "1rem",
                    borderBottom:
                      idx !== 2 ? "1px solid var(--border-color)" : "none",
                  }}
                >
                  <div
                    style={{
                      width: "10px",
                      height: "10px",
                      borderRadius: "50%",
                      background: "var(--accent-color)",
                    }}
                  ></div>
                  <p>
                    New employee{" "}
                    <strong style={{ color: "var(--text-main)" }}>
                      {emp.name}
                    </strong>{" "}
                    added to{" "}
                    <strong style={{ color: "var(--text-main)" }}>
                      {emp.department}
                    </strong>
                  </p>
                </div>
              ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
