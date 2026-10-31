import { useEffect, useRef, useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { sendOtp, verifyOtp, logoutUser } from "../../api/auth";

const CODE_LENGTH = 6;

function OtpInput({ value, onChange, disabled, length = CODE_LENGTH }) {
  const refs = useRef([]);
  const digits = Array.from({ length }, (_, i) => value[i] || "");

  const focusBox = (i) => {
    const el = refs.current[Math.max(0, Math.min(i, length - 1))];
    el?.focus();
    el?.select();
  };

  const handleChange = (i, e) => {
    const typed = e.target.value.replace(/\D/g, "");
    if (!typed) return;

    // Multiple characters (autofill / fast typing): fill from this box onward
    if (typed.length > 1) {
      const next = (value.slice(0, i) + typed).slice(0, length);
      onChange(next);
      focusBox(next.length);
      return;
    }

    // Only allow typing at the next empty slot or overwriting an existing one
    const pos = Math.min(i, value.length);
    const next = value.slice(0, pos) + typed + value.slice(pos + 1);
    onChange(next.slice(0, length));
    focusBox(pos + 1);
  };

  const handleKeyDown = (i, e) => {
    if (e.key === "Backspace") {
      e.preventDefault();
      if (digits[i]) {
        onChange(value.slice(0, i) + value.slice(i + 1));
      } else if (i > 0) {
        onChange(value.slice(0, i - 1) + value.slice(i));
        focusBox(i - 1);
      }
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      focusBox(i - 1);
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      focusBox(i + 1);
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, length);
    if (!pasted) return;
    onChange(pasted);
    focusBox(pasted.length);
  };

  return (
    <div className="flex justify-center gap-3">
      {digits.map((digit, i) => (
        <input
          key={i}
          ref={(el) => (refs.current[i] = el)}
          type="text"
          inputMode="numeric"
          autoComplete={i === 0 ? "one-time-code" : "off"}
          maxLength={length}
          value={digit}
          disabled={disabled}
          onChange={(e) => handleChange(i, e)}
          onKeyDown={(e) => handleKeyDown(i, e)}
          onPaste={handlePaste}
          onFocus={(e) => e.target.select()}
          aria-label={`Digit ${i + 1}`}
          className="h-14 w-11 rounded-xl border border-gray-200 bg-white text-center text-2xl font-semibold text-navy transition focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30 disabled:opacity-60 sm:w-12"
        />
      ))}
    </div>
  );
}

export default function VerifyEmail() {
  const { user, loading, logout } = useAuth();
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [cooldown, setCooldown] = useState(0);
  const [busy, setBusy] = useState(false); // verifying the code
  const [resending, setResending] = useState(false); // sending / resending the code

  // Set to true once the OTP is accepted, so the redirect to /login
  // carries the "verified" flag for the success message.
  const justVerified = useRef(false);
  const autoSent = useRef(false);

  const handleSendCode = async () => {
    setError("");
    setCode("");
    setResending(true);
    try {
      await sendOtp();
      setCooldown(60);
    } catch (err) {
      setError(err.message || "Failed to send code.");
    } finally {
      setResending(false);
    }
  };

  // ALL hooks first
  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [cooldown]);

  // Send the code once automatically when the page opens
  useEffect(() => {
    if (loading || !user || user.email_verified_at || autoSent.current) return;
    autoSent.current = true;
    handleSendCode();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading, user]);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (code.length !== CODE_LENGTH) return;

    setBusy(true);
    setError("");
    try {
      await verifyOtp(code);

      // Revoke the token on the server (ignore failures)
      try {
        await logoutUser();
      } catch {}

      // Clear local auth state -> triggers the <Navigate to="/login"> above
      justVerified.current = true;
      logout();
    } catch (err) {
      // The server's message is terse ("Invalid or expired code."), so show
      // a friendlier one that tells the person what to do next.
      setError(
        "That code didn't work. It may be incorrect or expired. Check the code and try again, or tap \"Click to resend\" to get a new one."
      );
      setCode("");
      setBusy(false);
    }
  };

  return (
    <div className="w-full text-center">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-navy sm:text-3xl">Verify email</h1>
        <p className="mt-2 text-sm text-muted">
          We sent a verification code to{" "}
          <span className="font-semibold text-navy">{email}</span>. Enter the
          code below to verify your email and complete your registration.
        </p>
      </div>

      {error && (
        <div className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-danger">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <OtpInput value={code} onChange={setCode} disabled={busy} />

        <button
          type="submit"
          disabled={busy || resending || code.length !== CODE_LENGTH}
          className="w-full rounded-lg bg-primary py-3 text-sm font-semibold text-white transition hover:bg-primary-hover disabled:opacity-60"
        >
          {busy ? "Verifying..." : "Continue"}
        </button>

        <p className="pt-2 text-sm text-navy">
          Didn't receive the email?{" "}
          <button
            type="button"
            disabled={cooldown > 0 || busy || resending}
            onClick={handleSendCode}
            className="font-medium text-primary hover:underline disabled:text-gray-400 disabled:no-underline"
          >
            {resending
              ? "Sending..."
              : cooldown > 0
              ? `Resend in ${cooldown}s`
              : "Click to resend"}
          </button>
        </p>
      </form>
    </div>
  );
}