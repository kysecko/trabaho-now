import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { WrenchScrewdriverIcon, PlusIcon, EyeIcon, PencilSquareIcon } from "@heroicons/react/24/outline";
import { useAuth } from "../../context/AuthContext";

const MOCK_SERVICES = [
  { id: 1, title: "Aircon Cleaning & Repair", rate: 800, rateUnit: "job", status: "active" },
  { id: 2, title: "General Carpentry", rate: 500, rateUnit: "hour", status: "active" },
];

export default function MyJobPost() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const isVerified = user?.is_verified === true || user?.verification_status === 'approved';

  if (!isVerified) {
    return (
      <div className="p-6 flex flex-col items-center justify-center min-h-100 text-center">
        <WrenchScrewdriverIcon className="w-16 h-16 text-gray-300 mb-4" />
        <h2 className="text-xl font-bold text-gray-800 mb-2">Services Locked</h2>
        <p className="text-gray-500 mb-6 max-w-sm">Verify your identity to create service posts and appear in client searches.</p>
        <button onClick={() => navigate('/verify')} className="bg-[#ff4d00] text-white px-6 py-2.5 rounded-lg font-bold hover:bg-[#e64500]">
          Verify Now
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">My Services</h1>
          <p className="text-gray-500 text-sm mt-1">Manage the services you offer to clients.</p>
        </div>
        <button className="flex items-center gap-2 bg-[#ff4d00] text-white px-5 py-2.5 rounded-lg font-bold hover:bg-[#e64500] transition">
          <PlusIcon className="w-5 h-5" /> Add Service
        </button>
      </div>

      <div className="grid gap-4">
        {MOCK_SERVICES.map((svc) => (
          <div key={svc.id} className="bg-white border border-gray-200 rounded-xl p-5 flex items-center justify-between shadow-sm">
            <div>
              <h3 className="font-bold text-gray-900 text-lg">{svc.title}</h3>
              <p className="text-gray-500 text-sm">₱{svc.rate} / {svc.rateUnit}</p>
              <span className="inline-block mt-2 text-xs font-bold bg-green-100 text-green-700 px-2 py-1 rounded">
                {svc.status === 'active' ? "LIVE TO PUBLIC" : "HIDDEN"}
              </span>
            </div>
            <div className="flex gap-2">
              <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg tooltip" title="View Public Post"><EyeIcon className="w-5 h-5" /></button>
              <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg tooltip" title="Edit Service"><PencilSquareIcon className="w-5 h-5" /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}