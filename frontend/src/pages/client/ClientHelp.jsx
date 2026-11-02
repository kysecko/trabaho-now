import { useMemo, useState } from "react";
import {
  MagnifyingGlassIcon,
  ChevronDownIcon,
  EnvelopeIcon,
  PhoneIcon,
  ClockIcon,
} from "@heroicons/react/24/outline";
import { useAuth } from "../../context/AuthContext";

const CONTACTS = [
  { icon: EnvelopeIcon, label: "Email us", value: "support@trabahonow.ph", href: "mailto:support@trabahonow.ph" },
  { icon: PhoneIcon, label: "Call or text", value: "09XX XXX XXXX", href: "tel:+639000000000" },
  { icon: ClockIcon, label: "Support hours", value: "Mon–Sat, 8 AM–6 PM" },
];

const FAQS = [
  { topic: "Getting started", q: "How do I hire someone?", a: "Open Find Jobseekers, pick a worker, then choose Quick hire or open their full profile and send a hire request. You need a verified account first." },
  { topic: "Getting started", q: "Who can use Trabaho Now?", a: "Trabaho Now is open to residents of Santa Maria, Bulacan. We check your address during verification." },
  { topic: "Verification", q: "Why do I need to verify my ID?", a: "Verification keeps the community safe. It confirms who you are and that you live in Santa Maria before you hire or send requests." },
  { topic: "Verification", q: "How long does verification take?", a: "Usually 24–48 hours. You’ll get a notification as soon as your ID is approved or if we need something else." },
  { topic: "Verification", q: "What documents do I need?", a: "A valid government ID, a selfie, and a document that shows your Santa Maria address, such as a barangay certificate of residency or a recent utility bill." },
  { topic: "Requests & payments", q: "Where can I see my requests?", a: "Open Request & Bookings from the menu to see pending, accepted and finished requests." },
  { topic: "Requests & payments", q: "Where do I find my payment history?", a: "Open Transactions from the menu to see receipts and past payments." },
  { topic: "Safety", q: "How do I report a problem with a worker?", a: "Use the form at the bottom of this page and include the worker’s name and what happened. Our team will review it." },
];

const TOPICS = ["Getting started", "Verification", "Requests & payments", "Safety"];

