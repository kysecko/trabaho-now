import { useMemo, useState } from "react";
import { StarIcon, InboxIcon } from "@heroicons/react/24/outline";
import { useVerificationStatus } from "../../hooks/useVerificationStatus";
import LockedState from "../../components/ui/dashboard/LockedState";

/* Demo data. Pass real reviews with the `reviews` prop:
   [{ id, client, service, rating: 1-5, comment, date: "2026-11-01" }] */
const DEMO_REVIEWS = [
  { id: 1, client: "Pedro Reyes", service: "Aircon Repair", rating: 5, comment: "Fast and clean work. Explained what was wrong before starting. Highly recommended.", date: "2026-11-02" },
  { id: 2, client: "Maria Santos", service: "Carpentry", rating: 5, comment: "Very professional and arrived on time. The cabinet looks great.", date: "2026-10-29" },
  { id: 3, client: "Ana Lim", service: "Electrical Wiring", rating: 4, comment: "Good work overall. Took a bit longer than expected but the result is solid.", date: "2026-10-20" },
  { id: 4, client: "Jun Pascual", service: "Plumbing Repair", rating: 5, comment: "", date: "2026-10-12" },
  { id: 5, client: "Rosa Dizon", service: "House Painting", rating: 3, comment: "Nice paint job, but communication could be better.", date: "2026-10-01" },
];

const fmtDate = (value) =>
  new Date(`${value}T00:00:00`).toLocaleDateString("en-PH", { month: "short", day: "numeric", year: "numeric" });
const initials = (name = "") =>
  name.trim().split(/\s+/).slice(0, 2).map((p) => p[0]).join("").toUpperCase() || "?";

function Stars({ value, size = "h-4 w-4" }) {
  return (
    <div className="flex text-yellow-400" role="img" aria-label={`${value} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((n) => (
        <StarIcon key={n} className={`${size} ${n <= Math.round(value) ? "fill-current" : "text-gray-300"}`} />
      ))}
    </div>
  );
}

export default function JobseekerReviews({ reviews = null }) {
  const { isVerified } = useVerificationStatus();
  const [filter, setFilter] = useState("all");

  const list = reviews ?? DEMO_REVIEWS;

  const summary = useMemo(() => {
    const counts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    list.forEach((r) => (counts[r.rating] = (counts[r.rating] ?? 0) + 1));
    const average = list.length ? list.reduce((n, r) => n + r.rating, 0) / list.length : 0;
    return { counts, average };
  }, [list]);

  const visible = useMemo(
    () =>
      list
        .filter((r) => filter === "all" || r.rating === filter)
        .sort((a, b) => b.date.localeCompare(a.date)),
    [list, filter]
  );

  if (!isVerified) {
    return (
      <LockedState
        icon={StarIcon}
        title="Reviews are locked"
        text="Verify your identity to start receiving jobs and reviews from clients."
      />
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-navy">Reviews</h1>
        <p className="mt-1 text-sm text-muted">What clients say about your work.</p>
      </div>

      {list.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-10 text-center">
          <StarIcon className="mx-auto h-12 w-12 text-gray-300" />
          <p className="mt-3 font-bold text-navy">No reviews yet</p>
          <p className="mx-auto mt-1 max-w-xs text-sm text-muted">
            After you finish a job, the client can leave a review. It will show up here.
          </p>
        </div>
      ) : (
        <>
          {/* Summary */}
          <section className="grid gap-6 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:grid-cols-[200px_minmax(0,1fr)] sm:p-6">
            <div className="flex flex-col items-center justify-center rounded-xl bg-slate-100 p-4 text-center">
              <p className="text-5xl font-extrabold text-navy">{summary.average.toFixed(1)}</p>
              <div className="mt-2">
                <Stars value={summary.average} size="h-5 w-5" />
              </div>
              <p className="mt-2 text-xs text-muted">{list.length} review{list.length === 1 ? "" : "s"}</p>
            </div>

            <div className="space-y-2.5" aria-label="Rating breakdown">
              {[5, 4, 3, 2, 1].map((n) => {
                const pct = list.length ? (summary.counts[n] / list.length) * 100 : 0;
                return (
                  <div key={n} className="flex items-center gap-3 text-sm">
                    <span className="w-8 shrink-0 font-semibold text-navy">{n} ★</span>
                    <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-gray-100">
                      <div className="h-full rounded-full bg-yellow-400" style={{ width: `${pct}%` }} />
                    </div>
                    <span className="w-6 shrink-0 text-right text-muted">{summary.counts[n]}</span>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Filters */}
          <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1" role="group" aria-label="Filter by rating">
            {["all", 5, 4, 3, 2, 1].map((f) => (
              <button
                key={f}
                type="button"
                aria-pressed={filter === f}
                onClick={() => setFilter(f)}
                className={`shrink-0 rounded-full border px-4 py-1.5 text-sm font-medium transition ${
                  filter === f
                    ? "border-primary bg-primary text-white"
                    : "border-gray-300 bg-white text-navy hover:border-primary"
                }`}
              >
                {f === "all" ? "All" : `${f} ★`}
              </button>
            ))}
          </div>

          {/* List */}
          {visible.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-10 text-center">
              <InboxIcon className="mx-auto h-12 w-12 text-gray-300" />
              <p className="mt-3 font-bold text-navy">No {filter}-star reviews</p>
            </div>
          ) : (
            <ul className="space-y-3">
              {visible.map((r) => (
                <li key={r.id} className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex min-w-0 items-center gap-3">
                      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary-soft font-bold text-primary">
                        {initials(r.client)}
                      </span>
                      <div className="min-w-0">
                        <p className="truncate font-bold text-navy">{r.client}</p>
                        <p className="text-xs text-muted">{r.service} · {fmtDate(r.date)}</p>
                      </div>
                    </div>
                    <Stars value={r.rating} />
                  </div>
                  <p className={`mt-3 text-sm ${r.comment ? "text-gray-700" : "italic text-muted"}`}>
                    {r.comment || "The client left a rating without a comment."}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </>
      )}
    </div>
  );
}