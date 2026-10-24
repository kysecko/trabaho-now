import { GoBackLink } from "../../components/ui/public/PublicUI";

const sections = [
    {
        title: "1. Account Registration",
        content:
            "Users must provide accurate and complete information when creating an account. Users are responsible for keeping their account information up to date and protecting their login credentials.",
    },
    {
        title: "2. Job Posting",
        content: "Employers must provide accurate information about the job, including:",
        bullets: [
            "Job description",
            "Date and time",
            "Location",
            "Service or task required",
        ],
    },
    {
        title: "3. Employee/Worker Information",
        content:
            "Workers must provide truthful information about their skills, services, availability, and profile.",
    },
    {
        title: "4. Same-Day Job",
        content:
            "TrabahoNow is intended primarily for short-term or one-day service opportunities. Users should clearly understand the agreed date, time, location, and service before accepting a job.",
    },
    {
        title: "5. Token System",
        content:
            "Employers may be required to use tokens to send hiring requests. Tokens may be deducted when a request is submitted, subject to the system's rules.",
    },
    {
        title: "6. Cancellation",
        content:
            "Either the employer or worker may cancel a request, subject to the applicable cancellation rules. The system may require:",
        bullets: [
            "Cancellation reason",
            "Notification to the other user",
            "Token refund or non-refund depending on the circumstances",
        ],
    },
    {
        title: "7. Prohibited Activities",
        content: "Users must not:",
        bullets: [
            "Provide false information",
            "Post fake or misleading jobs",
            "Use the platform for illegal activities",
            "Harass or threaten other users",
            "Create multiple fraudulent accounts",
            "Attempt to scam or defraud another user",
            "Misuse another person's personal information",
        ],
    },
    {
        title: "8. Ratings and Reviews",
        content:
            "After a completed transaction, employers and workers may provide ratings and reviews. Reviews must be truthful and must not contain abusive, threatening, discriminatory, or defamatory content.",
    },
    {
        title: "9. Disputes",
        content:
            "If a disagreement occurs regarding a transaction, either party may report the issue through the system. The administration may review available transaction records and supporting information.",
    },
    {
        title: "10. Account Suspension",
        content:
            "TrabahoNow administrators may suspend or terminate accounts involved in fraudulent, abusive, or prohibited activities, subject to the platform's rules and applicable law.",
    },
    {
        title: "11. Acceptance of Terms",
        content:
            "By registering and using TrabahoNow, users confirm that they have read, understood, and agreed to these Terms and Conditions.",
    },
];

export default function Privacy() {
    return (
        <main className="min-h-screen bg-white px-5 py-8">
            <div className="mx-auto max-w-3xl">
                <GoBackLink className="mb-5 rounded-md px-3 py-2 text-sm" />

                <h1 className="text-2xl font-bold text-gray-900">
                    Data Privacy Policy
                </h1>

                <div className="mt-4 space-y-3 text-xs leading-relaxed text-gray-700 sm:text-sm">
                    <section>
                        <h2 className="font-semibold text-gray-900">
                            1. Information We Collect
                        </h2>
                        <p className="mt-1">
                            We may collect information such as your name, email address,
                            contact number, profile details, and transaction information
                            when you use TrabahoNow.
                        </p>
                    </section>

                    <section>
                        <h2 className="font-semibold text-gray-900">
                            2. How We Use Your Information
                        </h2>
                        <p className="mt-1">
                            Your information is used to create your account, connect
                            employers and workers, process hiring requests, send
                            notifications, and manage transactions.
                        </p>
                    </section>

                    <section>
                        <h2 className="font-semibold text-gray-900">
                            3. Information Sharing
                        </h2>
                        <p className="mt-1">
                            Relevant information may be shared with the other party when
                            necessary to facilitate a job or transaction. We do not sell
                            personal information.
                        </p>
                    </section>

                    <section>
                        <h2 className="font-semibold text-gray-900">
                            4. Data Security
                        </h2>
                        <p className="mt-1">
                            We take reasonable measures to protect your personal information
                            from unauthorized access, disclosure, or misuse.
                        </p>
                    </section>

                    <section>
                        <h2 className="font-semibold text-gray-900">
                            5. Your Privacy Rights
                        </h2>
                        <p className="mt-1">
                            Subject to applicable law, you may request access to or
                            correction of your personal information and exercise other
                            applicable data privacy rights.
                        </p>
                    </section>

                    <section>
                        <h2 className="font-semibold text-gray-900">
                            6. Data Retention
                        </h2>
                        <p className="mt-1">
                            Personal information is retained only as long as reasonably
                            necessary for legitimate platform purposes and applicable legal
                            obligations.
                        </p>
                    </section>

                    <section>
                        <h2 className="font-semibold text-gray-900">
                            7. Contact Us
                        </h2>
                        <p className="mt-1">
                            For privacy-related questions or concerns, contact the
                            TrabahoNow administrator through the official contact channel
                            provided on the platform.
                        </p>
                    </section>
                </div>

                <p className="mt-6 border-t border-gray-200 pt-4 text-xs leading-relaxed text-gray-500">
                    TrabahoNow aims to handle personal information in accordance with
                    applicable Philippine data protection laws, including the Data
                    Privacy Act of 2012.
                </p>
            </div>
        </main>
    );
}