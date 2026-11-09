import { useNavigate } from "react-router-dom";
import { ClockIcon, ExclamationTriangleIcon, LockClosedIcon } from "@heroicons/react/24/outline";
import Button from "../Button";
import { useVerificationStatus } from "../../../hooks/useVerificationStatus";

/**
 * One locked screen for every jobseeker page that needs a verified account.
 * It shows the right message for: never submitted / under review / rejected.
 */
export default function LockedState({
    icon: Icon = LockClosedIcon,
    title = "This page is locked",
    text = "Verify your identity to unlock this page.",
}) {
    const navigate = useNavigate();
    const { isPending, isRejected, rejectionReason } = useVerificationStatus();

    const view = isPending
        ? {
            Icon: ClockIcon,
            tone: "bg-yellow-50 text-yellow-600",
            title: "Verification under review",
            text: "We’re reviewing your ID. This usually takes 24–48 hours, and this page unlocks as soon as you’re approved.",
            cta: "Check status",
            to: "/verify/pending",
        }
        : isRejected
            ? {
                Icon: ExclamationTriangleIcon,
                tone: "bg-red-50 text-red-600",
                title: "Verification not approved",
                text: rejectionReason || "Please review your details and submit again.",
                cta: "Resubmit verification",
                to: "/verify/start",
            }
            : { Icon, tone: "bg-gray-100 text-gray-400", title, text, cta: "Verify now", to: "/verify" };

    return (
        <div className="mx-auto flex min-h-[60vh] max-w-md flex-col items-center justify-center p-6 text-center">
            <div className={`mb-4 flex h-20 w-20 items-center justify-center rounded-full ${view.tone}`}>
                <view.Icon className="h-10 w-10" />
            </div>
            <h2 className="mb-2 text-xl font-bold text-navy">{view.title}</h2>
            <p className="mb-6 text-sm text-muted">{view.text}</p>
            <Button onClick={() => navigate(view.to)}>{view.cta}</Button>
        </div>
    );
}