import { useState } from "react";
import { BellIcon, BriefcaseIcon, BanknotesIcon, ShieldCheckIcon } from "@heroicons/react/24/outline";

const TYPES = {
  booking: { label: "Bookings", icon: BriefcaseIcon, tone: "bg-blue-50 text-blue-600" },
  payment: { label: "Payments", icon: BanknotesIcon, tone: "bg-green-50 text-green-600" },
  system: { label: "System", icon: ShieldCheckIcon, tone: "bg-orange-50 text-[#ff4d00]" },
};

const MOCK_NOTIFS = [
  { id: 1, type: "system", title: "Welcome to your Worker Dashboard", body: "Your account is verified. Add a service post to start appearing in searches.", time: "Just now", read: false },
  { id: 2, type: "booking", title: "New Job Request", body: "Maria Santos wants to book you for 'Fix leaking roof'.", time: "2 hours ago", read: false },
  { id: 3, type: "payment", title: "Payment Received", body: "You received ₱800 for 'Aircon Repair'.", time: "Yesterday", read: true },
];

export default function JobseekerNotifications() {
  const [filter, setFilter] = useState("all");
  const notifs = MOCK_NOTIFS;

  const filteredNotifs = filter === "all" ? notifs : notifs.filter(n => n.type === filter);

  return (
    <div className="p-6 max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Notifications</h1>
        <p className="text-gray-500 text-sm mt-1">Updates about your jobs, earnings, and account.</p>
      </div>

      {/* Filter Pills */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        <button onClick={() => setFilter("all")} className={`px-4 py-1.5 rounded-full text-sm font-bold border transition ${filter === 'all' ? 'bg-[#ff4d00] text-white border-[#ff4d00]' : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'}`}>All</button>
        {Object.entries(TYPES).map(([key, val]) => (
          <button key={key} onClick={() => setFilter(key)} className={`px-4 py-1.5 rounded-full text-sm font-bold border transition capitalize ${filter === key ? 'bg-[#ff4d00] text-white border-[#ff4d00]' : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'}`}>
            {val.label}
          </button>
        ))}
      </div>

      {/* List */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {filteredNotifs.length === 0 ? (
          <div className="p-10 text-center text-gray-500">
            <BellIcon className="w-10 h-10 mx-auto text-gray-300 mb-3" />
            <p>No notifications found.</p>
          </div>
        ) : (
          <ul className="divide-y divide-gray-100">
            {filteredNotifs.map((notif) => {
              const { icon: Icon, tone } = TYPES[notif.type];
              return (
                <li key={notif.id} className={`p-4 flex gap-4 items-start transition ${notif.read ? 'bg-white' : 'bg-orange-50/40'}`}>
                  <div className={`p-2 rounded-full shrink-0 ${tone}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className={`text-sm ${notif.read ? 'font-semibold text-gray-700' : 'font-bold text-gray-900'}`}>{notif.title}</h3>
                    <p className="text-sm text-gray-500 mt-0.5">{notif.body}</p>
                    <p className="text-xs text-gray-400 mt-2 font-medium">{notif.time}</p>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}