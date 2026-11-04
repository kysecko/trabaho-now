import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  XMarkIcon,
  ExclamationTriangleIcon,
  ClockIcon,
} from "@heroicons/react/24/outline";

/**
 * Shown when an unverified client tries to hire (Quick hire).
 * - Not verified yet  -> "Verification Required" with Cancel / Get Verified
 * - ID already pending -> "Verification in progress" with a single Okay button
 *
 * Put it at: src/components/ui/VerifyRequiredModal.jsx
 */
export default function VerifyRequiredModal({ open, onClose, pending = false }) {
  const navigate = useNavigate();

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  const Icon = pending ? ClockIcon : ExclamationTriangleIcon;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="verify-modal-title"
        className="relative w-full max-w-md overflow-hidden rounded-2xl bg-white p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-200"
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute right-4 top-4 rounded-full p-1 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600"
        >
          <XMarkIcon className="h-5 w-5" />
        </button>

        <div className="flex flex-col items-center text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-orange-50">
            <Icon className="h-8 w-8 text-primary" />
          </div>

          <h3 id="verify-modal-title" className="mb-2 text-xl font-bold text-gray-900">
            {pending ? "Verification in progress" : "Verification Required"}
          </h3>

          <p className="mb-6 text-sm leading-relaxed text-gray-500">
            {pending
              ? "Your ID is still under review. You can hire workers and send booking requests once it’s approved, usually within 24–48 hours."
              : "To keep our community safe, you must verify your identity before hiring workers or sending booking requests."}
          </p>

          {pending ? (
            <button
              type="button"
              onClick={onClose}
              className="w-full rounded-xl bg-primary py-2.5 text-sm font-bold text-white transition hover:bg-primary-hover"
            >
              Okay
            </button>
          ) : (
            <div className="flex w-full gap-3">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 rounded-xl border border-gray-300 bg-white py-2.5 text-sm font-bold text-gray-700 transition hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => navigate("/verify")}
                className="flex-1 rounded-xl bg-primary py-2.5 text-sm font-bold text-white transition hover:bg-primary-hover"
              >
                Get Verified
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}