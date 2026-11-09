import React from 'react';
import { StarIcon, LockClosedIcon, ChatBubbleBottomCenterTextIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../../context/AuthContext';
import VerificationLock from '../../components/ui/VerificationLock';

// Mock Data for Reviews
const MOCK_REVIEWS = [
    {
        id: 1,
        workerName: "Juan Dela Cruz",
        service: "Aircon Cleaning",
        date: "Nov 2, 2026",
        rating: 5,
        comment: "Excellent service! Juan arrived on time and did a very thorough job cleaning my aircon. Highly recommended!"
    },
    {
        id: 2,
        workerName: "Pedro Reyes",
        service: "Carpentry Work",
        date: "Oct 25, 2026",
        rating: 4,
        comment: "Good work overall. There was a slight delay but the finished product was solid. Will book again."
    }
];

export default function ClientReviews() {
    const { user } = useAuth();

    // Check for snake_case from your Laravel backend
    const isVerified = user?.verification_status === 'approved' || user?.is_verified === true;

    // LOCKED STATE
    if (!isVerified) {
        return (
            <main className="w-full space-y-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Reviews</h1>
                    <p className="text-sm text-gray-500 mt-1">Manage the feedback given by the workers.</p>
                </div>
                {/* Blurred Teaser */}
                <div className="mb-6 p-6 bg-white border border-gray-200 rounded-xl shadow-sm opacity-70 relative overflow-hidden">
                    <div className="flex gap-1 text-yellow-400 mb-3">
                        {[...Array(5)].map((_, i) => <StarIcon key={i} className="w-5 h-5 fill-current" />)}
                    </div>
                    <p className="text-gray-600 italic text-lg">"Excellent service! Very professional and arrived on time. Highly recommended!"</p>
                    <p className="text-sm font-bold text-gray-800 mt-4">— Maria S. (Verified Client)</p>

                    <div className="absolute inset-0 bg-linear-to-t from-white via-white/90 to-transparent flex items-end justify-center pb-6">
                        <span className="text-sm font-bold text-gray-500 flex items-center gap-2">
                            <LockClosedIcon className="w-4 h-4" /> Get verify and hire first to see more reviews
                        </span>
                    </div>
                </div>

                <VerificationLock
                    title="Reviews & Reputation"
                    Icon={ChatBubbleBottomCenterTextIcon}
                    description="Unverified accounts cannot leave or receive reviews. Complete your verification to build trust with the community and showcase your 5-star service."
                />
            </main>
        );
    }

    // VERIFIED STATE
    return (
        <main className="w-full space-y-6 pb-10">
            <div>
                <h1 className="text-2xl font-bold text-gray-800">Reviews</h1>
                <p className="text-sm text-gray-500 mt-1">Manage the feedback you've given to workers.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Left Column: Rating Summary */}
                <div className="lg:col-span-1">
                    <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm text-center">
                        <h2 className="text-5xl font-extrabold text-gray-900">4.8</h2>
                        <div className="flex text-yellow-400 my-3 justify-center">
                            {[...Array(5)].map((_, i) => <StarIcon key={i} className="w-6 h-6 fill-current" />)}
                        </div>
                        <p className="text-sm text-gray-500 mb-6">Based on {MOCK_REVIEWS.length} reviews given</p>

                        <div className="space-y-3 text-sm border-t border-gray-100 pt-6">
                            <div className="flex items-center gap-3">
                                <span className="w-8 text-gray-600 font-bold">5★</span>
                                <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                                    <div className="bg-green-500 h-2 rounded-full w-[85%]"></div>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className="w-8 text-gray-600 font-bold">4★</span>
                                <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                                    <div className="bg-green-500 h-2 rounded-full w-[10%]"></div>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className="w-8 text-gray-600 font-bold">3★</span>
                                <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                                    <div className="bg-yellow-400 h-2 rounded-full w-[5%]"></div>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className="w-8 text-gray-600 font-bold">2★</span>
                                <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                                    <div className="bg-gray-300 h-2 rounded-full w-0"></div>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className="w-8 text-gray-600 font-bold">1★</span>
                                <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                                    <div className="bg-gray-300 h-2 rounded-full w-0"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column: Review List */}
                <div className="lg:col-span-2 space-y-4">
                    {MOCK_REVIEWS.map((review) => (
                        <div key={review.id} className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                            <div className="flex justify-between items-start mb-3">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                                        {review.workerName.charAt(0)}
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-gray-900 text-sm">{review.service}</h3>
                                        <p className="text-xs text-gray-500">Worker: {review.workerName}</p>
                                    </div>
                                </div>
                                <span className="text-xs text-gray-400 font-medium">{review.date}</span>
                            </div>

                            <div className="flex text-yellow-400 mb-3">
                                {[...Array(5)].map((_, i) => (
                                    <StarIcon
                                        key={i}
                                        className={`w-4 h-4 ${i < review.rating ? 'fill-current' : 'text-gray-300 fill-current'}`}
                                    />
                                ))}
                            </div>

                            <p className="text-gray-700 text-sm leading-relaxed">"{review.comment}"</p>
                        </div>
                    ))}
                </div>

            </div>
        </main>
    );
}