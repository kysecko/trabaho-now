import { useEffect, useState } from "react";
import { useNavigate, useLocation, Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function VerifyEmail() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  // Get the data passed from the Register page
  const { email, tempToken } = location.state || {};

  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const [busy, setBusy] = useState(false);

  // If someone tries to go to /verify directly without signing up, kick them out
  if (!tempToken || !email) {
    return <Navigate to="/register" replace />;
  }

  // Handle resend cooldown timer
  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setTimeout(() => setCooldown(cooldown - 1), 1000);
    return () => clearTimeout(timer);
  }, [cooldown]);

  // Helper to make API calls using the TEMPORARY token
  const fetchWithToken = async (endpoint, method = "POST", body = null) => {
    const options = {
      method,
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
        "Authorization": `Bearer ${tempToken}`,
      },
    };
    if (body) options.body = JSON.stringify(body);

    // Using your actual API URL from .env
    const res = await fetch(`${import.meta.env.VITE_API_URL}${endpoint}`, options);
    const data = await res.json();

    if (!res.ok) throw new Error(data.message || "Request failed");
    return data;
  };

  const handleSendCode = async () => {
    setError("");
    setBusy(true);
    try {
      await fetchWithToken("/email/otp");
      setSent(true);
      setCooldown(60);
    } catch (err) {
      setError(err.message || "Failed to send code.");
    } finally {
      setBusy(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (code.length !== 6) return;

    setBusy(true);
    setError("");
    try {
      await fetchWithToken("/email/otp/verify", "POST", { code });
      navigate("/login", { replace: true, state: { verified: true } });
    } catch (err) {
      setError(err.message || "Invalid code.");
      setCode("");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="w-full text-center">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-navy sm:text-3xl">Verify your email</h1>
        <p className="mt-2 text-sm text-muted">
          We'll send a 6-digit code to <span className="font-semibold">{email}</span>.
        </p>
      </div>

      {error && (
        <div className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-danger">
          {error}
        </div>
      )}

      {!sent ? (
        <button
          onClick={handleSendCode}
          disabled={busy}
          className="w-full rounded-lg bg-primary py-3 text-sm font-semibold text-white transition hover:bg-primary-hover disabled:opacity-60"
        >
          {busy ? "Sending..." : "Send verification code"}
        </button>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5">
          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
            inputMode="numeric"
            autoComplete="one-time-code"
            placeholder="000000"
            className="w-full rounded-lg border border-gray-300 px-4 py-3 text-center text-2xl tracking-[0.5em] focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />

          <button
            type="submit"
            disabled={busy || code.length !== 6}
            className="w-full rounded-lg bg-primary py-3 text-sm font-semibold text-white transition hover:bg-primary-hover disabled:opacity-60"
          >
            {busy ? "Verifying..." : "Verify & Continue"}
          </button>

          <div className="text-sm">
            <button
              type="button"
              disabled={cooldown > 0 || busy}
              onClick={handleSendCode}
              className="font-semibold text-primary hover:underline disabled:text-gray-400 disabled:no-underline"
            >
              {cooldown > 0 ? `Resend code in ${cooldown}s` : "Resend code"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}