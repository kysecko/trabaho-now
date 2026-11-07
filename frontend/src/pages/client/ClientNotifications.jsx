import { useMemo, useState } from "react";
import {
  BellIcon,
  BriefcaseIcon,
  CreditCardIcon,
  ShieldCheckIcon,
  StarIcon,
  CheckIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { useVerificationStatus } from "../../hooks/useVerificationStatus";

const TYPES = {
  booking: { label: "Bookings", icon: BriefcaseIcon, tone: "bg-blue-50 text-blue-600" },
  payment: { label: "Payments", icon: CreditCardIcon, tone: "bg-green-50 text-green-600" },
  review: { label: "Reviews", icon: StarIcon, tone: "bg-yellow-50 text-yellow-600" },
  account: { label: "Account", icon: ShieldCheckIcon, tone: "bg-orange-50 text-[#ff4d00]" },
};

const ALL_TABS = [
  { key: "all", label: "All" },
  { key: "unread", label: "Unread" },
  ...Object.entries(TYPES).map(([key, t]) => ({ key, label: t.label })),
];

const SAMPLE = [
  { id: 1, type: "booking", title: "Request accepted", body: "Apolinario Mabini accepted your plumbing request for Nov 12.", time: "5 min ago", read: false },
  { id: 2, type: "payment", title: "Payment received", body: "Your ₱600 payment for the plumbing job was recorded.", time: "2 hours ago", read: false },
  { id: 3, type: "account", title: "ID under review", body: "We’re reviewing your ID. This usually takes 24–48 hours.", time: "Yesterday", read: false },
  { id: 4, type: "review", title: "How was your job?", body: "Rate your recent job with Apolinario Mabini to help other clients.", time: "2 days ago", read: true },
  { id: 5, type: "booking", title: "Request declined", body: "A jobseeker couldn’t take your Nov 8 request. Try another worker.", time: "Last week", read: true },
];

export default function ClientNotifications() {
  const { isVerified } = useVerificationStatus();
  const [items, setItems] = useState(SAMPLE);
  const [filter, setFilter] = useState("all");

  const unreadCount = items.filter((n) => !n.read).length;

  // Filter available tabs based on verification
  const availableTabs = useMemo(() => {
    if (isVerified) return ALL_TABS;
    return ALL_TABS.filter((tab) => ["all", "unread", "account"].includes(tab.key));
  }, [isVerified]);

  const visible = useMemo(() => {
    let filtered = items;

    // Hide booking/payment/review notifications if unverified
    if (!isVerified) {
      filtered = filtered.filter((n) => n.type === "account");
    }

    return filtered.filter((n) =>
      filter === "all" ? true : filter === "unread" ? !n.read : n.type === filter
    );
  }, [items, filter, isVerified]);

  const markRead = (id) =>
    setItems((list) => list.map((n) => (n.id === id ? { ...n, read: true } : n)));
  const markAllRead = () => setItems((list) => list.map((n) => ({ ...n, read: true })));
  const dismiss = (id) => setItems((list) => list.filter((n) => n.id !== id));

  return (
    <main className="w-full space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-navy">Notifications</h1>
          <p className="mt-1 text-sm text-muted">
            {unreadCount > 0
              ? `You have ${unreadCount} unread notification${unreadCount === 1 ? "" : "s"}.`
              : "You’re all caught up."}
          </p>
        </div>

        <button
          type="button"
          onClick={markAllRead}
          disabled={unreadCount === 0}
          className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-semibold text-navy transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <CheckIcon className="h-4 w-4" />
          Mark all as read
        </button>
      </div>

      <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1">
        {availableTabs.map((tab) => {
          const active = filter === tab.key;
          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => setFilter(tab.key)}
              className={`shrink-0 cursor-pointer rounded-full border px-4 py-1.5 text-sm font-medium transition ${
                active
                  ? "border-[#ff4d00] bg-[#ff4d00] text-white"
                  : "border-gray-300 bg-white text-navy hover:border-[#ff4d00]"
              }`}
            >
              {tab.label}
              {tab.key === "unread" && unreadCount > 0 && (
                <span className={`ml-1.5 text-xs font-bold ${active ? "text-white" : "text-[#ff4d00]"}`}>
                  {unreadCount}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {visible.length === 0 ? (
        <div className="flex flex-col items-center rounded-2xl border border-gray-200 bg-white px-6 py-14 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-orange-50">
            <BellIcon className="h-7 w-7 text-[#ff4d00]" aria-hidden="true" />
          </div>
          <h2 className="mt-4 text-base font-bold text-navy">Nothing here yet</h2>
          <p className="mt-1 max-w-xs text-sm text-muted">
            {!isVerified
              ? "Verify your identity to start receiving booking and payment updates."
              : "Updates about your requests, payments and account will show up here."}
          </p>
        </div>
      ) : (
        <ul className="divide-y divide-gray-100 overflow-hidden rounded-2xl border border-gray-200 bg-white">
          {visible.map((n) => {
            const { icon: Icon, tone } = TYPES[n.type];
            return (
              <li
                key={n.id}
                className={`group flex items-start gap-3 px-4 py-4 transition ${
                  n.read ? "bg-white" : "bg-orange-50/50"
                }`}
              >
                <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${tone}`}>
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </div>

                <button
                  type="button"
                  onClick={() => markRead(n.id)}
                  className="min-w-0 flex-1 cursor-pointer text-left"
                >
                  <div className="flex items-center gap-2">
                    <p className={`truncate text-sm ${n.read ? "font-medium text-gray-700" : "font-bold text-navy"}`}>
                      {n.title}
                    </p>
                    {!n.read && (
                      <span className="h-2 w-2 shrink-0 rounded-full bg-[#ff4d00]" aria-label="Unread" />
                    )}
                  </div>
                  <p className="mt-0.5 text-sm text-gray-500">{n.body}</p>
                  <p className="mt-1 text-xs text-gray-400">{n.time}</p>
                </button>

                <button
                  type="button"
                  onClick={() => dismiss(n.id)}
                  aria-label="Dismiss notification"
                  className="shrink-0 cursor-pointer rounded-full p-1 text-gray-300 transition hover:bg-gray-100 hover:text-gray-600"
                >
                  <XMarkIcon className="h-5 w-5" />
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </main>
  );
}