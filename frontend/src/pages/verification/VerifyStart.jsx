import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function VerifyStart() {
  const navigate = useNavigate();
  const [agreed, setAgreed] = useState(false);

  return (
    <div className="max-w-3xl mx-auto py-10 px-4">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
        <h1 className="text-xl font-bold text-gray-900 mb-6">
          Get verified to start hiring workers or get hired.
        </h1>
        
        <div className="flex items-center justify-between mb-8 relative">
          <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-200 -z-10 transform -translate-y-1/2"></div>
          {[1, 2, 3, 4].map((step) => (
            <div key={step} className="w-8 h-8 rounded-full bg-[#ff4d00] text-white flex items-center justify-center font-bold text-sm border-4 border-white">
              {step}
            </div>
          ))}
        </div>

        <div className="text-sm text-gray-600 space-y-4 mb-8">
          <p>
            By creating an account on TrabahoNow, you consent to the collection and processing of your personal information in accordance with the <strong>Data Privacy Act of 2012 (RA 10173)</strong>.
          </p>
          <p>
            TrabahoNow uses third-party services for identity verification and account security. By continuing, you acknowledge that certain personal data may be shared with these providers.
          </p>
        </div>

        <label className="flex items-start gap-3 p-4 border border-gray-200 rounded-lg bg-gray-50 mb-8 cursor-pointer">
          <input 
            type="checkbox" 
            checked={agreed}
            onChange={(e) => setAgreed(e.target.checked)}
            className="mt-1 w-5 h-5 text-[#ff4d00] rounded border-gray-300 focus:ring-[#ff4d00]"
          />
          <span className="text-sm text-gray-700">
            I have read and agreed to the <a href="#" className="text-[#ff4d00] font-bold hover:underline">Data Privacy Act</a> and <a href="#" className="text-[#ff4d00] font-bold hover:underline">Terms of Service</a>.
          </span>
        </label>

        <div className="flex justify-end gap-4">
          <button
            onClick={() => navigate(-1)}
            className="px-6 py-2 border border-gray-300 rounded-lg font-bold text-gray-700 hover:bg-gray-50 cursor-pointer"
          >
            Back
          </button>
          <button
            onClick={() => navigate('/verify/identity')}
            disabled={!agreed}
            className="px-6 py-2 bg-[#ff4d00] hover:bg-[#e64500] disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-bold rounded-lg transition-colors cursor-pointer"
          >
            Start Verification
          </button>
        </div>
      </div>
    </div>
  );
}