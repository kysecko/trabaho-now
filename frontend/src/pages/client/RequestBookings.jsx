import React from 'react';
import { CalendarDaysIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../../context/AuthContext';
import VerificationLock from '../../components/ui/VerificationLock';

export default function RequestBookings() {
  const { user } = useAuth();

  // FIXED: Check for snake_case from your Laravel backend
  const isVerified = user?.verification_status === 'approved' || user?.is_verified === true;

  if (!isVerified) {
    return (
      <main className="w-full space-y-6">
        <h1 className="text-2xl font-bold mb-6 text-gray-800">Request & Bookings</h1>
        <VerificationLock
          title="Bookings"
          Icon={CalendarDaysIcon}
          description="To ensure safety and trust in our community, only verified users can request services or accept job bookings. Please complete your Level 2 verification."
        />
      </main>
    );
  }

  return (
    <main className="w-full space-y-6">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Request & Bookings</h1>
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
        <p className="text-gray-500 text-center py-10">You have no active bookings right now.</p>
      </div>
    </main>
  );
}