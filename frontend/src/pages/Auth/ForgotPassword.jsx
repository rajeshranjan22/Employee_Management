import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { Link } from "react-router-dom";
import { TextField, Button, CircularProgress } from "@mui/material";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import MarkEmailReadIcon from "@mui/icons-material/MarkEmailRead";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import toast from "react-hot-toast";

// ── Validation schema ──────────────────────────────────────────────────────────
const schema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please provide a valid email address"),
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

const ForgotPassword = () => {
  const { forgotPassword } = useContext(AuthContext);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting, isSubmitSuccessful },
  } = useForm({ resolver: zodResolver(schema) });

  // Keep a ref to the submitted email so we can display it in the success state
  const submittedEmail = watch("email");

  const onSubmit = async ({ email }) => {
    const result = await forgotPassword(email);
    if (!result.success) {
      // Only show an error toast on a real failure (rate limit, server error, etc.)
      toast.error(result.error || "Something went wrong. Please try again.");
    }
    // On success we do NOT show a toast — the success screen is the confirmation
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
          "radial-gradient(ellipse at 30% 70%, rgba(59,130,246,0.07) 0%, transparent 55%)",
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

        {/* Success state — shown after the API call resolves (success or not, we show this
            to prevent email enumeration — backend always returns 200) */}
        {isSubmitSuccessful ? (
          <div style={{ textAlign: "center", padding: "1.5rem 0" }}>
            <MarkEmailReadIcon sx={{ fontSize: 64, color: "var(--success-color)", mb: 2 }} />
            <h3 style={{ marginBottom: "0.75rem", color: "var(--text-main)" }}>
              Check Your Email
            </h3>
            <p style={{ color: "var(--text-muted)", fontSize: "0.9rem", marginBottom: "2rem" }}>
              If{" "}
              <strong style={{ color: "var(--text-main)" }}>{submittedEmail}</strong>{" "}
              is registered, a password reset link has been sent. Please check your inbox
              and spam folder.
            </p>
            <Link to="/login">
              <Button variant="outlined" startIcon={<ArrowBackIcon />} fullWidth>
                Back to Sign In
              </Button>
            </Link>
          </div>
        ) : (
          <>
            <p
              style={{
                textAlign: "center",
                color: "var(--text-muted)",
                fontSize: "0.9rem",
                marginBottom: "1.8rem",
                marginTop: "0.5rem",
              }}
            >
              Enter your email and we&apos;ll send you a reset link
            </p>

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
                {isSubmitting ? (
                  <CircularProgress size={22} color="inherit" />
                ) : (
                  "Send Reset Link"
                )}
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
          </>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
