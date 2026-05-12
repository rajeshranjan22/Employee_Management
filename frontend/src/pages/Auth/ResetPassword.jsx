import { useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { TextField, Button, Alert, CircularProgress } from "@mui/material";
import { PeopleAlt as PeopleAltIcon, CheckCircle as CheckCircleIcon } from "@mui/icons-material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import toast from "react-hot-toast";

// ── Must match backend Joi validator exactly ───────────────────────────────────
const passwordRule = z
  .string()
  .min(8, "Minimum 8 characters")
  .max(128, "Maximum 128 characters")
  .regex(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/,
    "Must include uppercase, lowercase, a number & special char (@$!%*?&)"
  );

const resetSchema = z
  .object({
    password:        passwordRule,
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: "Passwords do not match",
    path:    ["confirmPassword"],
  });

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

const ResetPassword = () => {
  const { resetPassword }  = useContext(AuthContext);
  const navigate           = useNavigate();
  const [searchParams]     = useSearchParams();
  const token              = searchParams.get("token") || "";
  // Local state — avoids RHF isSubmitSuccessful flipping true on server errors
  const [done, setDone]    = useState(false);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(resetSchema) });

  const onSubmit = async ({ password }) => {
    if (!token) {
      setError("root", {
        message: "Invalid or missing reset token. Please use the link from your email.",
      });
      return;
    }
    const result = await resetPassword(token, password);
    if (result.success) {
      toast.success("Password updated! Please sign in.");
      setDone(true);
    } else {
      setError("root", { message: result.error });
      toast.error(result.error);
    }
  };

  // ── Success screen ───────────────────────────────────────────────────────────
  if (done) {
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
            "radial-gradient(ellipse at 70% 30%, rgba(16,185,129,0.06) 0%, transparent 55%)",
        }}
      >
        <div
          className="glass-panel"
          style={{ padding: "2.5rem", width: "100%", maxWidth: "420px", textAlign: "center" }}
        >
          <CheckCircleIcon sx={{ fontSize: 64, color: "var(--success-color)", mb: 2 }} />
          <h3 style={{ marginBottom: "0.75rem", color: "var(--text-main)" }}>
            Password Reset! ✅
          </h3>
          <p style={{ color: "var(--text-muted)", fontSize: "0.9rem", marginBottom: "2rem" }}>
            Your password has been updated successfully. You can now sign in with your new
            password.
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
            Sign In Now
          </Button>
        </div>
      </div>
    );
  }

  // ── Reset form ───────────────────────────────────────────────────────────────
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
          "radial-gradient(ellipse at 70% 30%, rgba(16,185,129,0.06) 0%, transparent 55%)",
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
            marginTop: "0.5rem",
          }}
        >
          Enter your new password below
        </p>

        {!token && (
          <Alert severity="warning" sx={{ mb: 2, borderRadius: 2 }}>
            No reset token found. Please use the link from your email.
          </Alert>
        )}

        {errors.root && (
          <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>
            {errors.root.message}
          </Alert>
        )}

        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <TextField
            fullWidth
            label="New Password"
            type="password"
            {...register("password")}
            error={!!errors.password}
            helperText={
              errors.password?.message || (
                <span style={{ color: "var(--text-muted)", fontSize: "0.78rem" }}>
                  Min 8 chars · uppercase · lowercase · number · special char
                </span>
              )
            }
            sx={inputSx}
          />
          <TextField
            fullWidth
            label="Confirm New Password"
            type="password"
            {...register("confirmPassword")}
            error={!!errors.confirmPassword}
            helperText={errors.confirmPassword?.message}
            sx={inputSx}
          />

          <Button
            type="submit"
            variant="contained"
            fullWidth
            disabled={isSubmitting || !token}
            sx={{
              py: 1.3,
              fontWeight: 700,
              fontSize: "1rem",
              mb: 2,
              background: "var(--accent-color)",
              "&:hover": { background: "var(--accent-hover)" },
            }}
          >
            {isSubmitting ? <CircularProgress size={22} color="inherit" /> : "Reset Password"}
          </Button>
        </form>

        <div style={{ textAlign: "center" }}>
          <Link
            to="/login"
            style={{
              color: "var(--text-muted)",
              fontSize: "0.9rem",
              display: "inline-flex",
              alignItems: "center",
              gap: "4px",
            }}
          >
            <ArrowBackIcon fontSize="small" /> Back to Sign In
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
