import { useMemo, useState } from "react";
import {
  CheckCircleIcon,
  ClockIcon,
  ClipboardDocumentListIcon,
  InboxIcon,
  MagnifyingGlassIcon,
  MapPinIcon,
  UserGroupIcon,
} from "@heroicons/react/24/outline";
import { useVerificationStatus } from "../../hooks/useVerificationStatus";
import LockedState from "../../components/ui/dashboard/LockedState";

/* Demo data. Pass real jobs with the `jobs` prop:
   [{ id, service, client, date: "2026-11-01", location, status: "completed" | "upcoming" | "cancelled" }] */
const DEMO_JOBS = [
  { id: 1, service: "Aircon Repair", client: "Pedro Reyes", date: "2026-11-01", location: "Brgy. Citrus", status: "completed" },
  { id: 2, service: "Carpentry", client: "Maria Santos", date: "2026-10-28", location: "Brgy. Muzon", status: "completed" },
  { id: 3, service: "Plumbing Repair", client: "Jericho Cordesa", date: "2026-11-14", location: "Brgy. Kaypian", status: "upcoming" },
  { id: 4, service: "House Painting", client: "Ana Lim", date: "2026-11-18", location: "Brgy. Graceville", status: "upcoming" },
  { id: 5, service: "Electrical Wiring", client: "Jun Pascual", date: "2026-10-20", location: "Brgy. Minuyan", status: "cancelled" },
];

const STATUS = {
  completed: { label: "Completed", badge: "bg-green-100 text-green-700", tone: "bg-green-50 text-green-600" },
  upcoming: { label: "Upcoming", badge: "bg-blue-100 text-blue-700", tone: "bg-blue-50 text-blue-600" },
  cancelled: { label: "Cancelled", badge: "bg-gray-100 text-gray-600", tone: "bg-gray-100 text-gray-500" },
};

const TABS = [
  { key: "all", label: "All" },
  { key: "completed", label: "Completed" },
  { key: "upcoming", label: "Upcoming" },
  { key: "cancelled", label: "Cancelled" },
];

const EMPTY = {
  all: ["No jobs yet", "Jobs you do for clients will be listed here."],
  completed: ["No completed jobs yet", "Finished jobs will be listed here."],
  upcoming: ["No upcoming jobs", "Jobs you accept will show up here."],
  cancelled: ["No cancelled jobs", "Cancelled jobs will be listed here."],
};

const fmtDate = (value) =>
  new Date(`${value}T00:00:00`).toLocaleDateString("en-PH", { month: "short", day: "numeric", year: "numeric" });
const initials = (name = "") =>
  name.trim().split(/\s+/).slice(0, 2).map((p) => p[0]).join("").toUpperCase() || "?";

