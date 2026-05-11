import { useContext, useEffect, useState } from "react";
import { EmployeeContext } from "../context/EmployeeContext";
import { AuthContext } from "../context/AuthContext";
import { Link } from "react-router-dom";
import { 
  PeopleAlt, 
  WorkOutlined as WorkOutlinedIcon, 
  CheckCircle as CheckCircleIcon, 
  TrendingUp as TrendingUpIcon, 
  OpenInNew as OpenInNewIcon 
} from "@mui/icons-material";
import AttendanceWidget from "../components/AttendanceWidget";
import api from "../api/axios.instance";

const StatCard = ({ title, value, icon, color, to }) => (
  <div
    className="glass-panel hover-scale"
    style={{ padding: "1.5rem", display: "flex", alignItems: "center", gap: "1.5rem", flex: 1 }}
  >
    <div
      style={{
        background: `rgba(${color}, 0.12)`,
        padding: "1rem",
        borderRadius: "14px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: `rgb(${color})`,
        flexShrink: 0,
      }}
    >
      {icon}
    </div>
    <div style={{ flex: 1 }}>
      <h3 style={{ color: "var(--text-muted)", fontSize: "0.85rem", marginBottom: "0.4rem", fontWeight: "500", textTransform: "uppercase", letterSpacing: "0.05em" }}>
        {title}
      </h3>
      <div style={{ fontSize: "2rem", fontWeight: "700", color: "var(--text-main)", lineHeight: 1 }}>
        {value}
      </div>
    </div>
    {to && (
      <Link to={to} style={{ color: "var(--text-muted)", display: "flex" }}>
        <OpenInNewIcon fontSize="small" />
      </Link>
    )}
  </div>
);

const Dashboard = () => {
  const { employees }                   = useContext(EmployeeContext);
  const { user, hasPermission }         = useContext(AuthContext);
  const [activities, setActivities]     = useState([]);
  const [activityLoading, setActLoading] = useState(false);

  useEffect(() => {
    if (!hasPermission("VIEW_ACTIVITY_LOGS")) return;
    const fetchActivities = async () => {
      try {
        setActLoading(true);
        const { data } = await api.get("/activities");
        setActivities(Array.isArray(data) ? data.slice(0, 5) : []);
      } catch {
        // silently ignore — not critical
      } finally {
        setActLoading(false);
      }
    };
    fetchActivities();
  }, []);

  const totalEmployees  = employees.length;
  const activeEmployees = employees.filter((e) => e.status === "Active").length;
  const departments     = new Set(employees.map((e) => e.department)).size;
  const activeRate      = totalEmployees > 0 ? Math.round((activeEmployees / totalEmployees) * 100) : 0;

  return (
    <div>
      {/* Greeting */}
      <div style={{ marginBottom: "2rem" }}>
        <h1 style={{ fontSize: "2rem", fontWeight: "700", marginBottom: "0.3rem" }}>
          Welcome back, {user?.name?.split(" ")[0] || "Admin"} 👋
        </h1>
        <p style={{ color: "var(--text-muted)", fontSize: "0.95rem" }}>
          {new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
        </p>
      </div>

      {/* Attendance Widget */}
      <AttendanceWidget />

      {/* Stat Cards */}
      <div style={{ display: "flex", gap: "1.5rem", flexWrap: "wrap", marginBottom: "2rem" }}>
        <StatCard
          title="Total Employees"
          value={totalEmployees}
          icon={<PeopleAlt fontSize="large" />}
          color="59, 130, 246"
          to="/employees"
        />
        <StatCard
          title="Active Employees"
          value={activeEmployees}
          icon={<CheckCircleIcon fontSize="large" />}
          color="16, 185, 129"
          to="/employees"
        />
        <StatCard
          title="Departments"
          value={departments}
          icon={<WorkOutlinedIcon fontSize="large" />}
          color="245, 158, 11"
        />
        <StatCard
          title="Active Rate"
          value={`${activeRate}%`}
          icon={<TrendingUpIcon fontSize="large" />}
          color="168, 85, 247"
        />
      </div>

      {/* Recent Activity Panel */}
      <div className="glass-panel" style={{ padding: "2rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
          <h2 style={{ fontSize: "1.2rem", color: "var(--text-main)", fontWeight: "600" }}>
            {activities.length > 0 ? "Recent System Activity" : "Recent Employees"}
          </h2>
          {hasPermission("VIEW_ACTIVITY_LOGS") && activities.length > 0 && (
            <Link to="/activities" style={{ fontSize: "0.85rem", color: "var(--accent-color)", display: "flex", alignItems: "center", gap: "4px" }}>
              View all <OpenInNewIcon fontSize="small" />
            </Link>
          )}
        </div>

        <div style={{ color: "var(--text-muted)", display: "flex", flexDirection: "column", gap: "0" }}>
          {activityLoading ? (
            <div style={{ textAlign: "center", padding: "2rem", color: "var(--text-muted)" }}>Loading…</div>
          ) : activities.length > 0 ? (
            activities.map((log, idx) => (
              <div
                key={log._id || idx}
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "1rem",
                  padding: "1rem 0",
                  borderBottom: idx !== activities.length - 1 ? "1px solid var(--border-color)" : "none",
                }}
              >
                <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "var(--accent-color)", marginTop: "6px", flexShrink: 0 }} />
                <div style={{ flex: 1 }}>
                  <p style={{ margin: 0, fontSize: "0.9rem", color: "var(--text-main)" }}>
                    <strong>{log.user?.name || "System"}</strong>{" "}
                    performed{" "}
                    <strong style={{ color: "var(--accent-color)" }}>{log.action}</strong>
                  </p>
                  <span style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>
                    {new Date(log.createdAt).toLocaleString()}
                  </span>
                </div>
              </div>
            ))
          ) : (
            employees.slice(-4).reverse().map((emp, idx, arr) => (
              <div
                key={emp._id || idx}
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "1rem",
                  padding: "1rem 0",
                  borderBottom: idx !== arr.length - 1 ? "1px solid var(--border-color)" : "none",
                }}
              >
                <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "var(--accent-color)", marginTop: "6px", flexShrink: 0 }} />
                <p style={{ margin: 0, fontSize: "0.9rem" }}>
                  New employee{" "}
                  <strong style={{ color: "var(--text-main)" }}>{emp.name}</strong>{" "}
                  added to{" "}
                  <strong style={{ color: "var(--text-main)" }}>{emp.department}</strong>
                </p>
              </div>
            ))
          )}

          {!activityLoading && activities.length === 0 && employees.length === 0 && (
            <div style={{ textAlign: "center", padding: "2rem", color: "var(--text-muted)" }}>
              No recent activity to display.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
