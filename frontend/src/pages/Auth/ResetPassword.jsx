import { useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { TextField, Button, Alert, CircularProgress } from "@mui/material";
import { PeopleAlt as PeopleAltIcon, CheckCircle as CheckCircleIcon } from "@mui/icons-material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

const ResetPassword = () => {
  const { resetPassword }          = useContext(AuthContext);
  const navigate                   = useNavigate();
  const [searchParams]             = useSearchParams();
  const token                      = searchParams.get("token") || "";

  const [password, setPassword]   = useState("");
  const [confirm, setConfirm]     = useState("");
  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState("");
  const [done, setDone]           = useState(false);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (password !== confirm) { setError("Passwords do not match."); return; }
    if (password.length < 8)  { setError("Password must be at least 8 characters."); return; }
    if (!token)               { setError("Invalid or missing reset token."); return; }

    setLoading(true);
    const result = await resetPassword(token, password);
    setLoading(false);
    if (result.success) setDone(true);
    else setError(result.error);
  };

  return (
    <div style={{
      display: "flex", height: "100vh", width: "100vw",
      alignItems: "center", justifyContent: "center",
      background: "var(--primary-bg)",
      backgroundImage: "radial-gradient(ellipse at 70% 30%, rgba(16,185,129,0.06) 0%, transparent 55%)",
    }}>
      <div className="glass-panel" style={{ padding: "2.5rem", width: "100%", maxWidth: "420px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "10px", color: "var(--accent-color)", marginBottom: "0.5rem" }}>
          <PeopleAltIcon fontSize="large" />
          <span style={{ fontSize: "1.5rem", fontWeight: "800", letterSpacing: "-0.5px" }}>EMS Portal</span>
        </div>

        {done ? (
          <div style={{ textAlign: "center", padding: "1.5rem 0" }}>
            <CheckCircleIcon sx={{ fontSize: 64, color: "var(--success-color)", mb: 2 }} />
            <h3 style={{ marginBottom: "0.75rem", color: "var(--text-main)" }}>Password Reset!</h3>
            <p style={{ color: "var(--text-muted)", fontSize: "0.9rem", marginBottom: "2rem" }}>
              Your password has been updated successfully. You can now sign in.
            </p>
            <Button variant="contained" fullWidth onClick={() => navigate("/login")}
              sx={{ py: 1.3, fontWeight: 700, background: "var(--accent-color)" }}>
              Sign In Now
            </Button>
          </div>
        ) : (
          <>
            <p style={{ textAlign: "center", color: "var(--text-muted)", fontSize: "0.9rem", marginBottom: "1.8rem", marginTop: "0.5rem" }}>
              Enter your new password below
            </p>

            {!token && (
              <Alert severity="warning" sx={{ mb: 2, borderRadius: 2 }}>
                No reset token found. Please use the link from your email.
              </Alert>
            )}

            {error && <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>{error}</Alert>}

            <form onSubmit={handleSubmit}>
              <TextField fullWidth label="New Password" type="password"
                value={password} onChange={(e) => setPassword(e.target.value)}
                required sx={inputSx}
                helperText={<span style={{ color: "var(--text-muted)", fontSize: "0.78rem" }}>Minimum 8 characters</span>} />
              <TextField fullWidth label="Confirm New Password" type="password"
                value={confirm} onChange={(e) => setConfirm(e.target.value)}
                required sx={inputSx} />

              <Button type="submit" variant="contained" fullWidth disabled={loading || !token}
                sx={{ py: 1.3, fontWeight: 700, fontSize: "1rem", mb: 2,
                  background: "var(--accent-color)", "&:hover": { background: "var(--accent-hover)" } }}>
                {loading ? <CircularProgress size={22} color="inherit" /> : "Reset Password"}
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

export default ResetPassword;
