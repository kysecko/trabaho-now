import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ClockIcon } from '@heroicons/react/24/outline';

export default function VerifyPending() {
  const navigate = useNavigate();

  return (
    <div className="max-w-xl mx-auto py-20 px-4 text-center">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-10">
        <div className="w-20 h-20 bg-orange-50 rounded-full flex items-center justify-center mx-auto mb-6">
          <ClockIcon className="w-10 h-10 text-[#ff4d00]" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Verification in Progress</h1>
        <p className="text-gray-500 mb-8">
          Your documents have been submitted successfully. Our team will review your application within 24-48 hours.
        </p>
        <button 
          onClick={() => navigate('/')}
          className="w-full bg-[#ff4d00] hover:bg-[#e64500] text-white font-bold py-3 rounded-xl transition-colors cursor-pointer"
        >
          Return to Dashboard
        </button>
      </div>
    </div>
  );
}