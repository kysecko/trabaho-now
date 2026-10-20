
import { useAuth } from "../../context/AuthContext";

export default function JobseekerDashboard() {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Jobseeker Dashboard</h1>
      <p className="text-gray-500">Welcome back, {user.name}. Here is your earnings analytics.</p>
      
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl shadow-sm border">Total Earnings: ₱12,300</div>
        <div className="bg-white p-4 rounded-xl shadow-sm border">Active Jobs: 2</div>
        <div className="bg-white p-4 rounded-xl shadow-sm border">Avg. Rating: 4.9</div>
      </div>
    </div>
  );
}