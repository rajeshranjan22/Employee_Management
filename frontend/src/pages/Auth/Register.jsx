import { useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { TextField, Button, Alert, CircularProgress } from "@mui/material";
import { PeopleAlt as PeopleAltIcon, CheckCircle as CheckCircleIcon } from "@mui/icons-material";

const Register = () => {
  const { register } = useContext(AuthContext);
  const navigate     = useNavigate();

  const [name, setName]         = useState("");
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [error, setError]       = useState("");
  const [success, setSuccess]   = useState(false);
  const [loading, setLoading]   = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const result = await register(name, email, password);
    setLoading(false);
    if (result.success) {
      setSuccess(true);
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
      backgroundImage: "radial-gradient(ellipse at 80% 20%, rgba(168,85,247,0.07) 0%, transparent 50%)",
    }}>
      <div className="glass-panel" style={{ padding: "2.5rem", width: "100%", maxWidth: "420px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "10px", color: "var(--accent-color)", marginBottom: "0.5rem" }}>
          <PeopleAltIcon fontSize="large" />
          <span style={{ fontSize: "1.5rem", fontWeight: "800", letterSpacing: "-0.5px" }}>EMS Portal</span>
        </div>
        <p style={{ textAlign: "center", color: "var(--text-muted)", fontSize: "0.9rem", marginBottom: "1.8rem" }}>
          Create your account
        </p>

        {success ? (
          <div style={{ textAlign: "center", padding: "1rem 0" }}>
            <CheckCircleIcon sx={{ fontSize: 60, color: "var(--success-color)", mb: 2 }} />
            <h3 style={{ marginBottom: "0.75rem", color: "var(--text-main)" }}>Account Created!</h3>
            <p style={{ color: "var(--text-muted)", fontSize: "0.9rem", marginBottom: "1.5rem" }}>
              Please check your email to verify your account before signing in.
            </p>
            <Button variant="contained" fullWidth onClick={() => navigate("/login")}
              sx={{ py: 1.3, fontWeight: 700, background: "var(--accent-color)" }}>
              Go to Sign In
            </Button>
          </div>
        ) : (
          <>
            {error && <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>{error}</Alert>}

            <form onSubmit={handleSubmit}>
              <TextField fullWidth label="Full Name" type="text"
                value={name} onChange={(e) => setName(e.target.value)} required sx={inputSx} />
              <TextField fullWidth label="Email Address" type="email"
                value={email} onChange={(e) => setEmail(e.target.value)} required sx={inputSx} />
              <TextField fullWidth label="Password" type="password"
                value={password} onChange={(e) => setPassword(e.target.value)} required sx={inputSx}
                helperText={<span style={{ color: "var(--text-muted)", fontSize: "0.78rem" }}>Min 8 chars, must include uppercase, lowercase, number & special char (@$!%*?&)</span>} />

              <Button type="submit" variant="contained" fullWidth disabled={loading}
                sx={{ py: 1.3, fontWeight: 700, fontSize: "1rem", mt: 1, mb: 2,
                  background: "var(--accent-color)", "&:hover": { background: "var(--accent-hover)" } }}>
                {loading ? <CircularProgress size={22} color="inherit" /> : "Create Account"}
              </Button>
            </form>

            <div style={{ textAlign: "center", color: "var(--text-muted)", fontSize: "0.9rem" }}>
              Already have an account?{" "}
              <Link to="/login" style={{ color: "var(--accent-color)", fontWeight: 600 }}>Sign in</Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Register;
