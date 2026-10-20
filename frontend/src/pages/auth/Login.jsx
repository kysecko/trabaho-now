import { useState } from "react";
import { Link, Navigate, useLocation } from "react-router-dom";
import { loginUser, googleLogin } from "../../api/auth";
import { useAuth } from "../../context/AuthContext";
import Field from "../../components/ui/Field";
import { GoogleLogin } from "@react-oauth/google";
import { roleHome } from "../../lib/roleHome";

export default function Login() {
  const { user, login } = useAuth();
  const location = useLocation();
  const from = location.state?.from;

  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  // SMART REDIRECT LOGIC
  if (user) return <Navigate to={from || roleHome(user)} replace />;

  const first = (key) => errors[key]?.[0];
  const update = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setErrors({});
    try {
      const data = await loginUser(form);
      login(data.token, data.user);  console.log("Logged in user:", JSON.stringify(data.user, null, 2)); 
    } catch (err) {
      console.log("Login Error Details:", err);
      setErrors(err.errors || { form: [err.message] });
    } finally {
      setSubmitting(false);
    }
  };


  const handleGoogleSuccess = async (credentialResponse) => {
    setSubmitting(true);
    setErrors({});
    try {
      const data = await googleLogin(credentialResponse.credential, "client");
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
        <h1 className="text-2xl font-bold text-navy sm:text-3xl">Welcome back</h1>
        <p className="mt-2 text-sm text-muted">Log in to your TrabahoNow account</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {first("form") && (
          <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-danger">
            {first("form")}
          </div>
        )}

        <Field label="Email" name="email" type="email" value={form.email} onChange={update} error={first("email")} required />
        <Field label="Password" name="password" type="password" value={form.password} onChange={update} error={first("password")} required />

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

      <div className="my-6 flex items-center before:mt-0.5 before:flex-1 before:border-t before:border-gray-300 after:mt-0.5 after:flex-1 after:border-t after:border-gray-300">
        <span className="mx-4 text-sm text-gray-500">Or continue with</span>
      </div>

      <div className="w-full flex justify-center">
        <GoogleLogin
          onSuccess={handleGoogleSuccess}
          onError={() => setErrors({ form: ['Google Login failed'] })}
          theme="outline"
          size="large"
          width="100%"
        />
      </div>

      <p className="mt-6 text-center text-sm text-muted">
        No account yet?{" "}
        <Link to="/signup" state={{ from }} className="font-semibold text-primary hover:underline">
          Sign up
        </Link>
      </p>
    </div>
  );
}
