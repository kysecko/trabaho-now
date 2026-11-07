import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ClockIcon } from '@heroicons/react/24/outline';

export default function VerifyPending() {
  const navigate = useNavigate();
  const [role, setRole] = useState("client");

  useEffect(() => {
    const savedRole = localStorage.getItem('verifying_role');
    if (savedRole) setRole(savedRole);
  }, []);

  return (
    <div className="max-w-xl mx-auto py-20 px-4 text-center">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-10">
        <ClockIcon className="w-16 h-16 text-[#ff4d00] mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Verification in Progress</h1>
        <p className="text-gray-500 mb-8">Your {role === 'jobseeker' ? 'worker' : 'client'} application is under review (24-48 hours).</p>
        <button onClick={() => navigate(role === 'jobseeker' ? '/jobseeker/dashboard' : '/client/dashboard')} className="w-full bg-[#ff4d00] text-white font-bold py-3 rounded-xl">
          Return to Dashboard
        </button>
      </div>
    </div>
  );
}