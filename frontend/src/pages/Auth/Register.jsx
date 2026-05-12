import { useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import {
  TextField, Button, Alert, CircularProgress, MenuItem,
} from "@mui/material";
import { PeopleAlt as PeopleAltIcon, CheckCircle as CheckCircleIcon } from "@mui/icons-material";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import toast from "react-hot-toast";

// ── Must match backend Joi password rule exactly ───────────────────────────────
const passwordRule = z
  .string()
  .min(8, "Minimum 8 characters")
  .max(128, "Maximum 128 characters")
  .regex(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/,
    "Must include uppercase, lowercase, a number & special char (@$!%*?&)"
  );

const registerSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name cannot exceed 100 characters"),
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please provide a valid email address"),
  password:   passwordRule,
  department: z.string().default("All"),
});

const DEPARTMENTS = [
  "Engineering", "Design", "HR", "Marketing",
  "Finance", "Operations", "Sales", "Other", "All",
];

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

const Register = () => {
  const { register: registerUser } = useContext(AuthContext);
  const navigate = useNavigate();
  // Use local state — RHF's isSubmitSuccessful flips on ANY completed submit, even failures
  const [registered, setRegistered] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: { department: "All" },
  });

  const onSubmit = async ({ name, email, password, department }) => {
    const result = await registerUser(name, email, password, department);
    if (result.success) {
      toast.success("Account created! Please verify your email.");
      setRegistered(true);
    } else {
      setError("root", { message: result.error });
      toast.error(result.error || "Registration failed.");
    }
  };

  // ── Success screen ───────────────────────────────────────────────────────────
  if (registered) {
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
            "radial-gradient(ellipse at 50% 20%, rgba(16,185,129,0.07) 0%, transparent 55%)",
        }}
      >
        <div
          className="glass-panel"
          style={{ padding: "2.5rem", width: "100%", maxWidth: "420px", textAlign: "center" }}
        >
          <CheckCircleIcon sx={{ fontSize: 64, color: "var(--success-color)", mb: 2 }} />
          <h3 style={{ marginBottom: "0.75rem", color: "var(--text-main)" }}>
            Account Created! 🎉
          </h3>
          <p style={{ color: "var(--text-muted)", fontSize: "0.9rem", marginBottom: "1.5rem" }}>
            Please check your email inbox and click the verification link before signing in.
          </p>
          <Button
            variant="contained"
            fullWidth
            onClick={() => navigate("/login")}
            sx={{
              py: 1.3,
              fontWeight: 700,
              background: "var(--accent-color)",
              "&:hover": { background: "var(--accent-hover)" },
            }}
          >
            Go to Sign In
          </Button>
        </div>
      </div>
    );
  }

  // ── Registration form ────────────────────────────────────────────────────────
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
          "radial-gradient(ellipse at 80% 20%, rgba(168,85,247,0.07) 0%, transparent 50%)",
      }}
    >
      <div
        className="glass-panel"
        style={{ padding: "2.5rem", width: "100%", maxWidth: "440px" }}
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
          Create your account
        </p>

        {errors.root && (
          <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>
            {errors.root.message}
          </Alert>
        )}

        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <TextField
            fullWidth
            label="Full Name"
            {...register("name")}
            error={!!errors.name}
            helperText={errors.name?.message}
            sx={inputSx}
          />
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
            helperText={
              errors.password?.message || (
                <span style={{ color: "var(--text-muted)", fontSize: "0.78rem" }}>
                  Min 8 chars · uppercase · lowercase · number · special char (@$!%*?&amp;)
                </span>
              )
            }
            sx={inputSx}
          />

          {/* Department selector */}
          <Controller
            name="department"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                select
                fullWidth
                label="Department"
                error={!!errors.department}
                helperText={errors.department?.message}
                sx={{
                  ...inputSx,
                  "& .MuiSelect-icon": { color: "var(--text-muted)" },
                }}
              >
                {DEPARTMENTS.map((d) => (
                  <MenuItem key={d} value={d} sx={{ color: "var(--text-main)" }}>
                    {d}
                  </MenuItem>
                ))}
              </TextField>
            )}
          />

          <Button
            type="submit"
            variant="contained"
            fullWidth
            disabled={isSubmitting}
            sx={{
              py: 1.3,
              fontWeight: 700,
              fontSize: "1rem",
              mt: 1,
              mb: 2,
              background: "var(--accent-color)",
              "&:hover": { background: "var(--accent-hover)" },
            }}
          >
            {isSubmitting ? <CircularProgress size={22} color="inherit" /> : "Create Account"}
          </Button>
        </form>

        <div style={{ textAlign: "center", color: "var(--text-muted)", fontSize: "0.9rem" }}>
          Already have an account?{" "}
          <Link to="/login" style={{ color: "var(--accent-color)", fontWeight: 600 }}>
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
