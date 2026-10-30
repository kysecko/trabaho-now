import { useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { registerUser } from "../../api/auth";
import { useAuth } from "../../context/AuthContext";
import Field from "../../components/ui/Field";
import { UserIcon, ShieldCheckIcon, EyeIcon, EyeSlashIcon, EnvelopeIcon } from "@heroicons/react/24/outline";

export default function Register() {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const from = location.state?.from;
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
    role: "client",
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  // If already logged in, redirect
  if (user) return <Navigate to={from || `/${user.role}`} replace />;

  const first = (key) => errors[key]?.[0];
  const update = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setErrors({});

    try {
      const response = await registerUser(form);
      const token = response.token || response.data?.token;

      if (token) {
        // ⚠️ THIS IS THE MISSING LINE
        localStorage.setItem("token", token);

        navigate("/verify", {
          state: {
            email: response.user?.email || response.data?.user?.email,
            tempToken: token
          }
        });
      } else {
        setErrors({ form: ["Registration succeeded, but no token was returned."] });
      }

    } catch (err) {
      console.error("Registration Error:", err);
      setErrors(err.errors || { form: [err.message || "An unexpected error occurred."] });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="w-full">
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-bold text-navy sm:text-3xl">Create your account.</h1>
        <p id="signup-subtitle" className="mt-2 text-sm text-muted">
          Fill up the form to choose how you'd like to get started — find work or offer your services.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {first("form") && (
          <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-danger">
            {first("form")}
          </div>
        )}

        <Field label="Full name" name="name" value={form.name} onChange={update} error={first("name")} required icon={<UserIcon className="w-4 h-4" />} />

        <Field label="Email" name="email" type="email" value={form.email} onChange={update} error={first("email")} required icon={<EnvelopeIcon className="w-4 h-4" />} />

        <Field
          label="Password"
          name="password"
          type={showPassword ? "text" : "password"}
          autoComplete="new-password"
          value={form.password}
          onChange={update}
          error={first("password")}
          required
          icon={<ShieldCheckIcon className="w-4 h-4" />}
          rightIcon={
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="text-muted hover:text-navy"
            >
              {showPassword
                ? <EyeIcon className="w-5 h-5" />
                : <EyeSlashIcon className="w-5 h-5" />}
            </button>
          }
        />

        <Field
          label="Confirm password"
          name="password_confirmation"
          type={showConfirm ? "text" : "password"}
          value={form.password_confirmation}
          onChange={update}
          error={first("password_confirmation")}
          required
          icon={<ShieldCheckIcon className="w-4 h-4" />}
          rightIcon={
            <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="text-muted hover:text-navy">
              {showConfirm ? <EyeIcon className="w-5 h-5" /> : <EyeSlashIcon className="w-5 h-5" />}
            </button>
          }
        />
        <p className="text-center text-xs text-muted">
          By creating an account, you agree to our{" "} <Link to="/terms" className="font-semibold text-primary hover:underline">Terms Condition</Link> and {" "}
          <Link to="/privacy" className="font-semibold text-primary hover:underline">
            Privacy Policy {" "}
          </Link>
          of TrabahoNow.
        </p>

        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-lg bg-primary py-3 text-sm font-semibold text-white transition hover:bg-primary-hover disabled:opacity-60"
        >
          {submitting ? "Creating account..." : "Create account"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-muted">
        Already have an account?{" "}
        <Link to="/login" state={{ from }} className="font-semibold text-primary hover:underline">
          Log in here.
        </Link>
      </p>
    </div>
  );
}