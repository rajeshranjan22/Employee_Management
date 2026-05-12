import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import {
  TextField, Button, CircularProgress, Alert, Divider,
} from "@mui/material";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import GoogleIcon from "@mui/icons-material/Google";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import toast from "react-hot-toast";

// ── Validation schema ──────────────────────────────────────────────────────────
const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please provide a valid email address"),
  password: z.string().min(1, "Password is required"),
});

// ── Shared input styling ───────────────────────────────────────────────────────
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
  "& .MuiFormHelperText-root":         { color: "var(--danger-color)" },
};

// Backend Google OAuth redirect — Passport.js handles the consent screen
const GOOGLE_AUTH_URL = `${
  (import.meta.env.VITE_API_URL || "http://localhost:5000/api").replace(/\/api$/, "")
}/api/auth/google`;

const Login = () => {
  const { login } = useContext(AuthContext);
  const navigate   = useNavigate();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(loginSchema) });

  const onSubmit = async ({ email, password }) => {
    const result = await login(email, password);

    if (result.success) {
      toast.success("Welcome back! 👋");
      navigate("/");
    } else {
      // For EMAIL_NOT_VERIFIED show a longer toast with a hint
      if (result.code === "EMAIL_NOT_VERIFIED") {
        toast.error(result.error, { duration: 7000 });
      } else {
        setError("root", { message: result.error });
        toast.error(result.error);
      }
    }
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
        backgroundImage:
          "radial-gradient(ellipse at 20% 50%, rgba(59,130,246,0.08) 0%, transparent 60%)",
      }}
    >
      <div
        className="glass-panel"
        style={{ padding: "2.5rem", width: "100%", maxWidth: "420px" }}
      >
        {/* Logo */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "10px",
            color: "var(--accent-color)",
            marginBottom: "0.5rem",
          }}
        >
          <PeopleAltIcon fontSize="large" />
          <span style={{ fontSize: "1.5rem", fontWeight: "800", letterSpacing: "-0.5px" }}>
            EMS Portal
          </span>
        </div>
        <p
          style={{
            textAlign: "center",
            color: "var(--text-muted)",
            fontSize: "0.9rem",
            marginBottom: "1.8rem",
          }}
        >
          Sign in to your account to continue
        </p>

        {/* Root-level form error (wrong credentials etc.) */}
        {errors.root && (
          <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>
            {errors.root.message}
          </Alert>
        )}

        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <TextField
            fullWidth
            label="Email Address"
            type="email"
            {...register("email")}
            error={!!errors.email}
            helperText={errors.email?.message}
            sx={inputSx}
          />
          <TextField
            fullWidth
            label="Password"
            type="password"
            {...register("password")}
            error={!!errors.password}
            helperText={errors.password?.message}
            sx={inputSx}
          />

          {/* Forgot password link */}
          <div style={{ textAlign: "right", marginBottom: "1.2rem", marginTop: "-0.4rem" }}>
            <Link to="/forgot-password" style={{ fontSize: "0.85rem", color: "var(--accent-color)" }}>
              Forgot password?
            </Link>
          </div>

          <Button
            type="submit"
            variant="contained"
            fullWidth
            disabled={isSubmitting}
            sx={{
              py: 1.3,
              fontWeight: 700,
              fontSize: "1rem",
              mb: 2,
              background: "var(--accent-color)",
              "&:hover": { background: "var(--accent-hover)" },
            }}
          >
            {isSubmitting ? <CircularProgress size={22} color="inherit" /> : "Sign In"}
          </Button>
        </form>

        {/* Google OAuth divider */}
        <Divider sx={{ my: 1.5, borderColor: "rgba(255,255,255,0.08)", color: "var(--text-muted)", fontSize: "0.8rem" }}>
          or continue with
        </Divider>

        <Button
          fullWidth
          variant="outlined"
          startIcon={<GoogleIcon />}
          onClick={() => { window.location.href = GOOGLE_AUTH_URL; }}
          sx={{
            py: 1.2,
            mt: 1,
            mb: 2,
            fontWeight: 600,
            borderColor: "rgba(255,255,255,0.15)",
            color: "var(--text-main)",
            "&:hover": {
              borderColor: "rgba(255,255,255,0.35)",
              background: "rgba(255,255,255,0.04)",
            },
          }}
        >
          Continue with Google
        </Button>

        <div style={{ textAlign: "center", color: "var(--text-muted)", fontSize: "0.9rem" }}>
          Don&apos;t have an account?{" "}
          <Link to="/register" style={{ color: "var(--accent-color)", fontWeight: 600 }}>
            Register here
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
