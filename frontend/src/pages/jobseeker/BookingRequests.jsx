import { useEffect, useMemo, useRef, useState } from "react";
import {
  InboxIcon,
  MapPinIcon,
  ClockIcon,
  CalendarDaysIcon,
  CheckCircleIcon,
  XCircleIcon,
  ExclamationTriangleIcon,
  XMarkIcon,
  ChatBubbleLeftRightIcon,
} from "@heroicons/react/24/outline";
import { useVerificationStatus } from "../../hooks/useVerificationStatus";
import LockedState from "../../components/ui/dashboard/LockedState";
import CancelDialog from "../../components/ui/dashboard/CancelDialog";
import ChatPanel from "../../components/ui/dashboard/ChatPanel";
import bookings from "../../api/bookings";
import { useAuth } from "../../context/AuthContext";

/* ---------- Helpers ---------- */
const daysFromNow = (n) => {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() + n);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
};

const fromKey = (key) => {
  if (!key) return new Date();
  const [y, m, d] = key.split("-").map(Number);
  return new Date(y, m - 1, d);
};

const fmtDate = (key) =>
  fromKey(key).toLocaleDateString("en-PH", { weekday: "short", month: "short", day: "numeric" });

const peso = (n) => `₱${Number(n || 0).toLocaleString("en-PH")}`;

const timeAgo = (mins) => {
  if (!mins) return "just now";
  if (mins < 60) return `${Math.max(1, mins)} min ago`;
  if (mins < 1440) return `${Math.floor(mins / 60)} hr ago`;
  const d = Math.floor(mins / 1440);
  return `${d} day${d === 1 ? "" : "s"} ago`;
};

const initials = (name = "") =>
  name.trim().split(/\s+/).slice(0, 2).map((p) => p[0]).join("").toUpperCase() || "?";

/* ---------- Constants ---------- */
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
  { key: "cancelled", label: "Cancelled" },
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

const SORT_FNS = {
  urgent: (a, b) =>
    (a.severity === "emergency" ? 0 : 1) - (b.severity === "emergency" ? 0 : 1) || a.date.localeCompare(b.date),
  soonest: (a, b) => a.date.localeCompare(b.date),
  budget: (a, b) => b.budget - a.budget,
};

/* ---------- Modals ---------- */
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
        className="relative w-full max-w-md rounded-t-2xl bg-white p-6 shadow-2xl outline-none sm:rounded-2xl"
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full p-1 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600"
        >
          <XMarkIcon className="h-5 w-5" />
        </button>

        <h2 className="text-xl font-bold text-navy">Decline this request?</h2>
        <p className="mt-1 text-sm text-muted">
          {request.client} will be told you can't take "{request.job}". A reason helps them find someone else faster.
        </p>

        <div className="mt-4 flex flex-wrap gap-2" role="group">
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
            disabled={!reason}
            className="flex-1 rounded-xl bg-red-600 py-2.5 text-sm font-bold text-white transition hover:bg-red-700 disabled:opacity-50"
          >
            Decline request
          </button>
        </div>
      </div>
    </div>
  );
}

