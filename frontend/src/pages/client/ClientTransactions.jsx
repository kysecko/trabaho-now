import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  WalletIcon, 
  ArrowDownLeftIcon,
  PlusIcon,
  LockClosedIcon,
  GiftIcon,
  XMarkIcon,
  SparklesIcon,
  WrenchScrewdriverIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '../../context/AuthContext';
import VerificationLock from '../../components/ui/VerificationLock';

// Mock Data for Top-up transactions
const MOCK_TOPUPS = [
  { id: 1, title: "Top-up via GCash", amount: 2000, date: "Oct 22, 2026", status: "completed" },
  { id: 2, title: "Top-up via GCash", amount: 1500, date: "Oct 18, 2026", status: "completed" },
];

// Mock Data for Hiring transactions
const MOCK_HIRING = [
  { id: 1, title: "Hired Mang Benny (Plumbing)", amount: 500, date: "Oct 24, 2026", status: "completed" },
  { id: 2, title: "Hired Mang Rolan (Aircon)", amount: 800, date: "Oct 20, 2026", status: "completed" },
  { id: 3, title: "Hired Kuya Jun (Carpentry)", amount: 1200, date: "Oct 15, 2026", status: "completed" },
];

export default function ClientTransactions() {
    const { user } = useAuth();
    const navigate = useNavigate();
    
    // Check verification status
    const isVerified = user?.verification_status === 'approved' || user?.is_verified === true;

    // State to track if the user has dismissed the welcome banner
    const [showWelcomeBanner, setShowWelcomeBanner] = useState(true);

    // --- LOCKED STATE ---
    if (!isVerified) {
        return (
            <main className="w-full space-y-6 pb-10">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">My Credits</h1>
                    <p className="text-sm text-gray-500 mt-1">Manage your credits and view your usage history.</p>
                </div>

                <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-gray-800 to-gray-900 p-8 text-white shadow-xl">
                    <div className="absolute -right-10 -top-10 h-48 w-48 rounded-full bg-white/5 blur-2xl"></div>
                    <p className="text-sm font-medium text-gray-400 mb-1">Available Credits</p>
                    <h2 className="text-4xl font-extrabold tracking-tight blur-sm select-none">1,250 Credits</h2>
                    
                    <div className="mt-8 flex items-center gap-2 rounded-lg bg-white/10 px-4 py-2 text-sm font-semibold w-fit backdrop-blur-md">
                        <LockClosedIcon className="w-4 h-4" />
                        Locked
                    </div>
                </div>

                <VerificationLock
                    title="Credits & History"
                    Icon={WalletIcon}
                    description="To ensure secure transactions and prevent fraud, you must verify your identity before you can top-up your credits, hire workers, or view your usage history."
                />
            </main>
        );
    }

    // --- VERIFIED STATE ---
    return (
        <main className="w-full space-y-8 pb-10">
            
            {/* Header with Buy Credits Button on the Right */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">My Credits</h1>
                    <p className="text-sm text-gray-500 mt-1">Manage your credits and review your usage history.</p>
                </div>
                <button className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#ff4d00] px-5 py-2.5 text-sm font-bold text-white transition hover:bg-[#e64500] shadow-sm">
                    <PlusIcon className="h-5 w-5" />
                    Buy Credits
                </button>
            </div>

            {/* 🎁 WELCOME BANNER */}
            {showWelcomeBanner && (
                <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-orange-400 to-[#ff4d00] p-6 sm:p-8 text-white shadow-lg">
                    <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/20 blur-2xl"></div>
                    <div className="absolute -left-10 -bottom-10 h-40 w-40 rounded-full bg-black/10 blur-2xl"></div>
                    
                    <button 
                        onClick={() => setShowWelcomeBanner(false)}
                        className="absolute top-4 right-4 rounded-full bg-white/20 p-1 hover:bg-white/30 transition-colors cursor-pointer"
                    >
                        <XMarkIcon className="w-5 h-5" />
                    </button>

                    <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center gap-6">
                        <div className="bg-white/20 p-4 rounded-full shrink-0">
                            <GiftIcon className="w-8 h-8 text-white" />
                        </div>
                        <div className="flex-1">
                            <h2 className="text-xl font-extrabold mb-1 flex items-center gap-2">
                                Welcome to TrabahoNow! <SparklesIcon className="w-5 h-5 text-yellow-300" />
                            </h2>
                            <p className="text-white/90 text-sm sm:text-base leading-relaxed">
                                To kickstart your hiring journey, we've given you a special promo: <strong>500 Free Credits</strong>. 
                                Use them to hire your first worker today! 
                                <span className="block mt-1 font-semibold underline cursor-pointer" onClick={() => navigate('/client/search')}>
                                    Find a worker to use your free credits →
                                </span>
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* WALLET BALANCE CARD (Simplified) */}
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#101e32] to-[#1b2b45] p-6 text-white shadow-xl">
                <div className="flex justify-between items-start">
                    <div>
                        <p className="text-sm font-medium text-gray-400">Available Credits</p>
                        <h2 className="text-3xl font-extrabold tracking-tight mt-1">
                            {showWelcomeBanner ? "1,750" : "1,250"} <span className="text-lg font-medium text-gray-400">Credits</span>
                        </h2>
                    </div>
                    <div className="rounded-full bg-white/10 p-2">
                        <WalletIcon className="h-6 w-6 text-white" />
                    </div>
                </div>
            </div>

            {/* TWO SEPARATE TABLES */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                
                {/* 1. Top-up History */}
                <div className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden flex flex-col">
                    <div className="border-b border-gray-100 p-5 flex justify-between items-center bg-gray-50/50">
                        <div className="flex items-center gap-2">
                            <ArrowDownLeftIcon className="w-5 h-5 text-green-600" />
                            <h3 className="text-lg font-bold text-gray-900">Credits Added</h3>
                        </div>
                    </div>
                    
                    <div className="divide-y divide-gray-100 flex-1">
                        {/* Welcome Bonus Transaction */}
                        {showWelcomeBanner && (
                            <div className="flex items-center justify-between p-4 bg-orange-50/30 transition-colors">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-orange-100 text-[#ff4d00]">
                                        <GiftIcon className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-gray-900">Welcome Promo</p>
                                        <p className="text-xs text-gray-500 mt-0.5">Just now</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm font-bold text-[#ff4d00]">+ 500</p>
                                    <span className="text-[10px] font-bold text-[#ff4d00] uppercase">Promo</span>
                                </div>
                            </div>
                        )}

                        {/* Regular Top-ups */}
                        {MOCK_TOPUPS.map((tx) => (
                            <div key={tx.id} className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-green-50 text-green-600">
                                        <ArrowDownLeftIcon className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-gray-900">{tx.title}</p>
                                        <p className="text-xs text-gray-500 mt-0.5">{tx.date}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm font-bold text-green-600">+ {tx.amount}</p>
                                    <span className="text-[10px] font-bold text-gray-400 uppercase">Top Up</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* 2. Hiring History */}
                <div className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden flex flex-col">
                    <div className="border-b border-gray-100 p-5 flex justify-between items-center bg-gray-50/50">
                        <div className="flex items-center gap-2">
                            <WrenchScrewdriverIcon className="w-5 h-5 text-blue-600" />
                            <h3 className="text-lg font-bold text-gray-900">Credits Spent (Hiring)</h3>
                        </div>
                    </div>
                    
                    <div className="divide-y divide-gray-100 flex-1">
                        {MOCK_HIRING.map((tx) => (
                            <div key={tx.id} className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                                        <WrenchScrewdriverIcon className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-gray-900">{tx.title}</p>
                                        <p className="text-xs text-gray-500 mt-0.5">{tx.date}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm font-bold text-gray-900">- {tx.amount}</p>
                                    <span className="text-[10px] font-bold text-gray-400 uppercase">Hiring</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </main>
    );
}