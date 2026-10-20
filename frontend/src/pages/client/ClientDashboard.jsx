import { useAuth } from "../../context/AuthContext";
import { Link } from "react-router-dom";

export default function ClientDashboard() {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Client Dashboard</h1>
      <p className="text-gray-500">Welcome back, {user.name}. Here is your hiring analytics.</p>
      
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl shadow-sm border">Total Spent: ₱4,500</div>
        <div className="bg-white p-4 rounded-xl shadow-sm border">Active Bookings: 3</div>
        <div className="bg-white p-4 rounded-xl shadow-sm border">Pending Requests: 1</div>
      </div>
    </div>
  );
}