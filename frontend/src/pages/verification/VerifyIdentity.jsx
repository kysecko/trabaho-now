import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PhotoIcon, UserCircleIcon, HomeIcon } from '@heroicons/react/24/outline';

export default function VerifyIdentity() {
  const navigate = useNavigate();
  const [files, setFiles] = useState({ id: null, selfie: null, residency: null });

  const handleSubmit = (e) => {
    e.preventDefault();
    // API call to upload files goes here
    navigate('/verify/pending');
  };

  return (
    <div className="max-w-3xl mx-auto py-10 px-4">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Upload your documents</h1>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Government ID (Front)</label>
            <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 flex flex-col items-center justify-center text-gray-500 hover:bg-gray-50 transition-colors cursor-pointer relative">
              <PhotoIcon className="w-8 h-8 mb-2 text-gray-400" />
              <span className="text-sm">{files.id ? files.id.name : "Click to upload ID"}</span>
              <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={(e) => setFiles({...files, id: e.target.files[0]})} required />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Selfie holding ID</label>
            <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 flex flex-col items-center justify-center text-gray-500 hover:bg-gray-50 transition-colors cursor-pointer relative">
              <UserCircleIcon className="w-8 h-8 mb-2 text-gray-400" />
              <span className="text-sm">{files.selfie ? files.selfie.name : "Click to upload selfie"}</span>
              <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={(e) => setFiles({...files, selfie: e.target.files[0]})} required />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Proof of Residency</label>
            <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 flex flex-col items-center justify-center text-gray-500 hover:bg-gray-50 transition-colors cursor-pointer relative">
              <HomeIcon className="w-8 h-8 mb-2 text-gray-400" />
              <span className="text-sm">{files.residency ? files.residency.name : "Click to upload Barangay ID/Clearance"}</span>
              <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={(e) => setFiles({...files, residency: e.target.files[0]})} required />
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <button type="button" onClick={() => navigate(-1)} className="flex-1 py-3 border border-gray-300 rounded-xl font-bold text-gray-700 hover:bg-gray-50 cursor-pointer">
              Back
            </button>
            <button type="submit" className="flex-1 py-3 bg-[#ff4d00] hover:bg-[#e64500] text-white rounded-xl font-bold cursor-pointer">
              Submit for Review
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}