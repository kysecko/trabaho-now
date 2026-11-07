import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeftIcon, ArrowRightIcon } from "@heroicons/react/24/solid";

export default function VerifyStart() {
  const navigate = useNavigate();
  const [agreed, setAgreed] = useState(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);

  const handleContinue = () => {
    const role = localStorage.getItem('verifying_role');

    // THE FORK: Route them based on their role
    if (role === 'jobseeker') {
      navigate('/verify/jobseeker/personal'); // Jobseeker Step 1
    } else {
      navigate('/verify/client/personal');    // Client Step 1
    }
  };

  return (
    <>
      <div className="max-w-3xl mx-auto py-10 px-4">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
          <h1 className="text-xl font-bold text-gray-900 mb-6">
            Get verified to start hiring workers or get hired.
          </h1>

          {/* <div>
            <h2>Data privacy consent.</h2>
          </div> */}

          <div className="text-sm text-gray-600 space-y-4 mb-8">
            <p>
              By creating an account on{" "}
              <span className="font-bold">TrabahoNow</span>, you consent to the
              collection and processing of your personal information in accordance
              with the <span className="font-bold">Data Privacy Act of 2012</span> (RA 10173). Your data will be used
              to facilitate service connections, manage your account, and improve
              our platform.
            </p>

            <p>
              <span className="font-bold">TrabahoNow</span> has zero tolerance for
              objectionable content and abusive behavior. By continuing, you accept
              these standards, as outlined in the Acceptable Use section of our
              Terms and Conditions. Content and users that violate these standards
              may be removed or banned.

              You can report or block anyone at any time.{" "}
              <span className="font-bold">TrabahoNow</span> reviews reports and
              takes appropriate action.

              You may withdraw your consent at any time through your Privacy Center.
              For more details, please see our Privacy Policy.
            </p>
          </div>

          <div className="flex items-center justify-start gap-3 p-4 border border-gray-200 rounded-lg bg-gray-50 mb-8">
            <input type="checkbox" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} className="w-4 h-4 accent-[#ff4d00] rounded border-gray-300 cursor-pointer" />
            <span className="text-sm text-gray-700">
              I have read and agreed to the{" "}
              <button type="button" onClick={() => setShowPrivacyModal(true)} className="text-[#ff4d00] font-bold hover:underline">Data Privacy Policy</button>
              {" "}and{" "}
              <button type="button" onClick={() => setShowTermsModal(true)} className="text-[#ff4d00] font-bold hover:underline">Terms and Conditions</button>.
            </span>
          </div>

          <div className="flex items-center justify-end gap-4">
            <button type="button" onClick={() => navigate(-1)} className="flex items-center justify-center gap-2 px-6 py-2 border border-gray-300 rounded-lg font-bold text-gray-700 hover:bg-gray-50 cursor-pointer">
              <ArrowLeftIcon className="w-4 h-4" /> Back
            </button>
            <button type="button" onClick={handleContinue} disabled={!agreed} className="flex items-center justify-center gap-2 px-6 py-2 bg-[#ff4d00] hover:bg-[#e64500] disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-bold rounded-lg cursor-pointer">
              I agree - continue <ArrowRightIcon className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* DATA PRIVACY POLICY MODAL */}
      {showPrivacyModal && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => setShowPrivacyModal(false)}
        >
          <div
            className="bg-white rounded-xl shadow-xl max-w-3xl w-full max-h-[85vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-5 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-900">
                Data Privacy Policy
              </h2>

              <button
                type="button"
                onClick={() => setShowPrivacyModal(false)}
                className="text-gray-400 hover:text-gray-700 text-2xl"
              >
                &times;
              </button>
            </div>

            <div className="p-6 overflow-y-auto text-sm text-gray-700 leading-relaxed space-y-5">
              <section>
                <h3 className="font-bold text-gray-900">
                  1. Information We Collect
                </h3>
                <p className="mt-1">
                  We may collect information such as your name, email address,
                  contact number, profile details, and transaction information
                  when you use TrabahoNow.
                </p>
              </section>

              <section>
                <h3 className="font-bold text-gray-900">
                  2. How We Use Your Information
                </h3>
                <p className="mt-1">
                  Your information is used to create your account, connect
                  employers and workers, process hiring requests, send
                  notifications, and manage transactions.
                </p>
              </section>

              <section>
                <h3 className="font-bold text-gray-900">
                  3. Information Sharing
                </h3>
                <p className="mt-1">
                  Relevant information may be shared with the other party
                  when necessary to facilitate a job or transaction. We do
                  not sell personal information.
                </p>
              </section>

              <section>
                <h3 className="font-bold text-gray-900">
                  4. Data Security
                </h3>
                <p className="mt-1">
                  We take reasonable measures to protect your personal
                  information from unauthorized access, disclosure, or misuse.
                </p>
              </section>

              <section>
                <h3 className="font-bold text-gray-900">
                  5. Your Privacy Rights
                </h3>
                <p className="mt-1">
                  Subject to applicable law, you may request access to or
                  correction of your personal information and exercise other
                  applicable data privacy rights.
                </p>
              </section>

              <section>
                <h3 className="font-bold text-gray-900">
                  6. Data Retention
                </h3>
                <p className="mt-1">
                  Personal information is retained only as long as reasonably
                  necessary for legitimate platform purposes and applicable
                  legal obligations.
                </p>
              </section>

              <section>
                <h3 className="font-bold text-gray-900">
                  7. Third-Party Services
                </h3>
                <p className="mt-1">
                  We may share necessary information with third-party identity
                  verification and security providers to verify user identities
                  and protect accounts.
                </p>
              </section>

              <section>
                <h3 className="font-bold text-gray-900">
                  8. Contact Us
                </h3>
                <p className="mt-1">
                  For privacy-related questions or concerns, contact the
                  TrabahoNow administrator through the official contact channel
                  provided on the platform.
                </p>
              </section>

              <p className="border-t border-gray-200 pt-4 text-xs text-gray-500">
                TrabahoNow aims to handle personal information in accordance
                with applicable Philippine data protection laws, including
                the Data Privacy Act of 2012 (RA 10173).
              </p>
            </div>

            <div className="border-t border-gray-200 p-4 flex justify-end">
              <button
                type="button"
                onClick={() => setShowPrivacyModal(false)}
                className="px-5 py-2 bg-[#ff4d00] hover:bg-[#e64500] text-white cursor-pointer rounded-lg font-semibold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TERMS AND CONDITIONS MODAL */}
      {showTermsModal && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => setShowTermsModal(false)}
        >
          <div
            className="bg-white rounded-xl shadow-xl max-w-3xl w-full max-h-[85vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-5 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-900">
                Terms and Conditions
              </h2>

              <button
                type="button"
                onClick={() => setShowTermsModal(false)}
                className="text-gray-400 hover:text-gray-700 text-2xl"
              >
                &times;
              </button>
            </div>

            <div className="p-6 overflow-y-auto text-sm text-gray-700 leading-relaxed space-y-5">
              <section>
                <h3 className="font-bold text-gray-900">
                  1. Acceptance of Terms
                </h3>
                <p className="mt-1">
                  By creating an account or using TrabahoNow, you agree to
                  follow these Terms and Conditions. If you do not agree,
                  please do not use the platform.
                </p>
              </section>

              <section>
                <h3 className="font-bold text-gray-900">
                  2. Account Registration
                </h3>
                <p className="mt-1">
                  Users must provide accurate information when registering
                  and keep their account details up to date. You are
                  responsible for activities performed through your account.
                </p>
              </section>

              <section>
                <h3 className="font-bold text-gray-900">
                  3. Use of TrabahoNow
                </h3>
                <p className="mt-1">
                  TrabahoNow connects employers with workers for local jobs
                  and services. Users must use the platform responsibly and
                  provide truthful information.
                </p>
              </section>

              <section>
                <h3 className="font-bold text-gray-900">
                  4. Employer Responsibilities
                </h3>
                <p className="mt-1">
                  Employers must provide accurate job descriptions, schedules,
                  locations, and payment arrangements. Employers should
                  communicate any changes to workers promptly.
                </p>
              </section>

              <section>
                <h3 className="font-bold text-gray-900">
                  5. Worker Responsibilities
                </h3>
                <p className="mt-1">
                  Workers must accurately represent their skills and
                  availability, communicate professionally, and make
                  reasonable efforts to complete accepted jobs as agreed.
                </p>
              </section>

              <section>
                <h3 className="font-bold text-gray-900">
                  6. Hiring Requests and Tokens
                </h3>
                <p className="mt-1">
                  Some platform features may require tokens to send hiring
                  requests. Any token deductions, expiration rules, or refunds
                  will be governed by the rules displayed when using that feature.
                </p>
              </section>

              <section>
                <h3 className="font-bold text-gray-900">
                  7. Cancellations
                </h3>
                <p className="mt-1">
                  Users must follow the platform's cancellation procedures
                  and provide truthful reasons when requested. Any applicable
                  refund or token return depends on the stated rules and
                  circumstances.
                </p>
              </section>

              <section>
                <h3 className="font-bold text-gray-900">
                  8. Prohibited Activities
                </h3>
                <p className="mt-1">Users must not:</p>
                <ul className="mt-2 list-disc pl-5 space-y-1">
                  <li>Post fraudulent or misleading jobs.</li>
                  <li>Harass, threaten, or discriminate against other users.</li>
                  <li>Misuse another person's personal information.</li>
                  <li>Manipulate ratings, reviews, or token transactions.</li>
                  <li>Attempt unauthorized access to the platform.</li>
                  <li>Use TrabahoNow for unlawful activities.</li>
                </ul>
              </section>

              <section>
                <h3 className="font-bold text-gray-900">
                  9. Ratings and Reviews
                </h3>
                <p className="mt-1">
                  Ratings and reviews must reflect genuine experiences and
                  must not contain threats, harassment, or knowingly false
                  statements.
                </p>
              </section>

              <section>
                <h3 className="font-bold text-gray-900">
                  10. Disputes and Account Suspension
                </h3>
                <p className="mt-1">
                  Users may report disputes or suspicious activity to the
                  administration. TrabahoNow may investigate reported
                  violations and restrict accounts when reasonably necessary,
                  subject to applicable law.
                </p>
              </section>

              <section>
                <h3 className="font-bold text-gray-900">
                  11. Privacy
                </h3>
                <p className="mt-1">
                  The collection and use of personal information are described
                  in our Data Privacy Policy.
                </p>
              </section>

              <section>
                <h3 className="font-bold text-gray-900">
                  12. Changes to These Terms
                </h3>
                <p className="mt-1">
                  We may update these Terms as the platform evolves.
                  Updated versions will be published on this page.
                </p>
              </section>

              <section>
                <h3 className="font-bold text-gray-900">
                  13. Contact and Governing Law
                </h3>
                <p className="mt-1">
                  These Terms are intended to be interpreted under applicable
                  Philippine law. For questions, contact the TrabahoNow
                  administrator through the platform's official contact channel.
                </p>
              </section>
            </div>

            <div className="border-t border-gray-200 p-4 flex justify-end">
              <button
                type="button"
                onClick={() => setShowTermsModal(false)}
                className="px-5 py-2 bg-[#ff4d00] hover:bg-[#e64500] text-white cursor-pointer rounded-lg font-semibold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
