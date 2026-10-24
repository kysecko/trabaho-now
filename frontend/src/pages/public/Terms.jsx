import { Link } from "react-router-dom";
import { GoBackLink } from "../../components/ui/public/PublicUI";

export default function Terms() {
  return (
    <main className="min-h-screen bg-white px-5 py-8">
      <div className="mx-auto max-w-3xl">
        <GoBackLink className="mb-5 rounded-md px-2 py-1 text-sm" />

        <h1 className="text-2xl font-bold text-gray-900">
          Terms and Conditions
        </h1>

        <div className="mt-4 space-y-3 text-xs leading-relaxed text-gray-700 sm:text-sm">
          <section>
            <h2 className="font-semibold text-gray-900">
              1. Acceptance of Terms
            </h2>
            <p className="mt-1">
              By creating an account or using TrabahoNow, you agree to follow
              these Terms and Conditions. If you do not agree, please do not
              use the platform.
            </p>
          </section>

          <section>
            <h2 className="font-semibold text-gray-900">
              2. Account Registration
            </h2>
            <p className="mt-1">
              Users must provide accurate information when registering and
              keep their account details up to date. You are responsible for
              activities performed through your account.
            </p>
          </section>

          <section>
            <h2 className="font-semibold text-gray-900">
              3. Use of TrabahoNow
            </h2>
            <p className="mt-1">
              TrabahoNow connects employers with workers for local jobs and
              services. Users must use the platform responsibly and provide
              truthful information.
            </p>
          </section>

          <section>
            <h2 className="font-semibold text-gray-900">
              4. Employer Responsibilities
            </h2>
            <p className="mt-1">
              Employers must provide accurate job descriptions, schedules,
              locations, and payment arrangements. Employers should communicate
              any changes to workers promptly.
            </p>
          </section>

          <section>
            <h2 className="font-semibold text-gray-900">
              5. Worker Responsibilities
            </h2>
            <p className="mt-1">
              Workers must accurately represent their skills and availability,
              communicate professionally, and make reasonable efforts to
              complete accepted jobs as agreed.
            </p>
          </section>

          <section>
            <h2 className="font-semibold text-gray-900">
              6. Hiring Requests and Tokens
            </h2>
            <p className="mt-1">
              Some platform features may require tokens to send hiring
              requests. Any token deductions, expiration rules, or refunds
              will be governed by the rules displayed when using that feature.
            </p>
          </section>

          <section>
            <h2 className="font-semibold text-gray-900">
              7. Cancellations
            </h2>
            <p className="mt-1">
              Users must follow the platform's cancellation procedures and
              provide truthful reasons when requested. Any applicable refund
              or token return depends on the stated rules and circumstances.
            </p>
          </section>

          <section>
            <h2 className="font-semibold text-gray-900">
              8. Prohibited Activities
            </h2>
            <p className="mt-1">Users must not:</p>
            <ul className="mt-1 list-disc space-y-1 pl-5">
              <li>Post fraudulent or misleading jobs.</li>
              <li>Harass, threaten, or discriminate against other users.</li>
              <li>Misuse personal information.</li>
              <li>Manipulate ratings, reviews, or token transactions.</li>
              <li>Attempt unauthorized access to the platform.</li>
              <li>Use TrabahoNow for unlawful activities.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-semibold text-gray-900">
              9. Ratings and Reviews
            </h2>
            <p className="mt-1">
              Ratings and reviews must reflect genuine experiences and must
              not contain threats, harassment, or knowingly false statements.
            </p>
          </section>

          <section>
            <h2 className="font-semibold text-gray-900">
              10. Disputes and Account Suspension
            </h2>
            <p className="mt-1">
              Users may report disputes or suspicious activity to the
              administration. TrabahoNow may investigate reported violations
              and restrict accounts when reasonably necessary, subject to
              applicable law.
            </p>
          </section>

          <section>
            <h2 className="font-semibold text-gray-900">
              11. Privacy
            </h2>
            <p className="mt-1">
              The collection and use of personal information are described in
              our Privacy Policy.
            </p>
            <Link
              to="/privacy"
              className="mt-1 inline-block font-semibold text-primary underline underline-offset-2"
            >
              Read our Privacy Policy
            </Link>
          </section>

          <section>
            <h2 className="font-semibold text-gray-900">
              12. Changes to These Terms
            </h2>
            <p className="mt-1">
              We may update these Terms as the platform evolves. Updated
              versions will be published on this page.
            </p>
          </section>

          <section>
            <h2 className="font-semibold text-gray-900">
              13. Contact and Governing Law
            </h2>
            <p className="mt-6 border-t border-gray-200 pt-4 text-xs leading-relaxed text-gray-500">
              These Terms are intended to be interpreted under applicable
              Philippine law. For questions, contact the TrabahoNow
              administrator through the platform's official contact channel.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}