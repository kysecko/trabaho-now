import { useState } from "react";
import {
  MagnifyingGlassIcon,
  CalendarDaysIcon,
  CheckBadgeIcon,
  ShieldCheckIcon,
  ClockIcon,
  CreditCardIcon,
  PlusIcon,
  MinusIcon,
} from "@heroicons/react/24/outline";
import Container from "../../components/layout/Container";
import {
  SectionHeading,
  PrimaryLink,
  SecondaryLink,
} from "../../components/ui/public/PublicUI";

const steps = [
  {
    icon: MagnifyingGlassIcon,
    title: "Find who's free",
    text: "Browse jobseekers near you. Rate, availability, ratings and cancellation rate are all visible upfront.",
  },
  {
    icon: CalendarDaysIcon,
    title: "Book a time",
    text: "Pick an open slot and set the urgency: emergency, same-day or scheduled. A request costs the client one credit.",
  },
  {
    icon: CheckBadgeIcon,
    title: "Get it done, then review",
    text: "After the jobseeker accepts, contact details are shared. When the job ends, both sides rate each other.",
  },
];

const rules = [
  {
    icon: ShieldCheckIcon,
    title: "Two verification levels",
    text: "Level 1 is a verified email: browse with read-only access. Level 2 adds a valid ID and selfie, reviewed by an admin, to hire or to post services.",
  },
  {
    icon: ClockIcon,
    title: "Fair cancellations",
    text: "Cancel more than 24 hours ahead and it is approved automatically. Later cancellations are reviewed by an admin, and valid reasons are never penalized.",
  },
  {
    icon: CreditCardIcon,
    title: "Simple credits",
    text: "Clients buy credits with GCash or Maya. One credit per direct hire request. Jobseekers never pay credits.",
  },
];

const faqs = [
  {
    q: "Do I need an account to browse?",
    a: "You can browse as a guest. To hire someone, or to post your own service, you complete ID and selfie verification.",
  },
  {
    q: "What happens if a job takes longer than planned?",
    a: "The jobseeker requests an extension and picks a reason. If another client is booked next, they are notified and can reschedule or keep their slot with a different jobseeker.",
  },
  {
    q: "How is my personal information protected?",
    a: "TrabahoNow is designed around the Data Privacy Act of 2012 (RA 10173). You consent at signup, contact details are shared only after a booking is accepted, and ID images are visible only to admins.",
  },
  {
    q: "Will I get push notifications?",
    a: "Notifications arrive by email and inside the app. Open the app or check your email regularly so you do not miss urgent requests.",
  },
];

function Faq({ item, open, onToggle }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left text-base font-bold text-navy"
      >
        {item.q}
        {open ? (
          <MinusIcon className="h-5 w-5 flex-none text-primary" />
        ) : (
          <PlusIcon className="h-5 w-5 flex-none text-primary" />
        )}
      </button>
      {open && (
        <p className="px-6 pb-5 text-sm leading-relaxed text-gray-600 sm:text-base">
          {item.a}
        </p>
      )}
    </div>
  );
}

export default function HowItWorks() {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <>
      {/* Steps */}
      <section className="bg-white py-14 sm:py-20">
        <Container>
          <SectionHeading
            eyebrow="How it works"
            title="Get the work done in 3 easy steps"
            subtitle="No group chats, no guessing who is free. Everything happens in one place."
          />

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {steps.map(({ icon: Icon, title, text }, i) => (
              <div
                key={title}
                className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm"
              >
                <div className="flex items-center gap-4">
                  <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-navy text-primary">
                    <Icon className="h-6 w-6" />
                  </span>
                  <span className="text-sm font-semibold text-gray-500">
                    Step {i + 1}
                  </span>
                </div>
                <h3 className="mt-5 text-xl font-bold text-navy">{title}</h3>
                <p className="mt-2 leading-relaxed text-gray-600">{text}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Rules of the platform */}
      <section className="bg-gray-50 py-14 sm:py-20">
        <Container>
          <SectionHeading
            eyebrow="The ground rules"
            title="Built around trust, timing and fairness. "
          />

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {rules.map(({ icon: Icon, title, text }) => (
              <div
                key={title}
                className="flex gap-4 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-colors hover:border-primary/40"
              >
                <span className="flex h-11 w-11 flex-none items-center justify-center rounded-xl bg-gray-50 text-primary ring-1 ring-gray-200">
                  <Icon className="h-6 w-6" />
                </span>
                <div>
                  <h3 className="font-bold text-navy">{title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-gray-600">
                    {text}
                  </p>
                </div>
              </div>
            ))}
          </div>

        </Container>
      </section>

      {/* FAQ */}
      <section className="bg-white py-14 sm:py-20">
        <Container>
          <div className="mx-auto max-w-3xl">
            <SectionHeading eyebrow="FAQ" title="Questions, answered" />
            <div className="mt-10 space-y-3">
              {faqs.map((item, i) => (
                <Faq
                  key={item.q}
                  item={item}
                  open={openIndex === i}
                  onToggle={() => setOpenIndex(openIndex === i ? -1 : i)}
                />
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* CTA */}
      <section className="bg-navy py-14 text-center sm:py-16">
        <Container>
          <h2 className="text-2xl font-bold text-white sm:text-3xl">
            Ready to get started? <span className="text-primary">Trabaho na!</span>
          </h2>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <PrimaryLink to="/signup">Create an account now</PrimaryLink>
            <SecondaryLink
              to="/jobseekers"
              className="border-white text-white hover:bg-white/10"
            >
              Browse jobseekers
            </SecondaryLink>
          </div>
        </Container>
      </section>
    </>
  );
}