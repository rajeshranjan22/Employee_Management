import { useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { TextField, Button, Alert } from "@mui/material";
import PersonAddIcon from "@mui/icons-material/PersonAdd";

const Register = () => {
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const result = await register(name, email, password);
    if (result.success) {
      navigate("/login");
    } else {
      setError(result.error);
    }
  };

  const inputStyles = {
    marginBottom: "1.5rem",
    "& .MuiOutlinedInput-root": {
      "& fieldset": { borderColor: "var(--border-color)" },
      "&:hover fieldset": { borderColor: "var(--text-muted)" },
      "&.Mui-focused fieldset": { borderColor: "var(--accent-color)" },
    },
    "& .MuiInputLabel-root": { color: "var(--text-muted)" },
    "& .MuiInputLabel-root.Mui-focused": { color: "var(--accent-color)" },
    "& .MuiInputBase-input": { color: "var(--text-main)" },
  };

  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        width: "100vw",
        alignItems: "center",
        justifyContent: "center",
        background: "var(--primary-bg)",
      }}
    >
      <div
        className="glass-panel"
        style={{ padding: "3rem", width: "100%", maxWidth: "400px" }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: "2rem",
            gap: "10px",
            color: "var(--accent-color)",
          }}
        >
          <PersonAddIcon fontSize="large" />
          <h1 style={{ fontSize: "1.8rem", fontWeight: "bold" }}>
            Register Account
          </h1>
        </div>

        {error && (
          <Alert
            severity="error"
            style={{
              marginBottom: "1.5rem",
              background: "rgba(239, 68, 68, 0.1)",
              color: "#ef4444",
            }}
          >
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Full Name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            sx={inputStyles}
          />
          <TextField
            fullWidth
            label="Email Address"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            sx={inputStyles}
          />
          <TextField
            fullWidth
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            sx={inputStyles}
          />

          <Button
            type="submit"
            variant="contained"
            fullWidth
            style={{
              background: "var(--accent-color)",
              color: "#fff",
              padding: "0.8rem",
              fontWeight: "600",
              fontSize: "1rem",
              marginBottom: "1.5rem",
            }}
            className="hover-scale"
          >
            Create Account
          </Button>

          <div style={{ textAlign: "center", color: "var(--text-muted)" }}>
            Already have an account?{" "}
            <Link to="/login" style={{ color: "var(--accent-color)" }}>
              Sign in
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