function RequestCard({ request: r, onAccept, onDecline, onCancel, onMessage }) {
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
              <span className={`rounded px-2 py-0.5 text-[11px] font-bold ${sev.badge}`}>
                {sev.label}
              </span>
            </div>
            <p className="text-xs text-muted">Received {timeAgo(r.receivedMinsAgo ?? 0)}</p>
          </div>
        </div>
        <div className="shrink-0 text-right">
          <p className="text-lg font-extrabold text-navy">{peso(r.budget)}</p>
          <p className="text-xs text-muted">Client's budget</p>
        </div>
      </div>

      <p className="mt-4 font-semibold text-primary">{r.job}</p>

      <div className="mt-2 flex flex-wrap gap-x-5 gap-y-1.5 text-sm text-gray-600">
        <span className="inline-flex items-center gap-1.5">
          <CalendarDaysIcon className="h-4 w-4 text-muted" /> {fmtDate(r.date)}
        </span>
        <span className="inline-flex items-center gap-1.5">
          <ClockIcon className="h-4 w-4 text-muted" /> {r.time}
        </span>
        <span className="inline-flex items-center gap-1.5">
          <MapPinIcon className="h-4 w-4 text-muted" /> {r.location}
        </span>
      </div>

      <div className="mt-4 rounded-xl border border-gray-100 bg-gray-50 p-3 text-sm">
        {r.message ? (
          <p className="italic text-gray-700">"{r.message}"</p>
        ) : (
          <p className="text-muted">The client didn't leave a message.</p>
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
        <div className="mt-5 flex flex-wrap items-center gap-2">
          <p className="mr-auto flex items-center gap-2 text-sm font-semibold text-green-700">
            <CheckCircleIcon className="h-5 w-5" /> Accepted · on your calendar
          </p>
          <button
            type="button"
            onClick={() => onMessage(r)}
            className="inline-flex items-center gap-1 rounded-xl border border-green-200 bg-white px-3 py-1.5 text-xs font-bold text-green-700 hover:bg-green-50"
          >
            <ChatBubbleLeftRightIcon className="h-4 w-4" /> Message
          </button>
          <button
            type="button"
            onClick={() => onCancel(r)}
            className="rounded-xl border border-red-200 bg-white px-3 py-1.5 text-xs font-bold text-red-600 hover:bg-red-50"
          >
            Cancel job
          </button>
        </div>
      ) : r.status === "cancelled" ? (
        <p className="mt-5 flex items-center gap-2 text-sm font-semibold text-red-700">
          <XCircleIcon className="h-5 w-5" /> Cancelled
          {r.cancel_reason ? ` · ${r.cancel_reason}` : ""}
        </p>
      ) : (
        <p className="mt-5 flex items-center gap-2 text-sm font-semibold text-gray-500">
          <XCircleIcon className="h-5 w-5" /> Declined{r.reason ? ` · ${r.reason}` : ""}
        </p>
      )}
    </article>
  );
}

