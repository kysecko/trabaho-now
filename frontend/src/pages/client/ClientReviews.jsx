import React, { useState } from 'react';
import { StarIcon, LockClosedIcon, ChatBubbleBottomCenterTextIcon, ArrowUturnLeftIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../../context/AuthContext';
import VerificationLock from '../../components/ui/VerificationLock';

// Mock Data for Reviews Given (Client reviewing a worker)
const MOCK_REVIEWS_GIVEN = [
    {
        id: 1,
        name: "Juan Dela Cruz",
        role: "Worker",
        service: "Aircon Cleaning",
        date: "Nov 2, 2026",
        rating: 5,
        comment: "Excellent service! Juan arrived on time and did a very thorough job cleaning my aircon. Highly recommended!"
    },
    {
        id: 2,
        name: "Pedro Reyes",
        role: "Worker",
        service: "Carpentry Work",
        date: "Oct 25, 2026",
        rating: 4,
        comment: "Good work overall. There was a slight delay but the finished product was solid. Will book again."
    }
];

// Mock Data for Reviews Received (Workers reviewing the client)
const MOCK_REVIEWS_RECEIVED = [
    {
        id: 3,
        name: "Maria Santos",
        role: "Worker",
        service: "Plumbing Repair",
        date: "Nov 1, 2026",
        rating: 5,
        comment: "Great client! Very clear with instructions and paid immediately upon completion. A pleasure to work with."
    }
];

export default function ClientReviews() {
    const { user } = useAuth();
    
    // State for active tab
    const [activeTab, setActiveTab] = useState('received');

    // Check for snake_case from your Laravel backend
    const isVerified = user?.verification_status === 'approved' || user?.is_verified === true;

    // LOCKED STATE
    if (!isVerified) {
        return (
            <main className="w-full space-y-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Reviews</h1>
                    <p className="text-sm text-gray-500 mt-1">Manage the feedback you give and receive.</p>
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
                            <LockClosedIcon className="w-4 h-4" /> Get verified and hire first to see reviews
                        </span>
                    </div>
                </div>

                <VerificationLock
                    title="Reviews & Reputation"
                    Icon={ChatBubbleBottomCenterTextIcon}
                    description="Unverified accounts cannot leave or receive reviews. Complete your verification to build trust with the community."
                />
            </main>
        );
    }

    // VERIFIED STATE
    return (
        <main className="w-full space-y-6 pb-10">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Reviews</h1>
                <p className="text-sm text-gray-500 mt-1">Manage the feedback you give and receive.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Left Column: Rating Summary */}
                <div className="lg:col-span-1">
                    <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm text-center sticky top-24">
                        <h2 className="text-5xl font-extrabold text-gray-900">
                            {activeTab === 'received' ? '5.0' : '4.8'}
                        </h2>
                        <div className="flex text-yellow-400 my-3 justify-center">
                            {[...Array(5)].map((_, i) => <StarIcon key={i} className="w-6 h-6 fill-current" />)}
                        </div>
                        <p className="text-sm text-gray-500 mb-6">
                            Based on {activeTab === 'received' ? MOCK_REVIEWS_RECEIVED.length : MOCK_REVIEWS_GIVEN.length} reviews {activeTab === 'received' ? 'received' : 'given'}
                        </p>

                        <div className="space-y-3 text-sm border-t border-gray-100 pt-6">
                            <div className="flex items-center gap-3">
                                <span className="w-8 text-gray-600 font-bold">5★</span>
                                <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                                    <div className="bg-green-500 h-2 rounded-full w-[90%]"></div>
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
                                    <div className="bg-yellow-400 h-2 rounded-full w-0"></div>
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

                {/* Right Column: Tabs & Review List */}
                <div className="lg:col-span-2 space-y-4">
                    
                    {/* Tabs */}
                    <div className="flex gap-2 mb-2">
                        <button 
                            onClick={() => setActiveTab('received')}
                            className={`px-5 py-2 rounded-full text-sm font-bold border transition ${
                                activeTab === 'received' 
                                    ? 'border-[#ff4d00] bg-[#ff4d00] text-white' 
                                    : 'border-gray-300 bg-white text-gray-600 hover:border-gray-400'
                            }`}
                        >
                            Reviews Received ({MOCK_REVIEWS_RECEIVED.length})
                        </button>
                        <button 
                            onClick={() => setActiveTab('given')}
                            className={`px-5 py-2 rounded-full text-sm font-bold border transition ${
                                activeTab === 'given' 
                                    ? 'border-[#ff4d00] bg-[#ff4d00] text-white' 
                                    : 'border-gray-300 bg-white text-gray-600 hover:border-gray-400'
                            }`}
                        >
                            Reviews Given ({MOCK_REVIEWS_GIVEN.length})
                        </button>
                    </div>

                    {/* Render Received Reviews */}
                    {activeTab === 'received' && MOCK_REVIEWS_RECEIVED.map((review) => (
                        <div key={review.id} className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                            <div className="flex justify-between items-start mb-3">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-[#ff4d00]/10 text-[#ff4d00] flex items-center justify-center font-bold">
                                        {review.name.charAt(0)}
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-gray-900 text-sm">{review.service}</h3>
                                        <p className="text-xs text-gray-500">From Worker: {review.name}</p>
                                    </div>
                                </div>
                                <span className="text-xs text-gray-400 font-medium">{review.date}</span>
                            </div>

                            <div className="flex text-yellow-400 mb-3">
                                {[...Array(5)].map((_, i) => (
                                    <StarIcon key={i} className={`w-4 h-4 ${i < review.rating ? 'fill-current' : 'text-gray-300 fill-current'}`} />
                                ))}
                            </div>

                            <p className="text-gray-700 text-sm leading-relaxed mb-4">"{review.comment}"</p>
                            
                            <button className="inline-flex items-center gap-1 text-xs font-bold text-gray-500 hover:text-[#ff4d00]">
                                <ArrowUturnLeftIcon className="w-4 h-4" /> Reply to {review.name.split(' ')[0]}
                            </button>
                        </div>
                    ))}

                    {/* Render Given Reviews */}
                    {activeTab === 'given' && MOCK_REVIEWS_GIVEN.map((review) => (
                        <div key={review.id} className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                            <div className="flex justify-between items-start mb-3">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                                        {review.name.charAt(0)}
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-gray-900 text-sm">{review.service}</h3>
                                        <p className="text-xs text-gray-500">To Worker: {review.name}</p>
                                    </div>
                                </div>
                                <span className="text-xs text-gray-400 font-medium">{review.date}</span>
                            </div>

                            <div className="flex text-yellow-400 mb-3">
                                {[...Array(5)].map((_, i) => (
                                    <StarIcon key={i} className={`w-4 h-4 ${i < review.rating ? 'fill-current' : 'text-gray-300 fill-current'}`} />
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