import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  InboxIcon,
  MapPinIcon,
  ClockIcon,
  CalendarDaysIcon,
  CheckCircleIcon,
  XCircleIcon,
  ExclamationTriangleIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { useAuth } from "../../context/AuthContext";

const daysFromNow = (n) => {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() + n);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
};

const DEMO_REQUESTS = [
  { id: 1, client: "Maria Santos", job: "Fix leaking roof", date: daysFromNow(1), time: "8:00 AM", location: "Brgy. Muzon", severity: "emergency", budget: 2500, message: "Water is dripping into the living room. Please hurry.", receivedMinsAgo: 25, conflict: null },
  { id: 2, client: "Pedro Reyes", job: "Install ceiling fan", date: daysFromNow(3), time: "1:00 PM", location: "Brgy. Citrus", severity: "scheduled", budget: 800, message: "No rush, anytime in the afternoon is fine.", receivedMinsAgo: 180, conflict: "You already have jobs on this day. Accepting may overlap." },
  { id: 3, client: "Ana Lim", job: "Aircon cleaning (2 units)", date: daysFromNow(6), time: "10:00 AM", location: "Brgy. Graceville", severity: "scheduled", budget: 1600, message: "", receivedMinsAgo: 1500, conflict: null },
];

const DECLINE_REASONS = [
  "Not available that day",
  "Outside my service area",
  "Not a job I do",
  "Budget is too low",
  "Other",
];

const TABS = [
  { key: "pending", label: "Pending" },
  { key: "accepted", label: "Accepted" },
  { key: "declined", label: "Declined" },
];

const SORTS = [
  { key: "urgent", label: "Urgent first" },
  { key: "soonest", label: "Soonest date" },
  { key: "budget", label: "Highest budget" },
];

const SEVERITY = {
  emergency: { label: "Emergency", badge: "bg-red-100 text-red-700" },
  scheduled: { label: "Scheduled", badge: "bg-blue-100 text-blue-700" },
};

const fromKey = (key) => {
  const [y, m, d] = key.split("-").map(Number);
  return new Date(y, m - 1, d);
};
const fmtDate = (key) =>
  fromKey(key).toLocaleDateString("en-PH", { weekday: "short", month: "short", day: "numeric" });
const peso = (n) => `₱${Number(n).toLocaleString("en-PH")}`;
const timeAgo = (mins) => {
  if (mins < 60) return `${Math.max(1, mins)} min ago`;
  if (mins < 1440) return `${Math.floor(mins / 60)} hr ago`;
  const d = Math.floor(mins / 1440);
  return `${d} day${d === 1 ? "" : "s"} ago`;
};
const initials = (name = "") =>
  name.trim().split(/\s+/).slice(0, 2).map((p) => p[0]).join("").toUpperCase() || "?";

const SORT_FNS = {
  urgent: (a, b) =>
    (a.severity === "emergency" ? 0 : 1) - (b.severity === "emergency" ? 0 : 1) || a.date.localeCompare(b.date),
  soonest: (a, b) => a.date.localeCompare(b.date),
  budget: (a, b) => b.budget - a.budget,
};

function DeclineModal({ request, onClose, onConfirm }) {
  const [reason, setReason] = useState("");
  const ref = useRef(null);

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    ref.current?.focus();
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div
        ref={ref}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-labelledby="decline-title"
        className="relative w-full max-w-md rounded-t-2xl bg-white p-6 shadow-2xl outline-none sm:rounded-2xl"
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute right-4 top-4 rounded-full p-1 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600"
        >
          <XMarkIcon className="h-5 w-5" />
        </button>

        <h2 id="decline-title" className="text-xl font-bold text-navy">Decline this request?</h2>
        <p className="mt-1 text-sm text-muted">
          {request.client} will be told you can’t take “{request.job}”. A reason helps them find someone else faster.
        </p>

        <div className="mt-4 flex flex-wrap gap-2" role="group" aria-label="Reason for declining">
          {DECLINE_REASONS.map((r) => (
            <button
              key={r}
              type="button"
              aria-pressed={reason === r}
              onClick={() => setReason(reason === r ? "" : r)}
              className={`rounded-full border px-3 py-1.5 text-sm font-medium transition ${
                reason === r
                  ? "border-primary bg-primary-soft text-primary"
                  : "border-gray-300 bg-white text-gray-700 hover:border-gray-400"
              }`}
            >
              {r}
            </button>
          ))}
        </div>

        <div className="mt-6 flex gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 rounded-xl border border-gray-300 bg-white py-2.5 text-sm font-bold text-gray-700 transition hover:bg-gray-50"
          >
            Keep request
          </button>
          <button
            type="button"
            onClick={() => onConfirm(request, reason)}
            className="flex-1 rounded-xl bg-red-600 py-2.5 text-sm font-bold text-white transition hover:bg-red-700"
          >
            Decline request
          </button>
        </div>
      </div>
    </div>
  );
}

