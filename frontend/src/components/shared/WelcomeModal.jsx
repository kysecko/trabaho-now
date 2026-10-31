import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const keyFor = (user) => `welcome_seen_${user.id}`;

const wasSeen = (user) => {
  try { return localStorage.getItem(keyFor(user)) === "1"; } catch { return false; }
};

const markSeen = (user) => {
  try { localStorage.setItem(keyFor(user), "1"); } catch { /* ignore */ }
};

export default function WelcomeModal() {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);

  // 👇 CHANGED: We only check if they are a client and haven't seen it yet.
  const eligible = user?.role === "client";

  useEffect(() => {
    if (eligible && !wasSeen(user)) {
      setOpen(true);
    }
  }, [eligible, user]);

  const close = () => {
    if (user) markSeen(user);
    setOpen(false);
  };

  // Escape closes it
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && close();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={close}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="welcome-title"
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-2xl rounded-2xl bg-white p-6 shadow-xl sm:p-8"
      >
        <h2 id="welcome-title" className="text-2xl font-bold text-navy">
          Welcome to TrabahoNow
        </h2>
        <p className="mt-1 text-sm text-muted">
          How would you like to use your account? You can change your mind anytime.
        </p>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <div className="flex flex-col rounded-xl border border-gray-200 p-5">
            <h3 className="font-semibold text-navy">Looking for help?</h3>
            <p className="mt-1 flex-1 text-sm text-muted">
              Browse jobseekers for free. You'll verify your ID only when you're ready to hire.
            </p>
            <Link
              to="/client/search"
              onClick={close}
              className="mt-4 rounded-lg bg-primary py-2.5 text-center text-sm font-semibold text-white transition hover:bg-primary-hover"
            >
              Browse jobseekers
            </Link>
          </div>

          <div className="flex flex-col rounded-xl border border-gray-200 p-5">
            <h3 className="font-semibold text-navy">Want to offer a service?</h3>
            <p className="mt-1 flex-1 text-sm text-muted">
              Verify your ID to become a jobseeker and start receiving booking requests.
            </p>
            <Link
              to="/dashboard/verify?as=jobseeker"
              onClick={close}
              className="mt-4 rounded-lg border border-primary py-2.5 text-center text-sm font-semibold text-primary transition hover:bg-orange-50"
            >
              Become a jobseeker
            </Link>
          </div>
        </div>

        <button
          onClick={close}
          className="mt-5 w-full text-center text-sm text-muted hover:underline"
        >
          Skip for now 
        </button>
      </div>
    </div>
  );
}