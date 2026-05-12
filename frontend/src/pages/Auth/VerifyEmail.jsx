import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { CircularProgress, Button } from "@mui/material";
import {
  PeopleAlt as PeopleAltIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
} from "@mui/icons-material";
import api from "../../api/axios.instance";

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  // status: "loading" | "success" | "error" | "invalid"
  const [status, setStatus] = useState("loading");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const verify = async () => {
      if (!token) {
        setStatus("invalid");
        setMessage("No verification token found. Please use the link from your email.");
        return;
      }
      try {
        const { data } = await api.get(`/auth/verify-email?token=${encodeURIComponent(token)}`);
        setStatus("success");
        setMessage(data.message || "Email verified successfully! You can now sign in.");
      } catch (err) {
        setStatus("error");
        setMessage(
          err.response?.data?.message ||
            "Verification failed. The link may be invalid or expired."
        );
      }
    };
    verify();
  }, [token]);

  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        width: "100vw",
        alignItems: "center",
        justifyContent: "center",
        background: "var(--primary-bg)",
        backgroundImage:
          "radial-gradient(ellipse at 50% 20%, rgba(59,130,246,0.08) 0%, transparent 60%)",
      }}
    >
      <div
        className="glass-panel"
        style={{ padding: "2.5rem", width: "100%", maxWidth: "420px", textAlign: "center" }}
      >
        {/* Logo */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "10px",
            color: "var(--accent-color)",
            marginBottom: "2rem",
          }}
        >
          <PeopleAltIcon fontSize="large" />
          <span style={{ fontSize: "1.5rem", fontWeight: "800", letterSpacing: "-0.5px" }}>
            EMS Portal
          </span>
        </div>

        {/* Loading */}
        {status === "loading" && (
          <div style={{ padding: "2rem 0" }}>
            <CircularProgress size={52} sx={{ color: "var(--accent-color)" }} />
            <p style={{ color: "var(--text-muted)", marginTop: "1.5rem", fontSize: "0.95rem" }}>
              Verifying your email address…
            </p>
          </div>
        )}

        {/* Success */}
        {status === "success" && (
          <>
            <CheckCircleIcon sx={{ fontSize: 64, color: "var(--success-color)", mb: 2 }} />
            <h3 style={{ marginBottom: "0.75rem", color: "var(--text-main)" }}>
              Email Verified! 🎉
            </h3>
            <p style={{ color: "var(--text-muted)", fontSize: "0.9rem", marginBottom: "2rem" }}>
              {message}
            </p>
            <Link to="/login">
              <Button
                variant="contained"
                fullWidth
                sx={{
                  py: 1.3,
                  fontWeight: 700,
                  background: "var(--accent-color)",
                  "&:hover": { background: "var(--accent-hover)" },
                }}
              >
                Sign In Now
              </Button>
            </Link>
          </>
        )}

        {/* Error / Invalid */}
        {(status === "error" || status === "invalid") && (
          <>
            <ErrorIcon sx={{ fontSize: 64, color: "var(--danger-color)", mb: 2 }} />
            <h3 style={{ marginBottom: "0.75rem", color: "var(--text-main)" }}>
              Verification Failed
            </h3>
            <p style={{ color: "var(--text-muted)", fontSize: "0.9rem", marginBottom: "2rem" }}>
              {message}
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              <Link to="/login">
                <Button
                  variant="contained"
                  fullWidth
                  sx={{
                    py: 1.3,
                    fontWeight: 700,
                    background: "var(--accent-color)",
                    "&:hover": { background: "var(--accent-hover)" },
                  }}
                >
                  Request New Verification Link
                </Button>
              </Link>
              <Link to="/login">
                <Button variant="outlined" fullWidth sx={{ py: 1.3, fontWeight: 600 }}>
                  Back to Sign In
                </Button>
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default VerifyEmail;
