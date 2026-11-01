// src/pages/NotFound.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ExclamationTriangleIcon, ArrowLeftIcon, HomeIcon } from '@heroicons/react/24/outline';

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F7FAFC] px-4 py-12 sm:px-6 lg:px-8">
      <div className="max-w-md w-full text-center">
        

        <h1 className="text-9xl font-extrabold text-orange-500 tracking-tight mb-2">
          404
        </h1>
        <h2 className="text-2xl font-bold text-orange-500 mb-4">
          Page not found
        </h2>
        <p className="text-gray-500 mb-10">
          Sorry, we couldn't find the page you're looking for. It might have been moved, deleted, or you mistyped the URL.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => navigate('/client/dashboard')}
            className="flex items-center justify-center gap-2 rounded-xl border border-gray-300 bg-white px-6 py-3 text-sm font-bold text-gray-700 transition-colors hover:bg-gray-50 cursor-pointer"
          >
            <ArrowLeftIcon className="h-5 w-5" />
            Back to Home
          </button>
          
        </div>

      </div>
    </div>
  );
}