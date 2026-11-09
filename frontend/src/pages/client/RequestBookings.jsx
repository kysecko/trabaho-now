import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  CalendarDaysIcon, 
  SparklesIcon, 
  MagnifyingGlassIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '../../context/AuthContext';
import VerificationLock from '../../components/ui/VerificationLock';

// Mock Data for Bookings (Replace with your API data)
const MOCK_BOOKINGS = [
  { 
    id: 1, 
    title: "Fix leaking kitchen sink", 
    worker: "Mang Benny", 
    role: "Plumber", 
    date: "Dec 12", 
    time: "9:00 AM", 
    price: "₱500", 
    status: "pending" 
  },
  { 
    id: 2, 
    title: "Clean 2 split-type aircon units", 
    worker: "Mang Rolan", 
    role: "Aircon Tech", 
    date: "Nov 14", 
    time: "1:00 PM", 
    price: "₱1,200", 
    status: "pending" 
  },
  { 
    id: 3, 
    title: "Repaint living room", 
    worker: "Kuya Jun", 
    role: "Painter", 
    date: "Oct 28", 
    time: "8:00 AM", 
    price: "₱3,500", 
    status: "accepted" 
  }
];

export default function RequestBookings() {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  // State for the active tab
  const [activeTab, setActiveTab] = useState('pending');

  // Check for snake_case from your Laravel backend
  const isVerified = user?.verification_status === 'approved' || user?.is_verified === true;

  // Filter bookings based on tab
  const filteredBookings = MOCK_BOOKINGS.filter(b => b.status === activeTab);

  // --- LOCKED STATE ---
  if (!isVerified) {
    return (
      <main className="w-full space-y-6 pb-10">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Request & Bookings</h1>
          <p className="text-sm text-gray-500 mt-1">Manage your service requests and bookings.</p>
        </div>
        <VerificationLock
          title="Bookings"
          Icon={CalendarDaysIcon}
          description="To ensure safety and trust in our community, only verified users can request services or accept job bookings. Please complete your Level 2 verification."
        />
      </main>
    );
  }

  // --- VERIFIED STATE ---
  return (
    <main className="w-full space-y-8 pb-10">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Request & Booking</h1>
          <p className="text-sm text-gray-500 mt-1">Track your requests and manage your hired workers.</p>
        </div>
        <button 
          onClick={() => navigate('/client/search')}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#ff4d00] px-5 py-2.5 text-sm font-bold text-white transition hover:bg-[#e64500] shadow-sm"
        >
          <MagnifyingGlassIcon className="w-5 h-5" />
          Find a Worker
        </button>
      </div>

      {/* 🎉 FIRST-TIME VERIFIED WELCOME BANNER */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#101e32] to-[#1b2b45] p-6 sm:p-8 text-white shadow-xl">
        <div className="absolute -right-10 -top-10 h-48 w-48 rounded-full bg-white/5 blur-2xl"></div>
        <div className="absolute -left-10 -bottom-10 h-48 w-48 rounded-full bg-[#ff4d00]/10 blur-2xl"></div>
        
        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center gap-6">
          <div className="bg-white/10 p-4 rounded-full shrink-0 backdrop-blur-md">
            <SparklesIcon className="w-8 h-8 text-[#ff4d00]" />
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-extrabold mb-1 flex items-center gap-2">
              Ready to hire? 🎉
            </h2>
            <p className="text-gray-300 text-sm sm:text-base leading-relaxed max-w-2xl">
              Your identity is fully verified. Browse trusted workers in your area, send booking requests, and pay securely using your credits.
            </p>
            <button 
              onClick={() => navigate('/client/search')}
              className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-white hover:text-[#ff4d00] transition-colors"
            >
              Browse Jobseekers <ArrowRightIcon className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* STATS OVERVIEW */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-blue-50 rounded-lg"><ClockIcon className="w-5 h-5 text-blue-600" /></div>
            <p className="text-sm font-semibold text-gray-500">Active</p>
          </div>
          <p className="text-3xl font-extrabold text-gray-900">1</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-orange-50 rounded-lg"><CalendarDaysIcon className="w-5 h-5 text-[#ff4d00]" /></div>
            <p className="text-sm font-semibold text-gray-500">Pending</p>
          </div>
          <p className="text-3xl font-extrabold text-gray-900">2</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-green-50 rounded-lg"><CheckCircleIcon className="w-5 h-5 text-green-600" /></div>
            <p className="text-sm font-semibold text-gray-500">Completed</p>
          </div>
          <p className="text-3xl font-extrabold text-gray-900">0</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-gray-100 rounded-lg"><XCircleIcon className="w-5 h-5 text-gray-600" /></div>
            <p className="text-sm font-semibold text-gray-500">Cancelled</p>
          </div>
          <p className="text-3xl font-extrabold text-gray-900">0</p>
        </div>
      </div>

      {/* TABS & LIST SECTION */}
      <div className="space-y-4">
        
        {/* Tab Filters (Matching Screenshot) */}
        <div className="flex gap-2">
          <button 
            onClick={() => setActiveTab('pending')}
            className={`px-4 py-1.5 rounded-full text-sm font-bold border transition ${
              activeTab === 'pending' 
                ? 'border-[#ff4d00] bg-[#ff4d00] text-white' 
                : 'border-gray-300 bg-white text-gray-600 hover:border-gray-400'
            }`}
          >
            Pending (2)
          </button>
          <button 
            onClick={() => setActiveTab('accepted')}
            className={`px-4 py-1.5 rounded-full text-sm font-bold border transition ${
              activeTab === 'accepted' 
                ? 'border-[#ff4d00] bg-[#ff4d00] text-white' 
                : 'border-gray-300 bg-white text-gray-600 hover:border-gray-400'
            }`}
          >
            Accepted (1)
          </button>
          <button 
            onClick={() => setActiveTab('completed')}
            className={`px-4 py-1.5 rounded-full text-sm font-bold border transition ${
              activeTab === 'completed' 
                ? 'border-[#ff4d00] bg-[#ff4d00] text-white' 
                : 'border-gray-300 bg-white text-gray-600 hover:border-gray-400'
            }`}
          >
            Completed (0)
          </button>
        </div>

        {/* Booking List (Matching Screenshot Card Design) */}
        <div className="space-y-3">
          {filteredBookings.length === 0 ? (
            <div className="rounded-2xl border border-gray-200 bg-white shadow-sm p-12 text-center">
              <CalendarDaysIcon className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <h3 className="text-lg font-bold text-gray-900">No {activeTab} bookings</h3>
              <p className="text-sm text-gray-500 mt-1">You don't have any {activeTab} requests right now.</p>
            </div>
          ) : (
            filteredBookings.map((booking) => (
              <div 
                key={booking.id} 
                className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-[#FFF5F3] border border-dashed border-[#ffd8cc] rounded-xl gap-4"
              >
                {/* Left Side Info */}
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-bold text-gray-900 text-sm">{booking.title}</h3>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded capitalize ${
                      booking.status === 'pending' ? 'bg-yellow-100 text-yellow-700' : 
                      booking.status === 'accepted' ? 'bg-green-100 text-green-700' : 
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {booking.status === 'pending' ? 'Waiting for reply' : booking.status}
                    </span>
                  </div>
                  <p className="text-xs text-gray-600">
                    {booking.worker} <span className="text-gray-400">|</span> {booking.role} <span className="text-gray-400">|</span> {booking.date} {booking.time} <span className="text-gray-400">|</span> {booking.price}
                  </p>
                </div>

                {/* Right Side Actions (Matching Screenshot) */}
                <div className="flex shrink-0">
                  {booking.status === 'pending' && (
                    <button className="px-5 py-1.5 text-xs font-bold text-red-500 bg-transparent border border-red-200 rounded-lg hover:bg-red-50 transition-colors">
                      Cancel
                    </button>
                  )}
                  {booking.status === 'accepted' && (
                    <button className="px-5 py-1.5 text-xs font-bold text-green-600 bg-transparent border border-green-200 rounded-lg hover:bg-green-50 transition-colors">
                      Message
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

      </div>

    </main>
  );
}