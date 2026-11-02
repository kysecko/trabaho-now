import { useNavigate } from "react-router-dom";
import { BanknotesIcon, ArrowDownTrayIcon } from "@heroicons/react/24/outline";
import { useAuth } from "../../context/AuthContext";

export default function JobseekerTransactions() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const isVerified = user?.is_verified === true || user?.verification_status === 'approved';

  if (!isVerified) {
    return (
      <div className="p-6 flex flex-col items-center justify-center min-h-[400px] text-center">
        <BanknotesIcon className="w-16 h-16 text-gray-300 mb-4" />
        <h2 className="text-xl font-bold text-gray-800 mb-2">Wallet Locked</h2>
        <p className="text-gray-500 mb-6 max-w-sm">Verify your account to receive payments, view receipts, and withdraw your earnings.</p>
        <button onClick={() => navigate('/verify')} className="bg-[#ff4d00] text-white px-6 py-2.5 rounded-lg font-bold hover:bg-[#e64500]">Verify Now</button>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 max-w-3xl">
      <h1 className="text-2xl font-bold text-gray-800">Transactions</h1>
      
      {/* Wallet Card */}
      <div className="bg-gradient-to-r from-[#101e32] to-[#1b2b45] text-white p-8 rounded-2xl shadow-lg relative overflow-hidden">
        <div className="relative z-10">
          <p className="text-gray-300 font-medium mb-1">Available Balance</p>
          <h2 className="text-4xl font-bold mb-6">₱12,300.00</h2>
          <button className="bg-[#ff4d00] hover:bg-[#e64500] text-white px-6 py-2.5 rounded-lg font-bold flex items-center gap-2 transition">
            <ArrowDownTrayIcon className="w-5 h-5" /> Withdraw Funds
          </button>
        </div>
        <BanknotesIcon className="absolute right-[-20px] bottom-[-20px] w-48 h-48 text-white/5" />
      </div>

      {/* History List */}
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <h3 className="font-bold text-gray-800 mb-4 border-b pb-3">Recent Earnings</h3>
        <div className="space-y-4">
          <div className="flex justify-between items-center text-sm">
            <div>
              <p className="font-bold text-gray-800">Aircon Repair - Pedro R.</p>
              <p className="text-gray-400 text-xs">Nov 1, 2026</p>
            </div>
            <span className="font-bold text-green-600">+ ₱800.00</span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <div>
              <p className="font-bold text-gray-800">Carpentry - Maria S.</p>
              <p className="text-gray-400 text-xs">Oct 28, 2026</p>
            </div>
            <span className="font-bold text-green-600">+ ₱1,500.00</span>
          </div>
        </div>
      </div>
    </div>
  );
}