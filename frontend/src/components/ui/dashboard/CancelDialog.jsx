import { useEffect, useRef, useState } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";

const REASONS = {
  client: [
    "Schedule changed",
    "Worker unavailable",
    "Found someone else",
    "Booked by mistake",
    "Other",
  ],
  jobseeker: [
    "Emergency",
    "Transport unavailable",
    "Client unresponsive",
    "Scheduling conflict",
    "Other",
  ],
  admin: ["Dispute", "Policy violation", "Safety concern", "Other"],
};

export default function CancelDialog({
  open,
  role = "client",
  busy = false,
  onClose,
  onConfirm,
}) {
  const [reason, setReason] = useState("");
  const [note, setNote] = useState("");
  const ref = useRef(null);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    ref.current?.focus();
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  useEffect(() => {
    if (open) {
      setReason("");
      setNote("");
    }
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div
        ref={ref}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-labelledby="cancel-title"
        className="relative w-full max-w-md rounded-t-2xl bg-white p-6 shadow-2xl outline-none sm:rounded-2xl"
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute right-4 top-4 rounded-full p-1 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600"
        >
          <XMarkIcon className="h-5 w-5" />
        </button>

        <h2 id="cancel-title" className="text-xl font-bold text-navy">
          Cancel this request?
        </h2>
        <p className="mt-1 text-sm text-muted">
          Pick a reason. {role === "jobseeker"
            ? "The client will be refunded and notified."
            : "The worker will be notified."}
        </p>

        <div
          className="mt-4 flex flex-wrap gap-2"
          role="group"
          aria-label="Reason for cancelling"
        >
          {REASONS[role].map((r) => (
            <button
              key={r}
              type="button"
              aria-pressed={reason === r}
              onClick={() => setReason(reason === r ? "" : r)}
              className={`rounded-full border px-3 py-1.5 text-sm font-medium transition ${
                reason === r
                  ? "border-primary bg-primary-soft text-primary"
                  : "border-gray-300 bg-white text-gray-700 hover:border-gray-400"
              }`}
            >
              {r}
            </button>
          ))}
        </div>

        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          rows={3}
          placeholder="Add details (optional)"
          className="mt-4 w-full resize-none rounded-xl border border-gray-300 p-3 text-sm focus-visible:outline-2 focus-visible:outline-primary"
        />

        <div className="mt-6 flex gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 rounded-xl border border-gray-300 bg-white py-2.5 text-sm font-bold text-gray-700 transition hover:bg-gray-50"
          >
            Keep request
          </button>
          <button
            type="button"
            disabled={!reason || busy}
            onClick={() => onConfirm({ reason, note })}
            className="flex-1 rounded-xl bg-red-600 py-2.5 text-sm font-bold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {busy ? "Cancelling…" : "Cancel request"}
          </button>
        </div>
      </div>
    </div>
  );
}