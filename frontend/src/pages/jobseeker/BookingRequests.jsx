import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { InboxIcon, MapPinIcon, ClockIcon, CheckCircleIcon, XCircleIcon } from "@heroicons/react/24/outline";
import { useAuth } from "../../context/AuthContext";

const MOCK_REQUESTS = [
  { id: 1, client: "Maria Santos", job: "Fix leaking roof", date: "Nov 12, 2026", location: "Brgy. Muzon", severity: "emergency", message: "Water is dripping into the living room. Please hurry." },
  { id: 2, client: "Pedro Reyes", job: "Install ceiling fan", date: "Nov 14, 2026", location: "Brgy. Citrus", severity: "scheduled", message: "No rush, anytime in the afternoon is fine." },
];

export default function BookingRequests() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [requests, setRequests] = useState(MOCK_REQUESTS);
  const isVerified = user?.is_verified === true || user?.verification_status === 'approved';

  if (!isVerified) {
    return (
      <div className="p-6 flex flex-col items-center justify-center min-h-100 text-center">
        <InboxIcon className="w-16 h-16 text-gray-300 mb-4" />
        <h2 className="text-xl font-bold text-gray-800 mb-2">Requests Locked</h2>
        <p className="text-gray-500 mb-6 max-w-sm">You need to be verified to receive and accept booking requests.</p>
        <button onClick={() => navigate('/verify')} className="bg-[#ff4d00] text-white px-6 py-2.5 rounded-lg font-bold hover:bg-[#e64500]">Verify Now</button>
      </div>
    );
  }

  const handleAction = (id, action) => {
    setRequests(requests.filter((r) => r.id !== id));
    alert(`Job ${action} successfully.`);
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Booking Requests</h1>
        <p className="text-gray-500 text-sm mt-1">Review incoming job requests from clients.</p>
      </div>

      {requests.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-xl p-10 text-center text-gray-500">
          <InboxIcon className="w-12 h-12 mx-auto text-gray-300 mb-3" />
          <p className="font-semibold">No pending requests</p>
          <p className="text-sm">You are all caught up!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {requests.map((req) => (
            <div key={req.id} className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-gray-900">{req.client}</h3>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${req.severity === 'emergency' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'}`}>
                      {req.severity.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-[#ff4d00] font-semibold text-sm mt-1">{req.job}</p>
                </div>
                <span className="text-sm font-bold text-gray-500">Pending</span>
              </div>
              
              <p className="text-gray-600 text-sm mb-4 bg-gray-50 p-3 rounded-lg border border-gray-100 italic">"{req.message}"</p>
              
              <div className="flex items-center gap-4 text-sm text-gray-600 mb-6 font-medium">
                <span className="flex items-center gap-1"><ClockIcon className="w-4 h-4" /> {req.date}</span>
                <span className="flex items-center gap-1"><MapPinIcon className="w-4 h-4" /> {req.location}</span>
              </div>

              <div className="flex gap-3">
                <button onClick={() => handleAction(req.id, 'accepted')} className="flex-1 bg-green-500 hover:bg-green-600 text-white py-2.5 rounded-lg font-bold flex justify-center items-center gap-2"><CheckCircleIcon className="w-5 h-5" /> Accept Job</button>
                <button onClick={() => handleAction(req.id, 'declined')} className="flex-1 bg-red-50 hover:bg-red-100 text-red-600 py-2.5 rounded-lg font-bold flex justify-center items-center gap-2"><XCircleIcon className="w-5 h-5" /> Decline</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}