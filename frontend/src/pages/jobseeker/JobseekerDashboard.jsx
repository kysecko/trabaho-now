import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  BriefcaseIcon,
  ClockIcon,
  CalendarDaysIcon,
  CheckCircleIcon,
  PlusIcon,
  ChevronRightIcon,
  UserIcon,
  InboxIcon,
} from "@heroicons/react/24/outline";
import { useAuth } from "../../context/AuthContext";
import { useVerificationStatus } from "../../hooks/useVerificationStatus";
import Button from "../../components/ui/Button";
import LockedState from "../../components/ui/dashboard/LockedState";

// Adjust these to your real jobseeker routes
const ROUTES = {
  posts: "/jobseeker/posts",
  requests: "/jobseeker/requests",
  calendar: "/jobseeker/calendar",
  settings: "/jobseeker/settings",
};

const daysFromNow = (n) => {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() + n);
  return d;
};

/* Demo data. Pass real data through the props instead:
   <JobseekerDashboard requests={[...]} stats={{ activePosts, activeRequests, completed }} /> */
const DEMO_REQUESTS = [
  { id: 1, client: "Jericho Cordesa", service: "Plumbing Repair", date: daysFromNow(2), photo: null },
  { id: 2, client: "Michael Santos", service: "Aircon Cleaning", date: daysFromNow(5), photo: null },
  { id: 3, client: "Ana Lim", service: "Electrical Wiring", date: daysFromNow(8), photo: null },
];
const DEMO_STATS = { activePosts: 3, activeRequests: 2, completed: 14 };
const DEMO_UPCOMING = [
  { id: 1, title: "Aircon Cleaning", when: "Today, 2:00 PM", tone: "bg-blue-50 text-blue-600" },
  { id: 2, title: "Plumbing Repair", when: "Tomorrow, 9:00 AM", tone: "bg-green-50 text-green-600" },
];

const STAT_ITEMS = [
  { key: "activePosts", label: "Active Job Post", Icon: BriefcaseIcon },
  { key: "activeRequests", label: "Active Requests", Icon: ClockIcon },
  { key: "pending", label: "Pending Request", Icon: CalendarDaysIcon },
  { key: "completed", label: "Completed Requests", Icon: CheckCircleIcon },
];

const fmtDate = (value) =>
  new Date(value).toLocaleDateString("en-PH", { month: "short", day: "numeric", year: "numeric" });
const initials = (name = "") =>
  name.trim().split(/\s+/).slice(0, 2).map((p) => p[0]).join("").toUpperCase() || "?";

function Avatar({ name, photo }) {
  if (photo) {
    return <img src={photo} alt="" className="h-14 w-14 shrink-0 rounded-full object-cover" />;
  }
  return (
    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-primary-soft text-lg font-bold text-primary">
      {initials(name)}
    </div>
  );
}

function RequestRow({ request: r, confirming, onReview, onAskDecline, onCancelDecline, onConfirmDecline }) {
  return (
    <article className="flex flex-col gap-4 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:p-5">
      <div className="flex min-w-0 items-center gap-4">
        <Avatar name={r.client} photo={r.photo} />
        <div className="min-w-0">
          <h3 className="truncate text-lg font-bold text-navy">{r.service}</h3>
          <p className="text-xs text-muted">Client: {r.client}</p>
          <p className="text-xs text-muted">Requested for {fmtDate(r.date)}</p>
        </div>
      </div>

      {confirming ? (
        <div className="flex flex-wrap items-center gap-3 sm:justify-end">
          <span className="text-sm font-semibold text-gray-700">Decline this request?</span>
          <button
            type="button"
            onClick={onCancelDecline}
            className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
          >
            Keep
          </button>
          <button
            type="button"
            onClick={onConfirmDecline}
            className="rounded-lg bg-red-600 px-4 py-2 text-sm font-bold text-white transition hover:bg-red-700"
          >
            Yes, decline
          </button>
        </div>
      ) : (
        <div className="flex flex-wrap gap-3 sm:justify-end">
          <Button size="sm" onClick={onReview}>Review Request</Button>
          <button
            type="button"
            onClick={onAskDecline}
            className="rounded-lg border border-red-500 bg-white px-4 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-50"
          >
            Decline Request
          </button>
        </div>
      )}
    </article>
  );
}