function RequestCard({ request: r, onAccept, onDecline }) {
  const sev = SEVERITY[r.severity] ?? SEVERITY.scheduled;
  const pending = r.status === "pending";

  return (
    <article
      className={`rounded-2xl border border-gray-200 bg-white p-5 shadow-sm ${
        pending && r.severity === "emergency" ? "border-l-4 border-l-red-500" : ""
      }`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary-soft font-bold text-primary">
            {initials(r.client)}
          </div>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="truncate font-bold text-navy">{r.client}</h3>
              <span className={`rounded px-2 py-0.5 text-[11px] font-bold ${sev.badge}`}>{sev.label}</span>
            </div>
            <p className="text-xs text-muted">Received {timeAgo(r.receivedMinsAgo)}</p>
          </div>
        </div>
        <div className="shrink-0 text-right">
          <p className="text-lg font-extrabold text-navy">{peso(r.budget)}</p>
          <p className="text-xs text-muted">Client’s budget</p>
        </div>
      </div>

      <p className="mt-4 font-semibold text-primary">{r.job}</p>

      <div className="mt-2 flex flex-wrap gap-x-5 gap-y-1.5 text-sm text-gray-600">
        <span className="inline-flex items-center gap-1.5"><CalendarDaysIcon className="h-4 w-4 text-muted" /> {fmtDate(r.date)}</span>
        <span className="inline-flex items-center gap-1.5"><ClockIcon className="h-4 w-4 text-muted" /> {r.time}</span>
        <span className="inline-flex items-center gap-1.5"><MapPinIcon className="h-4 w-4 text-muted" /> {r.location}</span>
      </div>

      <div className="mt-4 rounded-xl border border-gray-100 bg-gray-50 p-3 text-sm">
        {r.message ? (
          <p className="italic text-gray-700">“{r.message}”</p>
        ) : (
          <p className="text-muted">The client didn’t leave a message.</p>
        )}
      </div>

      {pending && r.conflict && (
        <div className="mt-3 flex items-start gap-2 rounded-xl bg-amber-50 p-3 text-sm text-amber-800">
          <ExclamationTriangleIcon className="mt-0.5 h-4 w-4 shrink-0" />
          <p>{r.conflict}</p>
        </div>
      )}

      {pending ? (
        <div className="mt-5 grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => onDecline(r)}
            className="flex items-center justify-center gap-2 rounded-xl border border-red-200 bg-white py-2.5 text-sm font-bold text-red-600 transition hover:bg-red-50"
          >
            <XCircleIcon className="h-5 w-5" /> Decline
          </button>
          <button
            type="button"
            onClick={() => onAccept(r)}
            className="flex items-center justify-center gap-2 rounded-xl bg-green-600 py-2.5 text-sm font-bold text-white transition hover:bg-green-700"
          >
            <CheckCircleIcon className="h-5 w-5" /> Accept job
          </button>
        </div>
      ) : r.status === "accepted" ? (
        <p className="mt-5 flex items-center gap-2 text-sm font-semibold text-green-700">
          <CheckCircleIcon className="h-5 w-5" /> Accepted · added to your calendar
        </p>
      ) : (
        <p className="mt-5 flex items-center gap-2 text-sm font-semibold text-gray-500">
          <XCircleIcon className="h-5 w-5" /> Declined{r.reason ? ` · ${r.reason}` : ""}
        </p>
      )}
    </article>
  );
}

export default function BookingRequests({ initialRequests = null, onAccept, onDecline }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const isVerified = user?.is_verified === true || user?.verification_status === "approved";

  const [requests, setRequests] = useState(() =>
    (initialRequests ?? DEMO_REQUESTS).map((r) => ({ status: "pending", reason: "", ...r }))
  );
  const [tab, setTab] = useState("pending");
  const [sort, setSort] = useState("urgent");
  const [declining, setDeclining] = useState(null);
  const [toast, setToast] = useState(null); // { msg, undoId }
  const toastTimer = useRef(null);

  useEffect(() => () => clearTimeout(toastTimer.current), []);

  const counts = useMemo(
    () => ({
      pending: requests.filter((r) => r.status === "pending").length,
      accepted: requests.filter((r) => r.status === "accepted").length,
      declined: requests.filter((r) => r.status === "declined").length,
    }),
    [requests]
  );

  const visible = useMemo(
    () => requests.filter((r) => r.status === tab).sort(SORT_FNS[sort]),
    [requests, tab, sort]
  );

  if (!isVerified) {
    return (
      <div className="mx-auto flex min-h-[60vh] max-w-md flex-col items-center justify-center p-6 text-center">
        <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-gray-100">
          <InboxIcon className="h-10 w-10 text-gray-400" />
        </div>
        <h2 className="mb-2 text-xl font-bold text-navy">Requests are locked</h2>
        <p className="mb-6 text-sm text-muted">
          Verify your identity to receive and accept booking requests from clients.
        </p>
        <button
          type="button"
          onClick={() => navigate("/verify")}
          className="rounded-xl bg-primary px-6 py-2.5 text-sm font-bold text-white transition hover:bg-primary-hover"
        >
          Verify now
        </button>
      </div>
    );
  }

  const showToast = (msg, undoId = null) => {
    setToast({ msg, undoId });
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 6000);
  };
  const setStatus = (id, status, reason = "") =>
    setRequests((rs) => rs.map((r) => (r.id === id ? { ...r, status, reason } : r)));

  const accept = (r) => {
    setStatus(r.id, "accepted");
    onAccept?.(r);
    showToast(`Accepted ${r.client}’s request. It’s on your calendar.`, r.id);
  };
  const confirmDecline = (r, reason) => {
    setStatus(r.id, "declined", reason);
    onDecline?.(r, reason);
    setDeclining(null);
    showToast("Request declined.", r.id);
  };
  const undo = () => {
    if (toast?.undoId != null) setStatus(toast.undoId, "pending");
    setToast(null);
  };

  const empty = {
    pending: ["You’re all caught up", "New requests from clients will show up here."],
    accepted: ["No accepted jobs yet", "Jobs you accept will be listed here."],
    declined: ["No declined requests", "Requests you decline will be listed here."],
  }[tab];

  return (
    <div className="space-y-6 ">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-navy">Booking Requests</h1>
          <p className="mt-1 text-sm text-muted">Review job requests from clients and respond.</p>
        </div>
        <div>
          <label htmlFor="req-sort" className="mb-1 block text-xs font-semibold text-muted">Sort by</label>
          <select
            id="req-sort"
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 focus-visible:outline-2 focus-visible:outline-primary"
          >
            {SORTS.map((s) => (
              <option key={s.key} value={s.key}>{s.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Status tabs */}
      <div role="tablist" aria-label="Request status" className="flex gap-1 border-b border-gray-200">
        {TABS.map((t) => (
          <button
            key={t.key}
            type="button"
            role="tab"
            aria-selected={tab === t.key}
            onClick={() => setTab(t.key)}
            className={`-mb-px flex items-center gap-2 border-b-2 px-4 py-2.5 text-sm font-bold transition ${
              tab === t.key ? "border-primary text-primary" : "border-transparent text-muted hover:text-navy"
            }`}
          >
            {t.label}
            <span
              className={`rounded-full px-2 py-0.5 text-xs ${
                t.key === "pending" && counts.pending > 0 ? "bg-primary text-white" : "bg-gray-100 text-gray-600"
              }`}
            >
              {counts[t.key]}
            </span>
          </button>
        ))}
      </div>

      {visible.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-10 text-center">
          <InboxIcon className="mx-auto h-12 w-12 text-gray-300" />
          <p className="mt-3 font-bold text-navy">{empty[0]}</p>
          <p className="mt-1 text-sm text-muted">{empty[1]}</p>
        </div>
      ) : (
        <div className="space-y-4">
          {visible.map((r) => (
            <RequestCard key={r.id} request={r} onAccept={accept} onDecline={setDeclining} />
          ))}
        </div>
      )}

      {declining && (
        <DeclineModal request={declining} onClose={() => setDeclining(null)} onConfirm={confirmDecline} />
      )}

      {toast && (
        <div
          role="status"
          className="fixed bottom-6 left-1/2 z-50 flex max-w-[92vw] -translate-x-1/2 items-center gap-4 rounded-xl bg-navy px-4 py-3 text-sm font-semibold text-white shadow-lg"
        >
          <span>{toast.msg}</span>
          {toast.undoId != null && (
            <button type="button" onClick={undo} className="shrink-0 font-bold text-orange-300 hover:text-orange-200">
              Undo
            </button>
          )}
        </div>
      )}
    </div>
  );
} 