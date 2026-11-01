import React from 'react';
import { CreditCardIcon, LockClosedIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../../context/AuthContext';
import VerificationLock from '../../components/ui/VerificationLock';

export default function ClientTransactions() {
    const { user } = useAuth();
    const isVerified = user?.kycStatus === 'approved' || user?.isVerified === true;

    if (!isVerified) {
        return (
            <main className="w-full space-y-6">

                <h1 className="text-2xl font-bold mb-6 text-gray-800">Transactions</h1>
                <div className="mb-6 p-6 bg-linear-to-r from-gray-800 to-gray-900 rounded-xl text-white flex justify-between items-center shadow-md">
                    <div>
                        <p className="text-gray-400 text-sm mb-1">Available Credit Balance</p>
                        <h2 className="text-3xl font-bold blur-sm select-none">₱ 1,250.00</h2>
                    </div>
                    <div className="flex items-center gap-2 text-sm font-semibold bg-white/20 px-3 py-1.5 rounded-lg">
                        <LockClosedIcon className="w-4 h-4" />
                        Locked
                    </div>
                </div>
                <VerificationLock
                    title="Transactions"
                    Icon={CreditCardIcon}
                    description="Financial transactions are restricted to verified accounts to prevent fraud. Verify your ID to cash in, withdraw, and pay workers securely."
                />
            </main>
        );
    }

    return (
        <main className="w-full space-y-6">
            <h1 className="text-2xl font-bold mb-6 text-gray-800">Transactions</h1>
            <div className="mb-6 p-6 bg-linear-to-r from-navy to-navy-2 rounded-xl text-white flex justify-between items-center shadow-md">
                <div>
                    <p className="text-gray-300 text-sm mb-1">Available Credit Balance</p>
                    <h2 className="text-3xl font-bold">₱ 1,250.00</h2>
                </div>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                <h3 className="font-bold text-gray-800 mb-4">Recent Transactions</h3>
            </div>
        </main>
    );
}