export default function JobseekerDashboard({
  requests: initialRequests = null,
  stats: statsOverride = null,
  upcoming = DEMO_UPCOMING,
  profile = { percent: 80, done: 4, total: 5 },
  onDecline,
}) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { isVerified } = useVerificationStatus();

  const [requests, setRequests] = useState(() => initialRequests ?? DEMO_REQUESTS);
  const [confirmId, setConfirmId] = useState(null);
  const [toast, setToast] = useState("");
  const toastTimer = useRef(null);

  useEffect(() => () => clearTimeout(toastTimer.current), []);

  const stats = useMemo(
    () => ({ ...DEMO_STATS, ...statsOverride, pending: requests.length }),
    [statsOverride, requests.length]
  );

  if (!isVerified) {
    return (
      <LockedState
        icon={BriefcaseIcon}
        title="Account not verified"
        text="You must verify your identity before you can open the worker dashboard and start earning."
      />
    );
  }

  const firstName = user?.name?.split(" ")[0] || "there";

  const decline = (r) => {
    setRequests((list) => list.filter((x) => x.id !== r.id));
    setConfirmId(null);
    onDecline?.(r);
    setToast("Request declined.");
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(""), 2600);
  };

  return (
    <div className="space-y-6 pb-10">
      {/* Welcome banner */}
      <section className="relative overflow-hidden rounded-2xl bg-linear-to-r from-primary to-red-700 p-6 text-white shadow-sm sm:p-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-extrabold sm:text-3xl">Welcome Back, {firstName}!</h1>
            <p className="mt-1 text-sm text-white/85">Ready to receive direct requests in Sta. Maria, Bulacan.</p>
          </div>
          <button
            type="button"
            onClick={() => navigate(ROUTES.posts)}
            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-bold text-primary shadow-sm transition hover:bg-orange-50"
          >
            <PlusIcon className="h-5 w-5" /> Add New Post
          </button>
        </div>
      </section>

      {/* Stats */}
      <section className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4" aria-label="Summary">
        {STAT_ITEMS.map(({ key, label, Icon }) => (
          <div key={key} className="flex items-center gap-3 rounded-xl bg-slate-100 p-4">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white text-primary shadow-sm">
              <Icon className="h-5 w-5" />
            </span>
            <div>
              <p className="text-xs text-muted">{label}</p>
              <p className="text-2xl font-extrabold text-navy">{stats[key]}</p>
            </div>
          </div>
        ))}
      </section>

      <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
        {/* Recent requests */}
        <section>
          <div className="mb-3 flex items-end justify-between gap-3">
            <div>
              <h2 className="text-lg font-bold text-navy">Recent Service Request</h2>
              <p className="text-xs text-muted">Direct requests from clients waiting for your response.</p>
            </div>
            <button
              type="button"
              onClick={() => navigate(ROUTES.requests)}
              className="shrink-0 text-sm font-semibold text-primary hover:underline"
            >
              Visit All
            </button>
          </div>

          {requests.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-10 text-center">
              <InboxIcon className="mx-auto h-12 w-12 text-gray-300" />
              <p className="mt-3 font-bold text-navy">You’re all caught up</p>
              <p className="mt-1 text-sm text-muted">New requests from clients will show up here.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {requests.map((r) => (
                <RequestRow
                  key={r.id}
                  request={r}
                  confirming={confirmId === r.id}
                  onReview={() => navigate(ROUTES.requests)}
                  onAskDecline={() => setConfirmId(r.id)}
                  onCancelDecline={() => setConfirmId(null)}
                  onConfirmDecline={() => decline(r)}
                />
              ))}
            </div>
          )}
        </section>

        {/* Side column */}
        <div className="space-y-6">
          <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-navy">Upcoming Jobs</h2>
              <button
                type="button"
                onClick={() => navigate(ROUTES.calendar)}
                className="text-sm font-semibold text-primary hover:underline"
              >
                See All
              </button>
            </div>

            {upcoming.length === 0 ? (
              <p className="mt-3 text-sm text-muted">No upcoming jobs yet.</p>
            ) : (
              <ul className="mt-3 space-y-3">
                {upcoming.map((j) => (
                  <li key={j.id} className="flex items-center gap-3">
                    <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${j.tone}`}>
                      <BriefcaseIcon className="h-5 w-5" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-bold text-navy">{j.title}</p>
                      <p className="text-xs text-muted">{j.when}</p>
                    </div>
                    <ChevronRightIcon className="h-5 w-5 text-gray-300" />
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section className="rounded-2xl bg-linear-to-br from-navy to-navy-2 p-5 text-white shadow-sm">
            <div className="flex items-center gap-3">
              <span className="rounded-lg bg-white/10 p-2">
                <UserIcon className="h-5 w-5" />
              </span>
              <h2 className="text-lg font-bold">Profile Strength</h2>
            </div>
            <p className="mt-3 text-sm text-gray-300">Complete your profile to rank higher in client searches.</p>
            <div className="mt-4 flex justify-between text-sm font-bold">
              <span>{profile.percent}% complete</span>
              <span>{profile.done}/{profile.total} steps</span>
            </div>
            <div className="mt-2 h-2 w-full rounded-full bg-white/20" role="progressbar" aria-valuenow={profile.percent} aria-valuemin={0} aria-valuemax={100}>
              <div className="h-2 rounded-full bg-primary" style={{ width: `${profile.percent}%` }} />
            </div>
            <button
              type="button"
              onClick={() => navigate(ROUTES.settings)}
              className="mt-4 w-full rounded-xl bg-white py-2.5 text-sm font-bold text-navy transition hover:bg-gray-100"
            >
              Complete profile
            </button>
          </section>
        </div>
      </div>

      <div
        role="status"
        className={`pointer-events-none fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-lg bg-navy px-4 py-2.5 text-sm font-semibold text-white shadow-lg transition-opacity ${
          toast ? "opacity-100" : "opacity-0"
        }`}
      >
        {toast}
      </div>
    </div>
  );
}