import React from 'react';
import { ShieldCheckIcon } from '@heroicons/react/24/outline';

export default function VerificationLock({ title, description, Icon = ShieldCheckIcon }) {
  return (
    <div className="flex flex-col items-center justify-center p-12 bg-white rounded-xl border border-gray-200 shadow-sm text-center min-h-100">
      <div className="w-24 h-24 bg-orange-50 text-[#ff4d00] rounded-full flex items-center justify-center mb-6">
        <Icon className="w-12 h-12" strokeWidth={1.5} />
      </div>
      <h2 className="text-2xl font-bold text-gray-800 mb-3">{title} is Locked</h2>
      <p className="text-gray-500 max-w-md mb-8 text-base">
        {description}
      </p>
      <button className="bg-[#ff4d00] hover:bg-[#e64500] text-white font-bold py-3 px-8 rounded-lg transition-colors shadow-sm cursor-pointer">
        Complete Verification
      </button>
    </div>
  );
}