/* ---------- Main Component ---------- */
export default function BookingRequests({ initialRequests = null }) {
  const { isVerified } = useVerificationStatus();
  const { user } = useAuth();

  const [requests, setRequests] = useState(
    () => initialRequests?.map((r) => ({ status: "pending", reason: "", ...r })) ?? []
  );
  const [loading, setLoading] = useState(!initialRequests);
  const [loadError, setLoadError] = useState(null);

  const [tab, setTab] = useState("pending");
  const [sort, setSort] = useState("urgent");
  
  const [declining, setDeclining] = useState(null);
  const [cancelling, setCancelling] = useState(null);
  const [cancelBusy, setCancelBusy] = useState(false);
  const [chatId, setChatId] = useState(null);

  const [toast, setToast] = useState(null);
  const toastTimer = useRef(null);

  useEffect(() => {
    if (initialRequests) return;
    let cancelled = false;
    bookings
      .list()
      .then((data) => {
        if (cancelled) return;
        const list = Array.isArray(data) ? data : data?.data ?? [];
        setRequests(
          list.map((r) => ({
            status: "pending",
            reason: "",
            client: r.client?.name ?? "Client",
            job: r.title ?? r.service?.title ?? "Service",
            date: r.scheduled_at?.slice(0, 10) ?? daysFromNow(0),
            time: r.scheduled_at
              ? new Date(r.scheduled_at).toLocaleTimeString("en-PH", { hour: "numeric", minute: "2-digit" })
              : "TBD",
            location: r.barangay ?? r.address ?? "",
            budget: r.agreed_rate ?? 0,
            message: r.description ?? "",
            receivedMinsAgo: 0,
            conflict: null,
            ...r,
          }))
        );
        setLoading(false);
      })
      .catch((e) => {
        if (cancelled) return;
        setLoadError(e.message || "Couldn't load requests");
        setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [initialRequests]);

  useEffect(() => () => clearTimeout(toastTimer.current), []);

  const counts = useMemo(
    () => ({
      pending: requests.filter((r) => r.status === "pending").length,
      accepted: requests.filter((r) => r.status === "accepted").length,
      declined: requests.filter((r) => r.status === "declined").length,
      cancelled: requests.filter((r) => r.status === "cancelled").length,
    }),
    [requests]
  );

  const visible = useMemo(
    () => requests.filter((r) => r.status === tab).sort(SORT_FNS[sort]),
    [requests, tab, sort]
  );

  if (!isVerified) {
    return (
      <LockedState
        icon={InboxIcon}
        title="Requests are locked"
        text="Verify your identity to receive and accept booking requests from clients."
      />
    );
  }

  const showToast = (msg) => {
    setToast(msg);
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 6000);
  };
  const setStatus = (id, status, extra = {}) =>
    setRequests((rs) => rs.map((r) => (r.id === id ? { ...r, status, ...extra } : r)));

  async function accept(r) {
    try {
      await bookings.accept(r.id);
      setStatus(r.id, "accepted");
      showToast(`Accepted ${r.client}'s request.`);
    } catch (e) {
      showToast(e.message || "Could not accept");
    }
  }

  async function confirmDecline(r, reason) {
    try {
      await bookings.decline(r.id, { reason });
      setStatus(r.id, "declined", { reason });
      setDeclining(null);
      showToast("Request declined.");
    } catch (e) {
      showToast(e.message || "Could not decline");
    }
  }

  async function confirmCancel({ reason, note }) {
    setCancelBusy(true);
    try {
      await bookings.cancel(cancelling.id, { reason, note });
      setStatus(cancelling.id, "cancelled", { cancel_reason: reason });
      setCancelling(null);
      showToast("Job cancelled.");
    } catch (e) {
      showToast(e.message || "Could not cancel");
    } finally {
      setCancelBusy(false);
    }
  }

  const empty = {
    pending: ["You're all caught up", "New requests from clients will show up here."],
    accepted: ["No accepted jobs yet", "Jobs you accept will be listed here."],
    declined: ["No declined requests", "Requests you decline will be listed here."],
    cancelled: ["No cancelled jobs", "Jobs you cancel will be listed here."],
  }[tab];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-navy">Booking Requests</h1>
          <p className="mt-1 text-sm text-muted">Review job requests from clients and respond.</p>
        </div>
        <div>
          <label htmlFor="req-sort" className="mb-1 block text-xs font-semibold text-muted">
            Sort by
          </label>
          <select
            id="req-sort"
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700"
          >
            {SORTS.map((s) => (
              <option key={s.key} value={s.key}>{s.label}</option>
            ))}
          </select>
        </div>
      </div>

      <div role="tablist" className="flex flex-wrap gap-1 border-b border-gray-200">
        {TABS.map((t) => (
          <button
            key={t.key}
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

      {loadError && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {loadError}
        </div>
      )}

      {loading ? (
        <div className="rounded-2xl border border-gray-200 bg-white p-10 text-center text-sm text-muted">
          Loading…
        </div>
      ) : visible.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-10 text-center">
          <InboxIcon className="mx-auto h-12 w-12 text-gray-300" />
          <p className="mt-3 font-bold text-navy">{empty[0]}</p>
          <p className="mt-1 text-sm text-muted">{empty[1]}</p>
        </div>
      ) : (
        <div className="space-y-4">
          {visible.map((r) => (
            <RequestCard
              key={r.id}
              request={r}
              onAccept={accept}
              onDecline={setDeclining}
              onCancel={setCancelling}
              onMessage={(row) => setChatId(row.id)}
            />
          ))}
        </div>
      )}

      {declining && (
        <DeclineModal request={declining} onClose={() => setDeclining(null)} onConfirm={confirmDecline} />
      )}

      <CancelDialog
        open={!!cancelling}
        role="jobseeker"
        busy={cancelBusy}
        onClose={() => setCancelling(null)}
        onConfirm={confirmCancel}
      />

      {chatId && (
        <ChatPanel requestId={chatId} currentUserId={user?.id} onClose={() => setChatId(null)} />
      )}

      {toast && (
        <div
          role="status"
          className="fixed bottom-6 left-1/2 z-50 flex max-w-[92vw] -translate-x-1/2 items-center gap-4 rounded-xl bg-navy px-4 py-3 text-sm font-semibold text-white shadow-lg"
        >
          <span>{toast}</span>
        </div>
      )}
    </div>
  );
}