export default function JobseekerTransactions({ jobs = null }) {
  const { isVerified } = useVerificationStatus();
  const [tab, setTab] = useState("all");
  const [query, setQuery] = useState("");

  const list = jobs ?? DEMO_JOBS;

  const stats = useMemo(() => {
    const done = list.filter((j) => j.status === "completed");
    return {
      completed: done.length,
      upcoming: list.filter((j) => j.status === "upcoming").length,
      clients: new Set(done.map((j) => j.client)).size,
    };
  }, [list]);

  const counts = useMemo(
    () => ({
      all: list.length,
      completed: list.filter((j) => j.status === "completed").length,
      upcoming: list.filter((j) => j.status === "upcoming").length,
      cancelled: list.filter((j) => j.status === "cancelled").length,
    }),
    [list]
  );

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return list
      .filter((j) => tab === "all" || j.status === tab)
      .filter((j) => !q || j.service.toLowerCase().includes(q) || j.client.toLowerCase().includes(q))
      // soonest first for upcoming jobs, newest first for everything else
      .sort((a, b) => (tab === "upcoming" ? a.date.localeCompare(b.date) : b.date.localeCompare(a.date)));
  }, [list, tab, query]);

  if (!isVerified) {
    return (
      <LockedState
        icon={ClipboardDocumentListIcon}
        title="History locked"
        text="Verify your account to see your job history with clients."
      />
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-navy">Transaction History</h1>
        <p className="mt-1 text-sm text-muted">Your completed, upcoming and cancelled jobs with clients.</p>
      </div>

      {/* Summary */}
      <section className="relative overflow-hidden rounded-2xl bg-linear-to-r from-navy to-navy-2 p-6 text-white shadow-lg sm:p-8">
        <div className="relative z-10">
          <p className="text-sm font-medium text-gray-300">Jobs completed</p>
          <p className="mt-1 text-4xl font-extrabold">{stats.completed}</p>
          <p className="mt-2 text-sm text-gray-300">
            {stats.upcoming} upcoming · {stats.clients} client{stats.clients === 1 ? "" : "s"} served
          </p>
        </div>
        <ClipboardDocumentListIcon className="pointer-events-none absolute -bottom-6 right-4 h-44 w-44 text-white/5" aria-hidden="true" />
      </section>

      <section className="grid grid-cols-1 gap-3 sm:grid-cols-3" aria-label="Summary">
        {[
          { label: "Completed jobs", value: stats.completed, Icon: CheckCircleIcon, tone: "text-green-600" },
          { label: "Upcoming jobs", value: stats.upcoming, Icon: ClockIcon, tone: "text-blue-600" },
          { label: "Clients served", value: stats.clients, Icon: UserGroupIcon, tone: "text-primary" },
        ].map(({ label, value, Icon, tone }) => (
          <div key={label} className="flex items-center gap-3 rounded-xl bg-slate-100 p-4">
            <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white shadow-sm ${tone}`}>
              <Icon className="h-5 w-5" />
            </span>
            <div>
              <p className="text-xs text-muted">{label}</p>
              <p className="text-2xl font-extrabold text-navy">{value}</p>
            </div>
          </div>
        ))}
      </section>

      {/* History */}
      <section className="rounded-2xl border border-gray-200 bg-white shadow-sm">
        <div className="space-y-3 border-b border-gray-100 p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-lg font-bold text-navy">Job History</h2>
            <div className="relative w-full sm:w-64">
              <MagnifyingGlassIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
              <label htmlFor="job-search" className="sr-only">Search jobs</label>
              <input
                id="job-search"
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search client or service"
                className="w-full rounded-lg border border-gray-300 bg-white py-2 pl-9 pr-3 text-sm text-gray-800 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
            </div>
          </div>

          <div role="tablist" aria-label="Job status" className="-mx-1 flex gap-1 overflow-x-auto px-1">
            {TABS.map((t) => (
              <button
                key={t.key}
                type="button"
                role="tab"
                aria-selected={tab === t.key}
                onClick={() => setTab(t.key)}
                className={`flex shrink-0 items-center gap-2 rounded-full border px-4 py-1.5 text-sm font-medium transition ${
                  tab === t.key
                    ? "border-primary bg-primary text-white"
                    : "border-gray-300 bg-white text-navy hover:border-primary"
                }`}
              >
                {t.label}
                <span className={`text-xs font-bold ${tab === t.key ? "text-white/90" : "text-muted"}`}>{counts[t.key]}</span>
              </button>
            ))}
          </div>
        </div>

        {visible.length === 0 ? (
          <div className="p-10 text-center">
            <InboxIcon className="mx-auto h-12 w-12 text-gray-300" />
            <p className="mt-3 font-bold text-navy">{query ? "No matching jobs" : EMPTY[tab][0]}</p>
            <p className="mt-1 text-sm text-muted">{query ? "Try a different name or service." : EMPTY[tab][1]}</p>
          </div>
        ) : (
          <ul className="divide-y divide-gray-100">
            {visible.map((j) => {
              const s = STATUS[j.status] ?? STATUS.upcoming;
              return (
                <li key={j.id} className="flex items-center gap-3 px-5 py-4">
                  <span
                    className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-sm font-bold ${s.tone}`}
                    aria-hidden="true"
                  >
                    {initials(j.client)}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-bold text-navy">{j.service}</p>
                    <p className="truncate text-xs text-muted">Client: {j.client}</p>
                    {j.location && (
                      <p className="mt-0.5 inline-flex items-center gap-1 text-xs text-muted">
                        <MapPinIcon className="h-3.5 w-3.5" /> {j.location}
                      </p>
                    )}
                  </div>
                  <div className="shrink-0 text-right">
                    <p className="text-xs font-semibold text-navy">{fmtDate(j.date)}</p>
                    <span className={`mt-1 inline-block rounded-full px-2 py-0.5 text-[11px] font-bold ${s.badge}`}>{s.label}</span>
                  </div>
                </li>
              );
            })}
          </ul>
        )}

        <p className="border-t border-gray-100 px-5 py-3 text-xs text-muted">
          TrabahoNow doesn’t handle payments. Agree on the price and how to pay directly with your client.
        </p>
      </section>
    </div>
  );
}