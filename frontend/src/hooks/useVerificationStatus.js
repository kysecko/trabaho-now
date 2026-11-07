import { useAuth } from "../context/AuthContext";

// Single source of truth for the verification state shown on the
// dashboard, settings and notifications pages.
// The API sends: "none" | "pending" | "approved" | "rejected".
export function useVerificationStatus() {
  const { user } = useAuth();
  const status = user?.verification_status ?? "none";
  const isVerified = user?.is_verified === true || status === "approved";

  return {
    status,
    isVerified,
    isPending: !isVerified && status === "pending",
    isRejected: !isVerified && status === "rejected",
    rejectionReason: user?.rejection_reason ?? null,
  };
}