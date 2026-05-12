import { useEffect, useState, useContext } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { CircularProgress } from "@mui/material";
import { AuthContext } from "../../context/AuthContext";

/**
 * Landing page for Google OAuth redirect.
 * The backend redirects here with:
 *   /oauth-callback?token=<accessToken>&name=<name>&email=<email>
 *
 * This component sets auth state in context and redirects to the dashboard.
 */
const OAuthCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { loginWithOAuthToken } = useContext(AuthContext);
  const [error, setError] = useState("");

  useEffect(() => {
    const handleCallback = async () => {
      const token = searchParams.get("token");
      const oauthError = searchParams.get("error");

      if (oauthError) {
        setError("Google authentication failed. Please try again.");
        setTimeout(() => navigate("/login", { replace: true }), 3000);
        return;
      }

      if (!token) {
        setError("No authentication token received.");
        setTimeout(() => navigate("/login", { replace: true }), 3000);
        return;
      }

      try {
        // loginWithOAuthToken sets the token and fetches the full user profile (/auth/me)
        await loginWithOAuthToken(token);
        navigate("/", { replace: true });
      } catch {
        setError("Failed to complete authentication. Please try again.");
        setTimeout(() => navigate("/login", { replace: true }), 3000);
      }
    };

    handleCallback();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        width: "100vw",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "var(--primary-bg)",
        gap: "1.5rem",
      }}
    >
      {error ? (
        <>
          <span style={{ fontSize: "2.5rem" }}>⚠️</span>
          <p style={{ color: "var(--danger-color)", fontSize: "1rem", fontWeight: 600 }}>
            {error}
          </p>
          <p style={{ color: "var(--text-muted)", fontSize: "0.875rem" }}>
            Redirecting to login…
          </p>
        </>
      ) : (
        <>
          <CircularProgress size={52} sx={{ color: "var(--accent-color)" }} />
          <p style={{ color: "var(--text-muted)", fontSize: "1rem" }}>
            Completing Google sign-in…
          </p>
        </>
      )}
    </div>
  );
};

export default OAuthCallback;
