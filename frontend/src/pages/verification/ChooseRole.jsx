import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BriefcaseIcon, WrenchScrewdriverIcon } from '@heroicons/react/24/outline';

export default function ChooseRole() {
  const navigate = useNavigate();
  const [selected, setSelected] = useState(null);

  const handleContinue = () => {
    if (selected) {
      // Here you would normally update the user's role in the backend
      navigate('/verify/start');
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-10 px-4">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">How will you use TrabahoNow?</h1>
        <p className="text-gray-500 mb-8">Choose your account type to continue setting up your profile.</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <div 
            onClick={() => setSelected('client')}
            className={`cursor-pointer border-2 rounded-xl p-6 transition-all ${selected === 'client' ? 'border-[#ff4d00] bg-orange-50' : 'border-gray-200 hover:border-gray-300'}`}
          >
            <BriefcaseIcon className="w-10 h-10 text-[#ff4d00] mb-4" />
            <h3 className="font-bold text-lg text-gray-900">I want to hire</h3>
            <p className="text-sm text-gray-500 mt-1">Find and book verified workers.</p>
          </div>

          <div 
            onClick={() => setSelected('jobseeker')}
            className={`cursor-pointer border-2 rounded-xl p-6 transition-all ${selected === 'jobseeker' ? 'border-[#ff4d00] bg-orange-50' : 'border-gray-200 hover:border-gray-300'}`}
          >
            <WrenchScrewdriverIcon className="w-10 h-10 text-[#ff4d00] mb-4" />
            <h3 className="font-bold text-lg text-gray-900">I want to work</h3>
            <p className="text-sm text-gray-500 mt-1">Offer services and get hired.</p>
          </div>
        </div>

        <button
          onClick={handleContinue}
          disabled={!selected}
          className="w-full bg-[#ff4d00] hover:bg-[#e64500] disabled:bg-gray-300 text-white font-bold py-3 rounded-xl transition-colors cursor-pointer"
        >
          Continue
        </button>
      </div>
    </div>
  );
}