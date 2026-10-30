import { useEffect, useRef, useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { sendOtp, verifyOtp, logoutUser } from "../../api/auth";

export default function VerifyEmail() {
  const { user, loading, logout } = useAuth();
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const [busy, setBusy] = useState(false);

  // Set to true once the OTP is accepted, so the redirect to /login
  // carries the "verified" flag for the success message.
  const justVerified = useRef(false);

  // ALL hooks first
  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [cooldown]);

  // Early returns AFTER hooks
  if (loading) return null;

  // After a successful verify we log out locally, so user becomes null
  // and this sends them to /login (never to the dashboard).
  if (!user) {
    return (
      <Navigate
        to="/login"
        replace
        state={justVerified.current ? { verified: true } : undefined}
      />
    );
  }

  // Already verified (e.g. opened /verify manually) -> dashboard
  if (user.email_verified_at && !justVerified.current) {
    return <Navigate to={`/${user.role}`} replace />;
  }

  const email = user.email;

  const handleSendCode = async () => {
    setError("");
    setBusy(true);
    try {
      await sendOtp();
      setSent(true);
      setCooldown(60);
    } catch (err) {
      setSent(false);
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
      await verifyOtp(code);

      // Revoke the token on the server (ignore failures)
      try { await logoutUser(); } catch {}

      // Clear local auth state -> triggers the <Navigate to="/login"> above
      justVerified.current = true;
      logout();
    } catch (err) {
      setError(err.message || "Invalid code.");
      setCode("");
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