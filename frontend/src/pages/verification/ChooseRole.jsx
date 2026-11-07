import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRightIcon, BriefcaseIcon, WrenchScrewdriverIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../../context/AuthContext';

export default function ChooseRole() {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  // Default to their current role if they have one, otherwise null
  const [selected, setSelected] = useState(
    user?.role === 'client' || user?.role === 'jobseeker' ? user.role : null
  );

  const handleContinue = () => {
    if (selected) {
      // Save their choice so the backend / next steps know what to do
      localStorage.setItem('verifying_role', selected);
      navigate('/verify/start');
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-10 px-4">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">How will you use TrabahoNow?</h1>
        <p className="text-gray-500 mb-8">Choose your account type to continue setting up your profile.</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          {/* Client Option */}
          <div 
            onClick={() => setSelected('client')} 
            className={`cursor-pointer border-2 rounded-xl p-6 transition-all ${
              selected === 'client' 
                ? 'border-[#ff4d00] bg-orange-50' 
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <BriefcaseIcon className="w-10 h-10 text-[#ff4d00] mb-4" />
            <h3 className="font-bold text-lg text-gray-900">I want to hire</h3>
            <p className="text-gray-500">Find and book verified workers</p>
          </div>

          {/* Jobseeker Option */}
          <div 
            onClick={() => setSelected('jobseeker')} 
            className={`cursor-pointer border-2 rounded-xl p-6 transition-all ${
              selected === 'jobseeker' 
                ? 'border-[#ff4d00] bg-orange-50' 
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <WrenchScrewdriverIcon className="w-10 h-10 text-[#ff4d00] mb-4" />
            <h3 className="font-bold text-lg text-gray-900">I want to work</h3>
            <p className="text-gray-500">Offer services and get hired.</p>
          </div>
        </div>

        <button 
          onClick={handleContinue} 
          disabled={!selected} 
          className="w-full bg-[#ff4d00] hover:bg-[#e64500] disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-bold py-3 rounded-xl flex justify-center items-center transition-colors"
        >
          Continue <ArrowRightIcon className="w-5 h-5 ml-2" />
        </button>
      </div>
    </div>
  );
}