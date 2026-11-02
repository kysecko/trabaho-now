import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  CheckCircleIcon, 
  ClockIcon, 
  BanknotesIcon, 
  BriefcaseIcon, 
  StarIcon,
  PowerIcon
} from "@heroicons/react/24/outline";
import { useAuth } from "../../context/AuthContext";

export default function JobseekerDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const isVerified = user?.is_verified === true || user?.verification_status === 'approved';
  const isPending = user?.verification_status === 'pending';
  
  // Local state for availability toggle
  const [isOnline, setIsOnline] = useState(user?.availability_status === 'available');

  if (!isVerified) {
    return (
      <div className="p-6 flex flex-col items-center justify-center min-h-125 text-center">
        {isPending ? (
          <div className="bg-yellow-50 border border-yellow-200 p-8 rounded-2xl max-w-md w-full">
            <ClockIcon className="w-16 h-16 text-yellow-600 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-yellow-800 mb-2">Verification Under Review</h2>
            <p className="text-yellow-700 mb-6">
              We are reviewing your ID. This usually takes 24-48 hours. You will be able to publish services and accept jobs once approved.
            </p>
            <button onClick={() => navigate('/client/dashboard')} className="bg-yellow-600 text-white px-6 py-2.5 rounded-lg font-bold hover:bg-yellow-700">
              Return to Client Dashboard
            </button>
          </div>
        ) : (
          <div className="bg-white border border-gray-200 p-8 rounded-2xl shadow-sm max-w-md w-full">
            <BriefcaseIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-gray-800 mb-2">Account Not Verified</h2>
            <p className="text-gray-500 mb-6">
              You must verify your identity before you can access the worker dashboard and start earning.
            </p>
            <button onClick={() => navigate('/verify')} className="bg-[#ff4d00] text-white px-6 py-2.5 rounded-lg font-bold hover:bg-[#e64500]">
              Verify Now
            </button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome & Status Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Jobseeker Dashboard</h1>
          <p className="text-gray-500">Welcome back, {user?.name}. Here is your earnings analytics.</p>
        </div>
        
        {/* Online/Offline Toggle */}
        <button 
          onClick={() => setIsOnline(!isOnline)}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold transition shadow-sm border ${
            isOnline 
              ? "bg-green-50 text-green-700 border-green-200" 
              : "bg-gray-100 text-gray-600 border-gray-300"
          }`}
        >
          <PowerIcon className="w-5 h-5" />
          {isOnline ? "You are Online (Available)" : "You are Offline (Busy)"}
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <BanknotesIcon className="w-8 h-8 text-[#ff4d00] mb-3" />
          <p className="text-sm font-semibold text-gray-500">Total Earnings</p>
          <p className="text-2xl font-bold text-gray-900">₱12,300</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <BriefcaseIcon className="w-8 h-8 text-blue-500 mb-3" />
          <p className="text-sm font-semibold text-gray-500">Active Jobs</p>
          <p className="text-2xl font-bold text-gray-900">2</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <StarIcon className="w-8 h-8 text-yellow-500 mb-3" />
          <p className="text-sm font-semibold text-gray-500">Average Rating</p>
          <p className="text-2xl font-bold text-gray-900">4.9</p>
        </div>
      </div>
    </div>
  );
}