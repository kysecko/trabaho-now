import { useAuth } from "../../context/AuthContext";
import { Link } from "react-router-dom";

export default function Dashboard() {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Welcome back, {user?.name}!</h1>
        <p className="text-gray-500 mt-1">Here is what's happening with your account today.</p>
      </div>

      {/* Conditional Verification Banner */}
      {!user?.is_verified && (
        <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded-r-lg flex justify-between items-center">
          <div>
            <h3 className="text-yellow-800 font-semibold">Account Unverified</h3>
            <p className="text-yellow-700 text-sm">Please verify your identity to unlock all features.</p>
          </div>
          <Link 
            to="/dashboard/verify" 
            className="bg-yellow-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-yellow-700 transition"
          >
            Verify Now
          </Link>
        </div>
      )}

      {/* Analytics / Stats (Visible even if unverified, but maybe blurred or limited) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <p className="text-gray-500 text-sm">Total Earnings</p>
          <p className="text-2xl font-bold">{user?.is_verified ? "₱12,300" : "---"}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <p className="text-gray-500 text-sm">Active Jobs</p>
          <p className="text-2xl font-bold">{user?.is_verified ? "2" : "---"}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <p className="text-gray-500 text-sm">Reviews</p>
          <p className="text-2xl font-bold">{user?.is_verified ? "4.9" : "---"}</p>
        </div>
      </div>
    </div>
  );
}