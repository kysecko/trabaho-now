import React from 'react';
import { StarIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../../context/AuthContext';
import VerificationLock from '../../components/ui/VerificationLock';

export default function ClientReviews() {
    const { user } = useAuth();
    const isVerified = user?.kycStatus === 'approved' || user?.isVerified === true;

    if (!isVerified) {
        return (
            <main className="w-full space-y-6">

                <h1 className="text-2xl font-bold mb-6 text-gray-800">Reviews</h1>

                <div className="mb-6 p-6 bg-white border border-gray-200 rounded-xl shadow-sm opacity-70 relative overflow-hidden">
                    <div className="flex gap-1 text-yellow-400 mb-3">
                        {[...Array(5)].map((_, i) => <StarIcon key={i} className="w-5 h-5 fill-current" />)}
                    </div>
                    <p className="text-gray-600 italic text-lg">"Excellent service! Very professional and arrived on time. Highly recommended!"</p>
                    <p className="text-sm font-bold text-gray-800 mt-4">— Maria S. (Verified Client)</p>

                    <div className="absolute inset-0 bg-linear-to-t from-white via-white/90 to-transparent flex items-end justify-center pb-6">
                        <span className="text-sm font-bold text-gray-500">Verify to see more reviews</span>
                    </div>
                </div>

                <VerificationLock
                    title="Reviews & Reputation"
                    Icon={StarIcon}
                    description="Unverified accounts cannot leave or receive reviews. Complete your verification to build trust with the community and showcase your 5-star service."
                />
            </main>
        );
    }

    return (
        <main className="w-full space-y-6">
            <h1 className="text-2xl font-bold mb-6 text-gray-800">Reviews</h1>
            <div className="grid gap-4">
                <div className="p-6 bg-white border border-gray-200 rounded-xl shadow-sm">
                    <div className="flex justify-between items-start mb-3">
                        <div className="flex gap-1 text-yellow-400">
                            {[...Array(5)].map((_, i) => <StarIcon key={i} className="w-5 h-5 fill-current" />)}
                        </div>
                        <span className="text-xs font-medium text-gray-400">Oct 24, 2026</span>
                    </div>
                    <p className="text-gray-700 text-base">"Great work fixing the pipes. Very clean and fast."</p>
                    <p className="text-sm font-bold text-navy mt-4">— Ben T.</p>
                </div>
            </div>
        </main>
    );
}