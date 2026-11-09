import { useMemo, useState } from "react";
import {
  MagnifyingGlassIcon,
  ChevronDownIcon,
  EnvelopeIcon,
  PhoneIcon,
  LifebuoyIcon,
} from "@heroicons/react/24/outline";

// Fill these in with your real support details. Empty values are hidden.
const SUPPORT = { email: "", phone: "", hours: "" };

const TOPICS = ["All", "Verification", "Requests", "Calendar", "Services", "Payments", "Account"];

const FAQS = [
  {
    topic: "Verification",
    q: "How do I get verified?",
    a: "Open Verify identity and complete each step: personal details, professional profile, contact details and documents. Then submit for review. An admin checks your documents, usually within 24–48 hours.",
  },
  {
    topic: "Verification",
    q: "Which documents do I need?",
    a: "A government ID, a selfie holding your ID, proof of residency, and an NBI or police clearance. Photos and PDFs up to 5 MB each are accepted.",
  },
  {
    topic: "Verification",
    q: "My verification was not approved. What now?",
    a: "The reason is shown on your dashboard and in System Settings. Fix the issue (for example, upload a clearer photo) and choose Resubmit.",
  },
  {
    topic: "Requests",
    q: "How do I accept or decline a request?",
    a: "Open Booking Request and read the job details. Choose Accept job to add it to your calendar, or Decline and pick a reason so the client can find someone else. You can undo your choice right after responding.",
  },
  {
    topic: "Calendar",
    q: "How do I show when I’m available?",
    a: "In My Calendar, select a day and set it to Available, Booked or Day off. Use Add availability to set several days at once. Days with jobs are always shown as Booked.",
  },
  {
    topic: "Services",
    q: "How do I post a service?",
    a: "Go to My Job Post and choose Add service. Add a title, category, your rate and a short description of what’s included.",
  },
  {
    topic: "Payments",
    q: "Where can I see my earnings?",
    a: "Open Transactions. It lists received and upcoming payments, and shows your available balance.",
  },
  {
    topic: "Account",
    q: "How do I change my password or contact details?",
    a: "Open System Settings. You can update your name, mobile number, email and password there.",
  },
];

function FaqItem({ item, open, onToggle, id }) {
  return (
    <li className="border-b border-gray-100 last:border-b-0">
      <h3>
        <button
          type="button"
          aria-expanded={open}
          aria-controls={`${id}-panel`}
          id={`${id}-button`}
          onClick={onToggle}
          className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left transition hover:bg-gray-50"
        >
          <span className="text-sm font-bold text-navy">{item.q}</span>
          <ChevronDownIcon className={`h-5 w-5 shrink-0 text-muted transition-transform ${open ? "rotate-180" : ""}`} />
        </button>
      </h3>
      {open && (
        <div id={`${id}-panel`} role="region" aria-labelledby={`${id}-button`} className="px-5 pb-4 text-sm leading-relaxed text-gray-600">
          {item.a}
        </div>
      )}
    </li>
  );
}

export default function JobseekerHelp() {
  const [query, setQuery] = useState("");
  const [topic, setTopic] = useState("All");
  const [openIndex, setOpenIndex] = useState(null);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return FAQS.filter(
      (f) =>
        (topic === "All" || f.topic === topic) &&
        (!q || f.q.toLowerCase().includes(q) || f.a.toLowerCase().includes(q))
    );
  }, [query, topic]);

  const hasContact = SUPPORT.email || SUPPORT.phone;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-navy">Help &amp; Support</h1>
        <p className="mt-1 text-sm text-muted">Find quick answers about verification, requests and getting paid.</p>
      </div>

      {/* Search */}
      <div className="relative">
        <MagnifyingGlassIcon className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted" />
        <label htmlFor="help-search" className="sr-only">Search help articles</label>
        <input
          id="help-search"
          type="search"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpenIndex(null);
          }}
          placeholder="Search for a question"
          className="w-full rounded-xl border border-gray-300 bg-white py-3 pl-12 pr-4 text-sm text-gray-800 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
        />
      </div>

      {/* Topics */}
      <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1" role="group" aria-label="Filter by topic">
        {TOPICS.map((t) => (
          <button
            key={t}
            type="button"
            aria-pressed={topic === t}
            onClick={() => {
              setTopic(t);
              setOpenIndex(null);
            }}
            className={`shrink-0 rounded-full border px-4 py-1.5 text-sm font-medium transition ${
              topic === t ? "border-primary bg-primary text-white" : "border-gray-300 bg-white text-navy hover:border-primary"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
        {/* FAQ */}
        <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
          {results.length === 0 ? (
            <div className="p-10 text-center">
              <LifebuoyIcon className="mx-auto h-12 w-12 text-gray-300" />
              <p className="mt-3 font-bold text-navy">No answers found</p>
              <p className="mt-1 text-sm text-muted">Try different words, or pick another topic.</p>
            </div>
          ) : (
            <ul>
              {results.map((item, i) => (
                <FaqItem
                  key={item.q}
                  id={`faq-${i}`}
                  item={item}
                  open={openIndex === i}
                  onToggle={() => setOpenIndex(openIndex === i ? null : i)}
                />
              ))}
            </ul>
          )}
        </section>

        {/* Contact */}
        <section className="rounded-2xl bg-linear-to-br from-navy to-navy-2 p-5 text-white shadow-sm">
          <div className="flex items-center gap-3">
            <span className="rounded-lg bg-white/10 p-2">
              <LifebuoyIcon className="h-5 w-5" />
            </span>
            <h2 className="text-lg font-bold">Still need help?</h2>
          </div>
          <p className="mt-3 text-sm text-gray-300">
            {hasContact
              ? "Reach our team and we’ll get back to you."
              : "Contact the TrabahoNow administrator through the platform’s official contact channel."}
          </p>

          {hasContact && (
            <ul className="mt-4 space-y-3 text-sm">
              {SUPPORT.email && (
                <li>
                  <a href={`mailto:${SUPPORT.email}`} className="flex items-center gap-3 rounded-xl bg-white/10 px-4 py-3 transition hover:bg-white/20">
                    <EnvelopeIcon className="h-5 w-5 shrink-0" /> {SUPPORT.email}
                  </a>
                </li>
              )}
              {SUPPORT.phone && (
                <li>
                  <a href={`tel:${SUPPORT.phone}`} className="flex items-center gap-3 rounded-xl bg-white/10 px-4 py-3 transition hover:bg-white/20">
                    <PhoneIcon className="h-5 w-5 shrink-0" /> {SUPPORT.phone}
                  </a>
                </li>
              )}
            </ul>
          )}
          {SUPPORT.hours && <p className="mt-3 text-xs text-gray-300">{SUPPORT.hours}</p>}
        </section>
      </div>
    </div>
  );
}