import { useState } from "react";
import { Link, Navigate, useLocation } from "react-router-dom";
import { registerUser, googleLogin } from "../../api/auth";
import { useAuth } from "../../context/AuthContext";
import Field from "../../components/ui/Field";
import { GoogleLogin } from "@react-oauth/google";

export default function Signup() {
  const { user, login } = useAuth();
  const location = useLocation();
  const from = location.state?.from;

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
    role: "client",
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  if (user && !success) return <Navigate to={from || `/${user.role}`} replace />;

  const first = (key) => errors[key]?.[0];
  const update = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setErrors({});
    try {
      await registerUser(form);
      setSuccess(true);
    } catch (err) {
      setErrors(err.errors || { form: [err.message] });
    } finally {
      setSubmitting(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    setSubmitting(true);
    setErrors({});
    try {
      const data = await googleLogin(credentialResponse.credential, form.role);
      login(data.token, data.user);
    } catch (err) {
      setErrors(err.errors || { form: [err.message] });
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="w-full text-center">
        <h1 className="text-2xl font-bold text-navy sm:text-3xl">Check your email</h1>
        <p className="mt-4 text-sm text-gray-600">
          We sent a verification link to <strong>{form.email}</strong>.
          Please check your inbox and verify your account to log in.
        </p>
        <Link
          to="/login"
          className="mt-6 inline-block w-full rounded-lg bg-primary py-3 text-sm font-semibold text-white transition hover:bg-primary-hover"
        >
          Go to Login
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-bold text-navy sm:text-3xl">Create your account</h1>
        <p className="mt-2 text-sm text-muted">Join TrabahoNow in under a minute</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {first("form") && (
          <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-danger">
            {first("form")}
          </div>
        )}

        <Field label="Full name" name="name" value={form.name} onChange={update} error={first("name")} required />
        <Field label="Email" name="email" type="email" value={form.email} onChange={update} error={first("email")} required />
        <Field label="Password (min 8 characters)" name="password" type="password" value={form.password} onChange={update} error={first("password")} required />
        <Field label="Confirm password" name="password_confirmation" type="password" value={form.password_confirmation} onChange={update} error={first("password_confirmation")} required />

        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-lg bg-primary py-3 text-sm font-semibold text-white transition hover:bg-primary-hover disabled:opacity-60"
        >
          {submitting ? "Creating account..." : "Create account"}
        </button>
      </form>

      <div className="my-6 flex items-center before:mt-0.5 before:flex-1 before:border-t before:border-gray-300 after:mt-0.5 after:flex-1 after:border-t after:border-gray-300">
        <span className="mx-4 text-sm text-gray-500">Or continue with</span>
      </div>

      <div className="w-full [&>div]:w-full">
        <GoogleLogin
          onSuccess={handleGoogleSuccess}
          onError={() => setErrors({ form: ['Google Sign Up failed'] })}
          theme="outline"
          size="large"
          width={480}
        />
      </div>

      <p className="mt-6 text-center text-sm text-muted">
        Already have an account?{" "}
        <Link to="/login" state={{ from }} className="font-semibold text-primary hover:underline">
          Log in
        </Link>
      </p>
    </div>
  );
}