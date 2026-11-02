import { useState } from "react";
import { Link } from "react-router-dom";
import {
  CheckCircleIcon,
  ClockIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";
import { useAuth } from "../../context/AuthContext";

function Card({ title, description, children }) {
  return (
    <section className="rounded-2xl border border-gray-200 bg-white p-5 sm:p-6">
      <h2 className="text-base font-bold text-navy">{title}</h2>
      {description && <p className="mt-1 text-sm text-muted">{description}</p>}
      <div className="mt-5">{children}</div>
    </section>
  );
}

function Input({ label, error, ...props }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-semibold text-gray-600">{label}</label>
      <input
        {...props}
        className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-800 outline-none transition focus:border-[#ff4d00] focus:ring-2 focus:ring-[#ff4d00]/20"
      />
      {error && <span className="text-xs text-red-600">{error}</span>}
    </div>
  );
}

function Toggle({ checked, onChange, label, description, disabled }) {
  return (
    <div className={`flex items-center justify-between gap-4 py-3 ${disabled ? "opacity-60 cursor-not-allowed" : ""}`}>
      <div className="min-w-0">
        <p className="text-sm font-medium text-gray-800">{label}</p>
        {description && <p className="text-xs text-gray-500">{description}</p>}
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={label}
        disabled={disabled}
        onClick={() => !disabled && onChange(!checked)}
        className={`relative h-6 w-11 shrink-0 rounded-full transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ff4d00] ${
          checked ? "bg-[#ff4d00]" : "bg-gray-300"
        } ${disabled ? "cursor-not-allowed" : "cursor-pointer"}`}
      >
        <span
          className={`absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${
            checked ? "translate-x-5" : ""
          }`}
        />
      </button>
    </div>
  );
}

const PrimaryBtn = ({ children, ...props }) => (
  <button
    type="submit"
    {...props}
    className="cursor-pointer rounded-lg bg-[#ff4d00] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#e64500]"
  >
    {children}
  </button>
);

export default function ClientSettings() {
  const { user } = useAuth();

  const [account, setAccount] = useState({
    name: user?.name ?? "",
    email: user?.email ?? "",
    mobile: user?.phone ?? "",
  });
  const [accountSaved, setAccountSaved] = useState(false);

  const [pw, setPw] = useState({ current: "", next: "", confirm: "" });
  const [pwErrors, setPwErrors] = useState({});
  const [pwSaved, setPwSaved] = useState(false);

  const [prefs, setPrefs] = useState({
    bookings: true,
    payments: true,
    reviews: false,
    email: true,
    sms: false,
  });
  const setPref = (k) => (v) => setPrefs((p) => ({ ...p, [k]: v }));

  const [confirmDelete, setConfirmDelete] = useState(false);

  const isVerified = user?.is_verified === true || user?.verification_status === "approved";
  const isPending = user?.verification_status === "pending";

  const saveAccount = (e) => {
    e.preventDefault();
    setAccountSaved(true);
    setTimeout(() => setAccountSaved(false), 2500);
  };

  const savePassword = (e) => {
    e.preventDefault();
    const errs = {};
    if (!pw.current) errs.current = "Enter your current password";
    if (pw.next.length < 8) errs.next = "Use at least 8 characters";
    if (pw.next !== pw.confirm) errs.confirm = "Passwords don’t match";
    setPwErrors(errs);
    if (Object.keys(errs).length) return;
    setPw({ current: "", next: "", confirm: "" });
    setPwSaved(true);
    setTimeout(() => setPwSaved(false), 2500);
  };

  return (
    <main className="w-full space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-navy">Settings</h1>
        <p className="mt-1 text-sm text-muted">
          Manage your account, security and how we contact you.
        </p>
      </div>

      <Card title="Identity verification">
        {isVerified ? (
          <div className="flex items-start gap-3 rounded-xl bg-green-50 p-4">
            <CheckCircleIcon className="h-6 w-6 shrink-0 text-green-600" />
            <div>
              <p className="text-sm font-bold text-green-800">You’re verified</p>
              <p className="text-sm text-green-700">You can hire workers and send requests.</p>
            </div>
          </div>
        ) : isPending ? (
          <div className="flex items-start gap-3 rounded-xl bg-yellow-50 p-4">
            <ClockIcon className="h-6 w-6 shrink-0 text-yellow-600" />
            <div>
              <p className="text-sm font-bold text-yellow-800">Under review</p>
              <p className="text-sm text-yellow-700">We’ll notify you within 24–48 hours.</p>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-4 rounded-xl bg-orange-50 p-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-3">
              <ExclamationTriangleIcon className="h-6 w-6 shrink-0 text-orange-600" />
              <div>
                <p className="text-sm font-bold text-orange-800">Not verified yet</p>
                <p className="text-sm text-orange-700">Verify your ID and Santa Maria address to start hiring.</p>
              </div>
            </div>
            <Link
              to="/verify"
              className="shrink-0 rounded-lg bg-orange-600 px-4 py-2 text-center text-sm font-semibold text-white transition hover:bg-orange-700"
            >
              Verify now
            </Link>
          </div>
        )}
      </Card>

      <div className="grid grid-cols-1 items-start gap-5 xl:grid-cols-2">
        <Card title="Account details" description="This is what workers see when you send a request.">
          <form onSubmit={saveAccount} className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Input
                label="Full name"
                value={account.name}
                onChange={(e) => setAccount({ ...account, name: e.target.value })}
              />
              <Input
                label="Mobile number"
                placeholder="09XX XXX XXXX"
                value={account.mobile}
                onChange={(e) => setAccount({ ...account, mobile: e.target.value })}
              />
              <div className="sm:col-span-2">
                <Input
                  label="Email address"
                  type="email"
                  value={account.email}
                  onChange={(e) => setAccount({ ...account, email: e.target.value })}
                />
              </div>
            </div>
            <div className="flex items-center gap-3">
              <PrimaryBtn>Save changes</PrimaryBtn>
              {accountSaved && <span className="text-sm font-medium text-green-600">Saved</span>}
            </div>
          </form>
        </Card>

        <Card title="Password">
          <form onSubmit={savePassword} className="space-y-4">
            <Input
              label="Current password"
              type="password"
              autoComplete="current-password"
              value={pw.current}
              error={pwErrors.current}
              onChange={(e) => setPw({ ...pw, current: e.target.value })}
            />
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Input
                label="New password"
                type="password"
                autoComplete="new-password"
                value={pw.next}
                error={pwErrors.next}
                onChange={(e) => setPw({ ...pw, next: e.target.value })}
              />
              <Input
                label="Confirm new password"
                type="password"
                autoComplete="new-password"
                value={pw.confirm}
                error={pwErrors.confirm}
                onChange={(e) => setPw({ ...pw, confirm: e.target.value })}
              />
            </div>
            <div className="flex items-center gap-3">
              <PrimaryBtn>Update password</PrimaryBtn>
              {pwSaved && <span className="text-sm font-medium text-green-600">Password updated</span>}
            </div>
          </form>
        </Card>

        <Card title="Notification preferences" description="Choose what you hear about and where.">
          <div className="divide-y divide-gray-100">
            <Toggle label="Booking updates" description="Accepted, declined or rescheduled requests" checked={prefs.bookings} onChange={setPref("bookings")} disabled={!isVerified} />
            <Toggle label="Payments" description="Receipts and payment confirmations" checked={prefs.payments} onChange={setPref("payments")} disabled={!isVerified} />
            <Toggle label="Review reminders" description="A nudge to rate finished jobs" checked={prefs.reviews} onChange={setPref("reviews")} disabled={!isVerified} />
            
            <Toggle 
              label="Email" 
              description={!isVerified ? "Required for verification updates" : "Send notifications to your email"} 
              checked={!isVerified ? true : prefs.email} 
              onChange={setPref("email")} 
              disabled={!isVerified} 
            />
            <Toggle 
              label="SMS" 
              description={!isVerified ? "Required for verification updates" : "Send text messages to your mobile"} 
              checked={!isVerified ? true : prefs.sms} 
              onChange={setPref("sms")} 
              disabled={!isVerified} 
            />
          </div>
        </Card>

        <section className="rounded-2xl border border-red-200 bg-white p-5 sm:p-6">
          <h2 className="text-base font-bold text-red-700">Delete account</h2>
          <p className="mt-1 text-sm text-muted">
            This removes your profile and request history. You can’t undo it.
          </p>
          {confirmDelete ? (
            <div className="mt-4 flex flex-wrap items-center gap-3">
              <span className="text-sm text-gray-700">Are you sure?</span>
              <button
                type="button"
                onClick={() => setConfirmDelete(false)}
                className="cursor-pointer rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {}}
                className="cursor-pointer rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700"
              >
                Yes, delete my account
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setConfirmDelete(true)}
              className="mt-4 cursor-pointer rounded-lg border border-red-300 px-4 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-50"
            >
              Delete account
            </button>
          )}
        </section>
      </div>
    </main>
  );
}