export default function ClientHelp() {
  const { user } = useAuth();
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(null);
  const [report, setReport] = useState({ topic: "", message: "" });
  const [sent, setSent] = useState(false);

  const isVerified = user?.is_verified === true || user?.verification_status === 'approved';

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return FAQS;
    return FAQS.filter((f) => f.q.toLowerCase().includes(q) || f.a.toLowerCase().includes(q));
  }, [query]);

  const submitReport = (e) => {
    e.preventDefault();
    setSent(true);
    setReport({ topic: "", message: "" });
  };

  return (
    <main className="w-full space-y-8">
      <section>
        <h1 className="text-2xl font-bold text-navy">How can we help?</h1>
        <p className="mt-1 text-sm text-muted">Search common questions or contact our team.</p>

        <div className="relative mt-4">
          <MagnifyingGlassIcon className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for answers, e.g. verification"
            aria-label="Search help articles"
            className="w-full rounded-xl border border-gray-300 bg-white py-3 pl-10 pr-4 text-sm outline-none transition focus:border-[#ff4d00] focus:ring-2 focus:ring-[#ff4d00]/20"
          />
        </div>
      </section>

      <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-3">
        <section className="space-y-5 lg:col-span-2">
          {results.length === 0 && (
            <div className="rounded-2xl border border-gray-200 bg-white px-6 py-10 text-center">
              <p className="text-sm font-bold text-navy">No answers for “{query}”</p>
              <p className="mt-1 text-sm text-muted">Try a different word, or send us a message below.</p>
            </div>
          )}

          {TOPICS.map((topic) => {
            const items = results.filter((f) => f.topic === topic);
            if (!items.length) return null;
            return (
              <div key={topic}>
                <h2 className="mb-2 text-sm font-bold text-navy">{topic}</h2>
                <ul className="divide-y divide-gray-100 overflow-hidden rounded-2xl border border-gray-200 bg-white">
                  {items.map((f) => {
                    const isOpen = open === f.q;
                    return (
                      <li key={f.q}>
                        <button
                          type="button"
                          onClick={() => setOpen(isOpen ? null : f.q)}
                          aria-expanded={isOpen}
                          className="flex w-full cursor-pointer items-center justify-between gap-4 px-4 py-4 text-left transition hover:bg-gray-50"
                        >
                          <span className="text-sm font-semibold text-gray-800">{f.q}</span>
                          <ChevronDownIcon
                            className={`h-5 w-5 shrink-0 text-gray-400 transition-transform ${isOpen ? "rotate-180 text-[#ff4d00]" : ""}`}
                            aria-hidden="true"
                          />
                        </button>
                        {isOpen && <p className="px-4 pb-4 text-sm leading-relaxed text-gray-600">{f.a}</p>}
                      </li>
                    );
                  })}
                </ul>
              </div>
            );
          })}
        </section>

        <div className="space-y-8">
          <section>
            <h2 className="mb-3 text-lg font-bold text-navy">Still need help?</h2>
            <div className="grid grid-cols-1 gap-3">
              {CONTACTS.map(({ icon: Icon, label, value, href }) => {
                const body = (
                  <>
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-50">
                      <Icon className="h-5 w-5 text-[#ff4d00]" aria-hidden="true" />
                    </div>
                    <p className="mt-3 text-xs font-semibold text-gray-500">{label}</p>
                    <p className="mt-0.5 wrap-break-words text-sm font-bold text-navy">{value}</p>
                  </>
                );
                const cls = "rounded-2xl border border-gray-200 bg-white p-4";
                return href ? (
                  <a key={label} href={href} className={`${cls} transition hover:border-[#ff4d00]`}>
                    {body}
                  </a>
                ) : (
                  <div key={label} className={cls}>
                    {body}
                  </div>
                );
              })}
            </div>
          </section>

          {/* Conditional Rendering for Report Form */}
          {isVerified ? (
            <section className="rounded-2xl border border-gray-200 bg-white p-5 sm:p-6">
              <h2 className="text-base font-bold text-navy">Send us a message</h2>
              <p className="mt-1 text-sm text-muted">We usually reply within one business day.</p>

              {sent ? (
                <div className="mt-4 rounded-xl bg-green-50 p-4">
                  <p className="text-sm font-bold text-green-800">Message sent</p>
                  <p className="text-sm text-green-700">Thanks. We’ll get back to you by email.</p>
                  <button
                    type="button"
                    onClick={() => setSent(false)}
                    className="mt-3 cursor-pointer text-sm font-semibold text-green-800 underline"
                  >
                    Send another message
                  </button>
                </div>
              ) : (
                <form onSubmit={submitReport} className="mt-4 space-y-4">
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-semibold text-gray-600">What is this about?</label>
                    <select
                      value={report.topic}
                      onChange={(e) => setReport({ ...report, topic: e.target.value })}
                      className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-800 outline-none focus:border-[#ff4d00] focus:ring-2 focus:ring-[#ff4d00]/20"
                    >
                      <option value="">Select a topic</option>
                      <option>Verification</option>
                      <option>A request or booking</option>
                      <option>Payments</option>
                      <option>Report a worker</option>
                      <option>Something else</option>
                    </select>
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-semibold text-gray-600">Message</label>
                    <textarea
                      rows={4}
                      value={report.message}
                      onChange={(e) => setReport({ ...report, message: e.target.value })}
                      placeholder="Tell us what happened"
                      className="w-full resize-y rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-800 outline-none focus:border-[#ff4d00] focus:ring-2 focus:ring-[#ff4d00]/20"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={!report.message.trim()}
                    className="cursor-pointer rounded-lg bg-[#ff4d00] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#e64500] disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Send message
                  </button>
                </form>
              )}
            </section>
          ) : (
            <section className="rounded-2xl border border-orange-200 bg-orange-50 p-5 sm:p-6 text-center">
              <h2 className="text-base font-bold text-orange-800">Verification Required</h2>
              <p className="mt-1 text-sm text-orange-700">
                You must verify your identity before you can report workers, file disputes, or send specific booking inquiries.
              </p>
              <a
                href="/verify"
                className="mt-4 inline-block rounded-lg bg-[#ff4d00] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#e64500]"
              >
                Verify Identity
              </a>
            </section>
          )}
        </div>
      </div>
    </main>
  );
}