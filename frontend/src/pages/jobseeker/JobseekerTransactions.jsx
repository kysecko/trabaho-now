import { useEffect, useMemo, useRef, useState } from "react";
import {
  BanknotesIcon,
  ArrowDownTrayIcon,
  CheckCircleIcon,
  ClockIcon,
  InboxIcon,
} from "@heroicons/react/24/outline";
import { useVerificationStatus } from "../../hooks/useVerificationStatus";
import LockedState from "../../components/ui/dashboard/LockedState";

/* Demo data. Pass real transactions with the `transactions` prop:
   [{ id, title, client, date: "2026-11-01", amount: 800, status: "paid" | "pending" }] */
const DEMO_TX = [
  { id: 1, title: "Aircon Repair", client: "Pedro R.", date: "2026-11-01", amount: 800, status: "paid" },
  { id: 2, title: "Carpentry", client: "Maria S.", date: "2026-10-28", amount: 1500, status: "paid" },
  { id: 3, title: "Plumbing Repair", client: "Jericho C.", date: "2026-11-14", amount: 1200, status: "pending" },
  { id: 4, title: "House Painting", client: "Ana L.", date: "2026-11-18", amount: 3000, status: "pending" },
];

const TABS = [
  { key: "all", label: "All" },
  { key: "paid", label: "Received" },
  { key: "pending", label: "Upcoming" },
];

const STATUS = {
  paid: { label: "Received", badge: "bg-green-100 text-green-700", Icon: CheckCircleIcon, tone: "bg-green-50 text-green-600" },
  pending: { label: "Upcoming", badge: "bg-yellow-100 text-yellow-700", Icon: ClockIcon, tone: "bg-yellow-50 text-yellow-600" },
};

const peso = (n) => `₱${Number(n).toLocaleString("en-PH", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
const fmtDate = (value) =>
  new Date(`${value}T00:00:00`).toLocaleDateString("en-PH", { month: "short", day: "numeric", year: "numeric" });

export default function JobseekerTransactions({ transactions = null, onWithdraw }) {
  const { isVerified } = useVerificationStatus();
  const [tab, setTab] = useState("all");
  const [toast, setToast] = useState("");
  const timer = useRef(null);

  useEffect(() => () => clearTimeout(timer.current), []);

  const list = transactions ?? DEMO_TX;

  const totals = useMemo(() => {
    const sum = (s) => list.filter((t) => t.status === s).reduce((n, t) => n + Number(t.amount), 0);
    return { received: sum("paid"), upcoming: sum("pending") };
  }, [list]);

  const visible = useMemo(
    () =>
      list
        .filter((t) => tab === "all" || t.status === tab)
        .sort((a, b) => b.date.localeCompare(a.date)),
    [list, tab]
  );

  if (!isVerified) {
    return (
      <LockedState
        icon={BanknotesIcon}
        title="Wallet locked"
        text="Verify your account to receive payments, view receipts, and withdraw your earnings."
      />
    );
  }

  const withdraw = () => {
    if (onWithdraw) return onWithdraw(totals.received);
    setToast("Withdrawals will be available soon.");
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setToast(""), 2600);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-navy">Transaction History</h1>
        <p className="mt-1 text-sm text-muted">Your earnings, separated into received and upcoming payments.</p>
      </div>

      {/* Wallet */}
      <section className="relative overflow-hidden rounded-2xl bg-linear-to-r from-navy to-navy-2 p-6 text-white shadow-lg sm:p-8">
        <div className="relative z-10 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-medium text-gray-300">Available Balance</p>
            <p className="mt-1 text-4xl font-extrabold">{peso(totals.received)}</p>
            <p className="mt-2 text-sm text-gray-300">
              {peso(totals.upcoming)} more on the way from upcoming jobs
            </p>
          </div>
          <button
            type="button"
            onClick={withdraw}
            disabled={totals.received <= 0}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-6 py-2.5 text-sm font-bold text-white transition hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-50"
          >
            <ArrowDownTrayIcon className="h-5 w-5" /> Withdraw Funds
          </button>
        </div>
        <BanknotesIcon className="pointer-events-none absolute -bottom-6 right-4 h-44 w-44 text-white/5" aria-hidden="true" />
      </section>

      {/* Summary */}
      <section className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div className="flex items-center gap-3 rounded-xl bg-slate-100 p-4">
          <span className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-green-600 shadow-sm">
            <CheckCircleIcon className="h-5 w-5" />
          </span>
          <div>
            <p className="text-xs text-muted">Total received</p>
            <p className="text-xl font-extrabold text-navy">{peso(totals.received)}</p>
          </div>
        </div>
        <div className="flex items-center gap-3 rounded-xl bg-slate-100 p-4">
          <span className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-yellow-600 shadow-sm">
            <ClockIcon className="h-5 w-5" />
          </span>
          <div>
            <p className="text-xs text-muted">Upcoming payments</p>
            <p className="text-xl font-extrabold text-navy">{peso(totals.upcoming)}</p>
          </div>
        </div>
      </section>

      {/* History */}
      <section className="rounded-2xl border border-gray-200 bg-white shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-100 px-5 py-4">
          <h2 className="text-lg font-bold text-navy">Recent Earnings</h2>
          <div role="tablist" aria-label="Filter transactions" className="flex gap-1 rounded-lg bg-gray-100 p-1">
            {TABS.map((t) => (
              <button
                key={t.key}
                type="button"
                role="tab"
                aria-selected={tab === t.key}
                onClick={() => setTab(t.key)}
                className={`rounded-md px-3 py-1.5 text-sm font-semibold transition ${
                  tab === t.key ? "bg-white text-primary shadow-sm" : "text-muted hover:text-navy"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {visible.length === 0 ? (
          <div className="p-10 text-center">
            <InboxIcon className="mx-auto h-12 w-12 text-gray-300" />
            <p className="mt-3 font-bold text-navy">Nothing here yet</p>
            <p className="mt-1 text-sm text-muted">Payments from completed jobs will be listed here.</p>
          </div>
        ) : (
          <ul className="divide-y divide-gray-100">
            {visible.map((t) => {
              const s = STATUS[t.status] ?? STATUS.pending;
              return (
                <li key={t.id} className="flex items-center gap-3 px-5 py-4">
                  <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${s.tone}`}>
                    <s.Icon className="h-5 w-5" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-bold text-navy">{t.title} · {t.client}</p>
                    <p className="text-xs text-muted">{fmtDate(t.date)}</p>
                  </div>
                  <div className="shrink-0 text-right">
                    <p className={`text-sm font-extrabold ${t.status === "paid" ? "text-green-600" : "text-navy"}`}>
                      + {peso(t.amount)}
                    </p>
                    <span className={`mt-1 inline-block rounded-full px-2 py-0.5 text-[11px] font-bold ${s.badge}`}>{s.label}</span>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </section>

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