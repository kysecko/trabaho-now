import { useState } from "react";
import { Link, Navigate, useLocation } from "react-router-dom";
import { loginUser } from "../../api/auth";
import { useAuth } from "../../context/AuthContext";
import Field from "../../components/ui/Field";
import { roleHome } from "../../lib/roleHome";

import { EnvelopeIcon, ShieldCheckIcon, EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";

export default function Login() {
  const { user, login } = useAuth();
  const location = useLocation();
  const from = location.state?.from;

  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // smart redirect logic
  if (user) return <Navigate to={from || roleHome(user)} replace />;

  const first = (key) => errors[key]?.[0];
  const update = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setErrors({});
    try {
      const data = await loginUser(form);
      login(data.token, data.user);
    } catch (err) {
      setErrors(err.errors || { form: [err.message] });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="w-full">
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-bold text-navy sm:text-3xl">Welcome back!</h1>
        <p className="mt-2 text-sm text-muted">Log in to continue — to your job search or your services.</p>
      </div>

      {location.state?.verified && (
        <div className="mb-5 rounded-lg bg-green-50 px-4 py-3 text-sm text-green-700">
          Email verified. Please log in.
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        {first("form") && (
          <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-danger">
            {first("form")}
          </div>
        )}

        <Field label="Email" name="email" type="email" value={form.email} onChange={update} error={first("email")} required icon={<EnvelopeIcon className="w-4 h-4" />} />

        <Field
          label="Password"
          name="password"
          type={showPassword ? "text" : "password"}
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
              {showPassword ? <EyeIcon className="w-5 h-5" /> : <EyeSlashIcon className="w-5 h-5" />}
            </button>
          }
        />

        <div className="flex justify-end">
          <Link to="/forgot-password" state={{ from }} className="text-sm font-semibold text-primary hover:underline">
            Forgot your password?
          </Link>
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-lg bg-primary py-3 text-sm font-semibold text-white transition hover:bg-primary-hover disabled:opacity-60"
        >
          {submitting ? "Logging in..." : "Log in"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-muted">
        Don't have an account?{" "}
        <Link to="/register" state={{ from }} className="font-semibold text-primary hover:underline">
          Register here.
        </Link>
      </p>
    </div>
  );
}