import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { ArrowLeftIcon, ShieldCheckIcon } from '@heroicons/react/24/outline';

export default function VerificationLayout() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#F7FAFC] flex flex-col">
      <header className="bg-white border-b border-gray-200 px-4 sm:px-6 h-16 flex items-center justify-between sticky top-0 z-50">
        <button 
          onClick={() => navigate('/client/dashboard')} 
          className="text-gray-500 hover:text-gray-900 flex items-center gap-2 font-medium text-sm transition-colors cursor-pointer"
        >
          <ArrowLeftIcon className="w-4 h-4" /> 
          <span className="hidden sm:inline">Back to Dashboard</span>
        </button>

        <div className="flex items-center gap-2 text-[#ff4d00] font-bold tracking-wide">
          <ShieldCheckIcon className="w-6 h-6" />
          <span className="hidden sm:inline">TRABAHONOW VERIFICATION</span>
        </div>
        <div className="w-8"></div>
      </header>

      <main className="flex-1 flex flex-col">
        <Outlet />
      </main>
    </div>
  );
}