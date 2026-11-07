import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  UsersIcon,
  BriefcaseIcon,
  UserGroupIcon,
  ClipboardDocumentListIcon,
  FunnelIcon,
  CalendarDaysIcon,
  ChevronDownIcon
} from "@heroicons/react/24/outline";
import { getVerifications } from "../../api/admin";

// Must match the path of your VerificationQueue route in adminRoutes
const QUEUE_PATH = "/admin/verifications";

const timeAgo = (iso) => {
  const mins = Math.floor((Date.now() - new Date(iso).getTime()) / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins} min ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours} hr ago`;
  const days = Math.floor(hours / 24);
  return `${days} day${days === 1 ? "" : "s"} ago`;
};

export default function AdminDashboard() {
  const navigate = useNavigate();

  // Live verification queue
  const [queue, setQueue] = useState([]);
  const [queueTotal, setQueueTotal] = useState(0);
  const [queueLoading, setQueueLoading] = useState(true);
  const [queueError, setQueueError] = useState(null);

  useEffect(() => {
    let ignore = false;

    (async () => {
      try {
        const res = await getVerifications("pending");
        if (ignore) return;
        const rows = res?.data ?? [];
        setQueue(rows.slice(0, 5));
        setQueueTotal(res?.total ?? rows.length);
      } catch (err) {
        if (!ignore) setQueueError(err.message);
      } finally {
        if (!ignore) setQueueLoading(false);
      }
    })();

    return () => {
      ignore = true;
    };
  }, []);

  // Mock data based on the screenshot
  const stats = [
    { title: "Total Users", value: "12,345", badge: "+5 new", subtitle: "active accounts", icon: UsersIcon },
    { title: "Service Providers", value: "892", badge: "+10 new", subtitle: "verified & ready to work", icon: BriefcaseIcon },
    { title: "Clients", value: "343", badge: "+3 new", subtitle: "hiring in the marketplace", icon: UserGroupIcon },
    { title: "Active Jobs Today", value: "45", badge: "+15 new", subtitle: "across 12 service categories", icon: ClipboardDocumentListIcon },
  ];

  const transactions = [
    { id: "TRX-58606", client: "Maria Santos", provider: "Carlo Mendoza", service: "House cleaning", status: "Completed", date: "Nov 28, 2023", time: "10:24 AM" },
    { id: "TRX-53529", client: "Juan Reyes", provider: "Jose Ramirez", service: "Electrical repair", status: "Ongoing", date: "Nov 28, 2023", time: "10:23 AM" },
    { id: "TRX-68564", client: "Ana Cruz", provider: "Mark Dela Cruz", service: "Plumbing", status: "Ongoing", date: "Nov 28, 2023", time: "10:18 AM" },
    { id: "TRX-38463", client: "Paolo Garcia", provider: "Javier Aquino", service: "Welding", status: "Pending", date: "Nov 28, 2023", time: "10:12 AM" },
    { id: "TRX-53706", client: "Liza Torres", provider: "Rico Villanueva", service: "Aircon service", status: "Pending", date: "Nov 28, 2023", time: "09:58 AM" },
  ];

  return (
    <div className="mx-auto w-full max-w-7xl">
      {/* Page Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
          <p className="mt-1 text-sm text-gray-500">Welcome back, Admin! Here's what's happening in your marketplace.</p>
        </div>
        <button className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50">
          <span className="text-gray-400"><CalendarDaysIcon className="w-5 h-5" /></span> Nov 28, 2023
          <span className="text-gray-400"><ChevronDownIcon className="w-5 h-5" /></span>
        </button>
      </div>

      {/* Stat Cards */}
      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, i) => (
          <div key={i} className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-gray-600">{stat.title}</p>
              <stat.icon className="h-5 w-5 text-gray-400" />
            </div>
            <div className="mt-2 flex items-baseline gap-3">
              <h3 className="text-3xl font-bold text-gray-900">{stat.value}</h3>
              <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-semibold text-green-700">
                {stat.badge}
              </span>
            </div>
            <p className="mt-1 text-xs text-gray-500">{stat.subtitle}</p>
          </div>
        ))}
      </div>

      {/* Bottom Section: Tables & Queues */}
      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">

        {/* Recent Transactions (Takes up 2 columns) */}
        <div className="col-span-1 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm lg:col-span-2">
          <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4">
            <div>
              <h2 className="text-lg font-bold text-gray-900">Recent Transactions</h2>
              <p className="text-xs text-gray-500">Monitor the latest service bookings.</p>
            </div>
            <button className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm font-medium text-blue-600 hover:bg-gray-50">
              View all
            </button>
          </div>

          {/* Tabs */}
          <div className="flex gap-6 border-b border-gray-200 px-5 text-sm font-medium text-gray-500">
            <button className="border-b-2 border-blue-600 py-3 text-blue-600">All transactions</button>
            <button className="py-3 hover:text-gray-900">Completed</button>
            <button className="py-3 hover:text-gray-900">Pending</button>
            <button className="ml-auto flex items-center gap-1 py-3 text-gray-400 hover:text-gray-600">
              <FunnelIcon className="h-4 w-4" /> Filter
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-600">
              <thead className="bg-gray-50 text-xs font-semibold uppercase text-gray-500">
                <tr>
                  <th className="px-5 py-3">Transaction</th>
                  <th className="px-5 py-3">Client</th>
                  <th className="px-5 py-3">Provider</th>
                  <th className="px-5 py-3">Service</th>
                  <th className="px-5 py-3">Status</th>
                  <th className="px-5 py-3">Date / time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {transactions.map((tx, i) => (
                  <tr key={i} className="hover:bg-gray-50">
                    <td className="px-5 py-3 font-medium text-gray-900">{tx.id}</td>
                    <td className="px-5 py-3">{tx.client}</td>
                    <td className="px-5 py-3">{tx.provider}</td>
                    <td className="px-5 py-3">{tx.service}</td>
                    <td className="px-5 py-3">
                      <span className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
                        tx.status === 'Completed' ? 'bg-green-100 text-green-700' :
                        tx.status === 'Ongoing' ? 'bg-blue-100 text-blue-700' :
                        'bg-orange-100 text-orange-700'
                      }`}>
                        {tx.status}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-xs">
                      {tx.date}<br/>
                      <span className="text-gray-400">{tx.time}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Verification Queue (Takes up 1 column) */}
        <div className="col-span-1 rounded-xl border border-gray-200 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4">
            <div>
              <h2 className="text-lg font-bold text-gray-900">Verification Queue</h2>
              <p className="text-xs text-orange-500">
                {queueLoading ? "Loading..." : `${queueTotal} awaiting review`}
              </p>
            </div>
            <button
              type="button"
              onClick={() => navigate(QUEUE_PATH)}
              className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm font-medium text-blue-600 hover:bg-gray-50"
            >
              View all
            </button>
          </div>

          <div className="divide-y divide-gray-100">
            {queueError && <p className="px-5 py-4 text-sm text-red-600">{queueError}</p>}

            {!queueLoading && !queueError && queue.length === 0 && (
              <p className="px-5 py-4 text-sm text-gray-500">No requests waiting. You're all caught up.</p>
            )}

            {queue.map((v) => (
              <div key={v.id} className="flex items-center justify-between px-5 py-3 hover:bg-gray-50">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-gray-900">{v.name || v.user?.name}</p>
                  <p className="text-xs capitalize text-gray-500">{v.role} • {timeAgo(v.submitted_at)}</p>
                </div>
                <button
                  type="button"
                  onClick={() => navigate(`${QUEUE_PATH}?open=${v.id}`)}
                  className="shrink-0 rounded-md bg-blue-900 px-3 py-1.5 text-xs font-medium text-white hover:bg-blue-800"
                >
                  Review
                </button>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}