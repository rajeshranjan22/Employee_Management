import { useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { TextField, Button, Alert, CircularProgress } from "@mui/material";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";

const Login = () => {
  const { login } = useContext(AuthContext);
  const navigate  = useNavigate();

  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [error, setError]       = useState("");
  const [loading, setLoading]   = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const result = await login(email, password);
    setLoading(false);
    if (result.success) navigate("/");
    else setError(result.error);
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
      backgroundImage: "radial-gradient(ellipse at 20% 50%, rgba(59,130,246,0.08) 0%, transparent 60%)",
    }}>
      <div className="glass-panel" style={{ padding: "2.5rem", width: "100%", maxWidth: "420px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", mb: "0.5rem", gap: "10px", color: "var(--accent-color)", marginBottom: "0.5rem" }}>
          <PeopleAltIcon fontSize="large" />
          <span style={{ fontSize: "1.5rem", fontWeight: "800", letterSpacing: "-0.5px" }}>EMS Portal</span>
        </div>
        <p style={{ textAlign: "center", color: "var(--text-muted)", fontSize: "0.9rem", marginBottom: "1.8rem" }}>
          Sign in to your account to continue
        </p>

        {error && <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>{error}</Alert>}

        <form onSubmit={handleSubmit}>
          <TextField fullWidth label="Email Address" type="email"
            value={email} onChange={(e) => setEmail(e.target.value)}
            required sx={inputSx} />
          <TextField fullWidth label="Password" type="password"
            value={password} onChange={(e) => setPassword(e.target.value)}
            required sx={inputSx} />

          <div style={{ textAlign: "right", marginBottom: "1.2rem", marginTop: "-0.4rem" }}>
            <Link to="/forgot-password" style={{ fontSize: "0.85rem", color: "var(--accent-color)" }}>
              Forgot password?
            </Link>
          </div>

          <Button type="submit" variant="contained" fullWidth disabled={loading}
            sx={{ py: 1.3, fontWeight: 700, fontSize: "1rem", mb: 2,
              background: "var(--accent-color)", "&:hover": { background: "var(--accent-hover)" } }}>
            {loading ? <CircularProgress size={22} color="inherit" /> : "Sign In"}
          </Button>
        </form>

        <div style={{ textAlign: "center", color: "var(--text-muted)", fontSize: "0.9rem" }}>
          Don't have an account?{" "}
          <Link to="/register" style={{ color: "var(--accent-color)", fontWeight: 600 }}>Register here</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
