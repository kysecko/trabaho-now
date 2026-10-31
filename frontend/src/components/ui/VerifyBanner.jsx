import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function VerifyBanner() {
  const { user } = useAuth();

  if (!user || user.role === "admin" || user.is_verified) return null;

  const isClient = user.role === "client";
  const status = user.verification_status;

  const goal = isClient ? "hire jobseekers" : "offer your services";

  let text = `Verify your identity to ${goal}.`;
  let cta = "Verify now";
  let tone = "bg-orange-50 text-navy";

  if (status === "pending") {
    text = `Your ID is under review. You'll be able to ${goal} once it's approved.`;
    cta = "Check status";
  } else if (status === "rejected") {
    text = "Your verification was rejected. Please submit again.";
    cta = "Resubmit";
    tone = "bg-red-50 text-danger";
  }

  return (
    <div className={`flex flex-wrap items-center justify-between gap-3 px-4 py-3 text-sm ${tone}`}>
      <span>{text}</span>
      <Link to="/dashboard/verify" className="font-semibold text-primary hover:underline">
        {cta}
      </Link>
    </div>
  );
}