import { useContext } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const ProtectedRoute = ({ children }) => {
  const { user, loading, isAuthenticated } = useContext(AuthContext);
  const location = useLocation();

  // Wait for the silent token refresh to complete before deciding
  if (loading) {
    return (
      <div style={{
        display: "flex",
        height: "100vh",
        width: "100vw",
        alignItems: "center",
        justifyContent: "center",
        background: "var(--primary-bg)",
        color: "var(--text-muted)",
        fontSize: "1rem",
        gap: "1rem",
      }}>
        <span style={{
          width: 28,
          height: 28,
          borderRadius: "50%",
          border: "3px solid var(--accent-color)",
          borderTopColor: "transparent",
          animation: "spin 0.7s linear infinite",
          display: "inline-block",
        }} />
        Loading…
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;
