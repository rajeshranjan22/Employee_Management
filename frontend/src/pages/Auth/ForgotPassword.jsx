import { useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { Link } from "react-router-dom";
import { TextField, Button, Alert, CircularProgress } from "@mui/material";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import MarkEmailReadIcon from "@mui/icons-material/MarkEmailRead";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

const ForgotPassword = () => {
  const { forgotPassword } = useContext(AuthContext);

  const [email, setEmail]     = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState("");
  const [sent, setSent]       = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const result = await forgotPassword(email);
    setLoading(false);
    if (result.success) {
      setSent(true);
    } else {
      setError(result.error);
    }
  };

  const inputSx = {
    mb: 2,
    "& .MuiOutlinedInput-root": {
      "& fieldset":             { borderColor: "rgba(255,255,255,0.12)" },
      "&:hover fieldset":       { borderColor: "rgba(255,255,255,0.3)" },
      "&.Mui-focused fieldset": { borderColor: "var(--accent-color)" },
    },
    "& .MuiInputLabel-root":             { color: "var(--text-muted)" },
    "& .MuiInputLabel-root.Mui-focused": { color: "var(--accent-color)" },
    "& .MuiInputBase-input":             { color: "var(--text-main)" },
  };

  return (
    <div style={{
      display: "flex", height: "100vh", width: "100vw",
      alignItems: "center", justifyContent: "center",
      background: "var(--primary-bg)",
      backgroundImage: "radial-gradient(ellipse at 30% 70%, rgba(59,130,246,0.07) 0%, transparent 55%)",
    }}>
      <div className="glass-panel" style={{ padding: "2.5rem", width: "100%", maxWidth: "420px" }}>
        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "10px", color: "var(--accent-color)", marginBottom: "0.5rem" }}>
          <PeopleAltIcon fontSize="large" />
          <span style={{ fontSize: "1.5rem", fontWeight: "800", letterSpacing: "-0.5px" }}>EMS Portal</span>
        </div>

        {sent ? (
          <div style={{ textAlign: "center", padding: "1.5rem 0" }}>
            <MarkEmailReadIcon sx={{ fontSize: 64, color: "var(--success-color)", mb: 2 }} />
            <h3 style={{ marginBottom: "0.75rem", color: "var(--text-main)" }}>Check Your Email</h3>
            <p style={{ color: "var(--text-muted)", fontSize: "0.9rem", marginBottom: "2rem" }}>
              If <strong style={{ color: "var(--text-main)" }}>{email}</strong> is registered, a password
              reset link has been sent. Please check your inbox and spam folder.
            </p>
            <Link to="/login">
              <Button variant="outlined" startIcon={<ArrowBackIcon />} fullWidth>
                Back to Sign In
              </Button>
            </Link>
          </div>
        ) : (
          <>
            <p style={{ textAlign: "center", color: "var(--text-muted)", fontSize: "0.9rem", marginBottom: "1.8rem", marginTop: "0.5rem" }}>
              Enter your email and we'll send you a reset link
            </p>

            {error && <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>{error}</Alert>}

            <form onSubmit={handleSubmit}>
              <TextField fullWidth label="Email Address" type="email"
                value={email} onChange={(e) => setEmail(e.target.value)}
                required sx={inputSx} />

              <Button type="submit" variant="contained" fullWidth disabled={loading}
                sx={{ py: 1.3, fontWeight: 700, fontSize: "1rem", mb: 2,
                  background: "var(--accent-color)", "&:hover": { background: "var(--accent-hover)" } }}>
                {loading ? <CircularProgress size={22} color="inherit" /> : "Send Reset Link"}
              </Button>
            </form>

            <div style={{ textAlign: "center" }}>
              <Link to="/login" style={{ color: "var(--text-muted)", fontSize: "0.9rem", display: "inline-flex", alignItems: "center", gap: "4px" }}>
                <ArrowBackIcon fontSize="small" /> Back to Sign In
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
