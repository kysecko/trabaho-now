import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  ShieldCheckIcon,
  EyeIcon,
  EyeSlashIcon,
  CheckBadgeIcon,ArrowRightIcon
} from "@heroicons/react/24/outline";

import Container from "../../components/layout/Container";
import Field from "../../components/ui/Field";
import { resetPassword } from "../../api/auth";
import { useAuth } from "../../context/AuthContext";

export default function ResetPassword() {
  const { logout } = useAuth();
  const [params] = useSearchParams();
  const token = params.get("token") || "";
  const email = params.get("email") || "";

  const [form, setForm] = useState({ password: "", password_confirmation: "" });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const update = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const first = (name) => errors[name]?.[0] ?? "";

  if (!token || !email) {
    return (
      <Container>
        <h2 className="text-2xl font-semibold">Invalid link</h2>
        <p className="mt-2 text-gray-600">This reset link is missing information.</p>
        <Link to="/forgot-password" className="mt-4 inline-block font-semibold text-primary hover:underline">
          Request a new link
        </Link>
      </Container>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setErrors({});
    try {
      await resetPassword({ token, email, ...form });
      logout();  
      setDone(true);
    } catch (err) {
      setErrors(err.errors || { form: [err.message] });
    } finally {
      setSubmitting(false);
    }
  };

  // Success screen
  if (done) {
    return (
      <Container>
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
            <CheckBadgeIcon className="h-10 w-10 text-green-600" />
          </div>
          <h2 className="text-2xl font-semibold">Password updated!</h2>
          <p className="mt-2 text-gray-600">
            Your password has been changed successfully. You can now log in with your new password.
          </p>
          <Link
            to="/login"
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-lg bg-orange-600 px-4 py-2 text-center text-white transition hover:bg-orange-700"
          >
            Go to login
            <ArrowRightIcon className="h-5 w-5" />
          </Link>
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <h2 className="text-2xl font-semibold">Set a new password.</h2>
      <p className="pb-3 text-gray-600">
        Enter a new password for your account. Make sure it’s strong and easy for you to remember.
      </p>

      {first("form") && (
        <div className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">{first("form")}</div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <Field
          label="New password"
          name="password"
          type={showPassword ? "text" : "password"}
          value={form.password}
          onChange={update}
          error={first("password")}
          required
          icon={<ShieldCheckIcon className="h-4 w-4" />}
          rightIcon={
            <button type="button" onClick={() => setShowPassword(!showPassword)} className="text-muted hover:text-navy">
              {showPassword ? <EyeIcon className="h-5 w-5" /> : <EyeSlashIcon className="h-5 w-5" />}
            </button>
          }
        />

        <Field
          label="Confirm new password"
          name="password_confirmation"
          type={showConfirm ? "text" : "password"}
          value={form.password_confirmation}
          onChange={update}
          error={first("password_confirmation")}
          required
          icon={<ShieldCheckIcon className="h-4 w-4" />}
          rightIcon={
            <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="text-muted hover:text-navy">
              {showConfirm ? <EyeIcon className="h-5 w-5" /> : <EyeSlashIcon className="h-5 w-5" />}
            </button>
          }
        />

        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-lg bg-orange-600 px-4 py-2 text-white transition hover:bg-orange-700 disabled:opacity-60"
        >
          {submitting ? "Updating password..." : "Reset password"}
        </button>
      </form>
    </Container>
  );
}