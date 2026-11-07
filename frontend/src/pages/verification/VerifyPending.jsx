import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ClockIcon, XCircleIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../../context/AuthContext';
import echo from '../../lib/echo';

export default function VerifyPending() {
  const navigate = useNavigate();
  const { user, refreshUser } = useAuth();
  const hasRedirected = useRef(false);

  // 1. Listen for real-time verification events
  useEffect(() => {
    if (!user?.id) return;

    const channel = echo.private(`user.${user.id}`);

    channel.listen('.UserVerified', async () => {
      console.log('✅ Verification approved via WebSocket');
      await refreshUser();
    });

    channel.listen('.UserRejected', async () => {
      console.log('❌ Verification rejected via WebSocket');
      await refreshUser();
    });

    return () => {
      echo.leave(`user.${user.id}`);
    };
  }, [user?.id, refreshUser]);

  // 2. Poll as a fallback in case WebSocket fails
  useEffect(() => {
    const interval = setInterval(() => {
      refreshUser();
    }, 60000); // every 60s
    return () => clearInterval(interval);
  }, [refreshUser]);

  // 3. Redirect based on status
  useEffect(() => {
    if (!user || hasRedirected.current) return;

    const isVerified =
      user?.is_verified === true || user?.verification_status === 'approved';

    if (isVerified) {
      hasRedirected.current = true;
      const dest = user.role === 'jobseeker' ? '/jobseeker/dashboard' : '/client/dashboard';
      navigate(dest, { replace: true });
    }
  }, [user, navigate]);

  // 4. Show rejection screen if rejected
  if (user?.verification_status === 'rejected') {
    return (
      <div className="max-w-xl mx-auto py-20 px-4 text-center">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-10">
          <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <XCircleIcon className="w-10 h-10 text-red-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Verification Rejected</h1>
          <p className="text-gray-500 mb-4">
            Unfortunately, your verification could not be approved.
          </p>
          {user?.rejection_reason && (
            <div className="mb-6 rounded-lg bg-red-50 p-3 text-sm text-red-700 text-left">
              <strong>Reason:</strong> {user.rejection_reason}
            </div>
          )}
          <button
            onClick={() => navigate('/verify')}
            className="w-full bg-[#ff4d00] hover:bg-[#e64500] text-white font-bold py-3 rounded-xl"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  // 5. Default: Pending screen
  return (
    <div className="max-w-xl mx-auto py-20 px-4 text-center">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-10">
        <div className="w-20 h-20 bg-orange-50 rounded-full flex items-center justify-center mx-auto mb-6">
          <ClockIcon className="w-10 h-10 text-[#ff4d00]" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Verification in Progress
        </h1>
        <p className="text-gray-500 mb-8">
          Your documents are being reviewed. You'll be redirected automatically as soon as you're approved.
        </p>
        <button
          onClick={() => navigate(`/${user?.role}/dashboard`)}
          className="w-full bg-[#ff4d00] hover:bg-[#e64500] text-white font-bold py-3 rounded-xl"
        >
          Return to Dashboard
        </button>
      </div>
    </div>
  );
}