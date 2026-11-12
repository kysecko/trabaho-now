import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  CalendarDaysIcon,
  SparklesIcon,
  MagnifyingGlassIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  ArrowRightIcon,
  ChatBubbleLeftRightIcon,
} from "@heroicons/react/24/outline";
import { useAuth } from "../../context/AuthContext";
import { useVerificationStatus } from "../../hooks/useVerificationStatus";
import LockedState from "../../components/ui/dashboard/LockedState";
import CancelDialog from "../../components/ui/dashboard/CancelDialog";
import ChatPanel from "../../components/ui/dashboard/ChatPanel";
import bookings from "../../api/bookings";

const STATUS_BADGE = {
  pending: "bg-yellow-100 text-yellow-700",
  accepted: "bg-green-100 text-green-700",
  completed: "bg-blue-100 text-blue-700",
  declined: "bg-gray-100 text-gray-700",
  cancelled: "bg-red-100 text-red-700",
};
const STATUS_LABEL = {
  pending: "Waiting for reply",
  accepted: "Accepted",
  completed: "Completed",
  declined: "Declined",
  cancelled: "Cancelled",
};

export default function RequestBookings() {
  const { user } = useAuth();
  const { isVerified } = useVerificationStatus();
  const navigate = useNavigate();

  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);
  const [tab, setTab] = useState("pending");
  const [cancelTarget, setCancelTarget] = useState(null);
  const [cancelling, setCancelling] = useState(false);
  const [chatId, setChatId] = useState(null);

  useEffect(() => {
    let cancelled = false;
    bookings
      .list()
      .then((data) => {
        if (!cancelled) {
          setRows(Array.isArray(data) ? data : data?.data ?? []);
          setLoading(false);
        }
      })
      .catch((e) => {
        if (!cancelled) {
          setLoadError(e.message || "Couldn't load bookings");
          setLoading(false);
        }
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const counts = useMemo(
    () => ({
      pending: rows.filter((r) => r.status === "pending").length,
      accepted: rows.filter((r) => r.status === "accepted").length,
      completed: rows.filter((r) => r.status === "completed").length,
      declined: rows.filter((r) => r.status === "declined").length,
      cancelled: rows.filter((r) => r.status === "cancelled").length,
    }),
    [rows]
  );
  const visible = useMemo(
    () => rows.filter((r) => r.status === tab),
    [rows, tab]
  );

  if (!isVerified) {
    return (
      <main className="w-full space-y-6 pb-10">
        <header>
          <h1 className="text-2xl font-bold text-gray-900">Request &amp; Bookings</h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage your service requests and bookings.
          </p>
        </header>
        <LockedState
          icon={CalendarDaysIcon}
          title="Bookings are locked"
          text="To ensure safety and trust, only verified users can request services. Please complete your Level 2 verification."
        />
      </main>
    );
  }

  async function confirmCancel({ reason, note }) {
    setCancelling(true);
    try {
      await bookings.cancel(cancelTarget, { reason, note });
      setRows((rs) =>
        rs.map((r) =>
          r.id === cancelTarget
            ? { ...r, status: "cancelled", cancel_reason: reason }
            : r
        )
      );
      setCancelTarget(null);
    } catch (e) {
      alert(e.message || "Cancel failed");
    } finally {
      setCancelling(false);
    }
  }

  return (
    <main className="w-full space-y-8 pb-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Request &amp; Booking</h1>
          <p className="text-sm text-gray-500 mt-1">
            Track your requests and manage your hired workers.
          </p>
        </div>
        <button
          onClick={() => navigate("/client/search")}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#ff4d00] px-5 py-2.5 text-sm font-bold text-white transition hover:bg-[#e64500] shadow-sm"
        >
          <MagnifyingGlassIcon className="w-5 h-5" />
          Find a Worker
        </button>
      </div>

      {/* Welcome banner — reworded to drop the stale "credits" promise */}
      <div className="relative overflow-hidden rounded-2xl bg-linear-to-r from-navy to-navy-2 p-6 sm:p-8 text-white shadow-xl">
        <div className="absolute -right-10 -top-10 h-48 w-48 rounded-full bg-white/5 blur-2xl" />
        <div className="absolute -left-10 -bottom-10 h-48 w-48 rounded-full bg-[#ff4d00]/10 blur-2xl" />
        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center gap-6">
          <div className="bg-white/10 p-4 rounded-full shrink-0 backdrop-blur-md">
            <SparklesIcon className="w-8 h-8 text-[#ff4d00]" />
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-extrabold mb-1">Ready to hire? 🎉</h2>
            <p className="text-gray-300 text-sm sm:text-base leading-relaxed max-w-2xl">
              Your identity is fully verified. Browse trusted workers in your
              area and send booking requests. Agree on the rate directly with
              the worker, then track progress here.
            </p>
            <button
              onClick={() => navigate("/client/search")}
              className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-white hover:text-[#ff4d00] transition-colors"
            >
              Browse Jobseekers <ArrowRightIcon className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Stats — now derived */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard icon={ClockIcon} color="blue" label="Active" value={counts.accepted} />
        <StatCard icon={CalendarDaysIcon} color="orange" label="Pending" value={counts.pending} />
        <StatCard icon={CheckCircleIcon} color="green" label="Completed" value={counts.completed} />
        <StatCard icon={XCircleIcon} color="gray" label="Cancelled" value={counts.cancelled} />
      </div>

      <div className="space-y-4">
        <div className="flex flex-wrap gap-2">
          {[
            ["pending", "Pending"],
            ["accepted", "Accepted"],
            ["completed", "Completed"],
            ["declined", "Declined"],
            ["cancelled", "Cancelled"],
          ].map(([key, label]) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className={`px-4 py-1.5 rounded-full text-sm font-bold border transition ${
                tab === key
                  ? "border-[#ff4d00] bg-[#ff4d00] text-white"
                  : "border-gray-300 bg-white text-gray-600 hover:border-gray-400"
              }`}
            >
              {label} ({counts[key]})
            </button>
          ))}
        </div>

        {loadError && (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {loadError}
          </div>
        )}

        {loading ? (
          <div className="rounded-2xl border border-gray-200 bg-white p-12 text-center text-sm text-gray-500">
            Loading bookings…
          </div>
        ) : visible.length === 0 ? (
          <div className="rounded-2xl border border-gray-200 bg-white shadow-sm p-12 text-center">
            <CalendarDaysIcon className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-gray-900">No {tab} bookings</h3>
            <p className="text-sm text-gray-500 mt-1">
              You don't have any {tab} requests right now.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {visible.map((b) => (
              <article
                key={b.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-[#FFF5F3] border border-dashed border-[#ffd8cc] rounded-xl gap-4"
              >
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <h3 className="font-bold text-gray-900 text-sm">{b.title}</h3>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded capitalize ${
                        STATUS_BADGE[b.status] ?? STATUS_BADGE.pending
                      }`}
                    >
                      {STATUS_LABEL[b.status] ?? b.status}
                    </span>
                  </div>
                  <p className="text-xs text-gray-600">
                    {b.jobseeker?.name ?? "Worker"} <span className="text-gray-400">|</span>{" "}
                    {b.service?.title ?? "Service"} <span className="text-gray-400">|</span>{" "}
                    {b.scheduled_at
                      ? new Date(b.scheduled_at).toLocaleString("en-PH", {
                          month: "short",
                          day: "numeric",
                          hour: "numeric",
                          minute: "2-digit",
                        })
                      : "TBD"}{" "}
                    <span className="text-gray-400">|</span>{" "}
                    {b.agreed_rate
                      ? `₱${Number(b.agreed_rate).toLocaleString("en-PH")}`
                      : "Rate TBD"}
                  </p>
                  {b.status === "cancelled" && b.cancel_reason && (
                    <p className="mt-1 text-xs text-red-600">
                      Reason: {b.cancel_reason}
                    </p>
                  )}
                </div>

                <div className="flex shrink-0 gap-2">
                  {(b.status === "pending" || b.status === "accepted") && (
                    <button
                      onClick={() => setCancelTarget(b.id)}
                      className="px-5 py-1.5 text-xs font-bold text-red-500 bg-transparent border border-red-200 rounded-lg hover:bg-red-50 transition-colors"
                    >
                      Cancel
                    </button>
                  )}
                  {["accepted", "in_progress", "completed"].includes(b.status) && (
                    <button
                      onClick={() => setChatId(b.id)}
                      className="inline-flex items-center gap-1 px-5 py-1.5 text-xs font-bold text-green-600 bg-transparent border border-green-200 rounded-lg hover:bg-green-50 transition-colors"
                    >
                      <ChatBubbleLeftRightIcon className="w-4 h-4" /> Message
                    </button>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}
      </div>

      <CancelDialog
        open={!!cancelTarget}
        role="client"
        busy={cancelling}
        onClose={() => setCancelTarget(null)}
        onConfirm={confirmCancel}
      />

      {chatId && (
        <ChatPanel
          requestId={chatId}
          currentUserId={user?.id}
          onClose={() => setChatId(null)}
        />
      )}
    </main>
  );
}

function StatCard({ icon: Icon, color, label, value }) {
  const tones = {
    blue: { bg: "bg-blue-50", text: "text-blue-600" },
    orange: { bg: "bg-orange-50", text: "text-[#ff4d00]" },
    green: { bg: "bg-green-50", text: "text-green-600" },
    gray: { bg: "bg-gray-100", text: "text-gray-600" },
  }[color];
  return (
    <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
      <div className="flex items-center gap-3 mb-2">
        <div className={`p-2 rounded-lg ${tones.bg}`}>
          <Icon className={`w-5 h-5 ${tones.text}`} />
        </div>
        <p className="text-sm font-semibold text-gray-500">{label}</p>
      </div>
      <p className="text-3xl font-extrabold text-gray-900">{value}</p>
    </div>
  );
}