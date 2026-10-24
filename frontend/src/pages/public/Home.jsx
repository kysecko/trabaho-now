import {
  MagnifyingGlassIcon,
  CalendarDaysIcon,
  CheckBadgeIcon,
  ShieldCheckIcon,
  ClockIcon,
  StarIcon,
  CreditCardIcon,
  BoltIcon,
} from "@heroicons/react/24/outline";

import {
  SectionHeading,
  PrimaryLink,
  SecondaryLink,
} from "../../components/ui/public/PublicUI";

// dump data lang 
const steps = [
  {
    icon: MagnifyingGlassIcon,
    title: "Find who's free",
    text: "Browse jobseekers near you and see their rate, availability and past reviews right away.",
  },
  {
    icon: CalendarDaysIcon,
    title: "Book a time",
    text: "Pick an open slot and tell them how urgent it is: emergency, same-day or scheduled.",
  },
  {
    icon: CheckBadgeIcon,
    title: "Get it done",
    text: "Once the job is accepted, you are connected. Finish the work, then rate each other.",
  },
];

const hireCards = [
  {
    image: "/public-images/client.png",
    alt: "A client booking a service at home",
    title: "Need a worker today?",
    text: "See who is available now, compare rates and reviews, and send a hire request in minutes.",
    cta: "Browse jobseekers",
    to: "/jobseekers",
  },
  {
    image: "/public-images/jobseeker.png",
    alt: "A jobseeker getting ready for a job",
    title: "Looking for work?",
    text: "Post the services you offer, set your availability and let nearby clients come to you.",
    cta: "Offer your skills",
    to: "/register",
  },
];

const features = [
  { icon: ShieldCheckIcon, title: "Verified identities", text: "Valid ID and selfie checked by an admin." },
  { icon: ClockIcon, title: "Live availability", text: "Available, Booked, On-job or Offline in real time." },
  { icon: StarIcon, title: "Ratings both ways", text: "Clients and jobseekers review each other after every job." },
  { icon: BoltIcon, title: "Urgency levels", text: "Emergency, same-day or scheduled bookings." },
  { icon: CreditCardIcon, title: "Pay with GCash or Maya", text: "Buy credits online. Jobseekers never pay credits." },
  { icon: CheckBadgeIcon, title: "Fair cancellations", text: "Early cancels are free. Late ones are reviewed by an admin." },
];


export default function Home() {
  return (
    <>
      {/* hero */}
      <section className="relative isolate h-screen min-h-150 w-full overflow-hidden">
        <img
          src="/public-images/home-hero.png"
          alt="TrabahoNow freelance marketplace hero"
          className="absolute inset-0 h-full w-full object-cover object-center"
        />

        <div className="absolute inset-0 bg-black/50" />

        <div className="relative z-10 flex h-full items-center justify-center">
          <div className="mx-auto w-full max-w-4xl px-5 text-center text-white sm:px-8 lg:px-6">
            <h1 className="text-3xl font-bold leading-tight tracking-tight sm:text-4xl md:text-5xl lg:text-6xl">
              Find work for today. Or hire for today.
              <br />
              <span className="text-primary">Trabaho na!</span>
            </h1>

            <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-white/90 sm:mt-6 sm:text-lg md:text-xl">
              Need a worker today? See who&apos;s free near you. Want work? Post
              your job offered. Everything is shown clearly: the rate, the
              availability, and past reviews. You decide before anyone commits —
              no guessing, no word-of-mouth required.
            </p>

            <div className="mt-8 flex flex-wrap justify-center gap-4 sm:mt-10">
              <PrimaryLink to="/register">
                Create an account now
              </PrimaryLink>

              <SecondaryLink
                to="/jobseekers"
                className="border-white text-white hover:bg-white/10"
              >
                Browse all jobseekers
              </SecondaryLink>
            </div>
          </div>
        </div>
      </section>

      {/* how it works */}
      <section className="bg-white px-5 py-16 sm:px-8 sm:py-20">
        <div className="mx-auto max-w-6xl">
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
        </div>
      </section>

      {/* */}
      <section className="bg-gray-50 px-5 py-16 sm:px-8 sm:py-20">
        <div className="mx-auto max-w-6xl">
          <SectionHeading
            title="Simple hiring, made with no hassle."
            subtitle="Whether you are hiring or looking for work, you see everything up front."
          />

          <div className="mt-12 grid gap-8 md:grid-cols-2">
            {hireCards.map((card) => (
              <article
                key={card.title}
                className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-gray-200"
              >
                <img
                  src={card.image}
                  alt={card.alt}
                  className="h-64 w-full object-cover sm:h-72"
                />
                <div className="p-6 sm:p-8">
                  <h3 className="text-xl font-bold text-navy sm:text-2xl">
                    {card.title}
                  </h3>
                  <p className="mt-3 leading-relaxed text-gray-600">
                    {card.text}
                  </p>
                  <div className="mt-6">
                    <PrimaryLink to={card.to}>{card.cta}</PrimaryLink>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* trust */}
      <section className="bg-white px-5 py-16 sm:px-8 sm:py-20">
        <div className="mx-auto grid max-w-6xl items-center gap-10 md:grid-cols-2 md:gap-16">
          <img
            src="/public-images/home-whyuseit.png"
            alt="A jobseeker and client agreeing on a job"
            className="h-80 w-full rounded-2xl object-cover sm:h-96"
          />
          <div>
            <SectionHeading
              center={false}
              eyebrow="Trust"
              title="Hire and work with confidence"
              subtitle="Every jobseeker is ID-verified, every rate is visible, and every job ends with a review. You know what you are getting before anyone commits."
            />
            <ul className="mt-6 space-y-3 text-gray-700">
              {[
                "Rates and availability shown upfront",
                "Contact details shared only after a booking is accepted",
                "Report and block anyone who breaks the rules",
              ].map((item) => (
                <li key={item} className="flex gap-3">
                  <CheckBadgeIcon className="h-6 w-6 flex-none text-primary" />
                  {item}
                </li>
              ))}
            </ul>
            <div className="mt-8">
              <PrimaryLink to="/how-it-works">See how it works</PrimaryLink>
            </div>
          </div>
        </div>
      </section>

      {/* why trabaho-now */}
      <section className="bg-gray-50 px-5 py-16 sm:px-8 sm:py-20">
        <div className="mx-auto max-w-6xl">
          <SectionHeading
            eyebrow="Why TrabahoNow"
            title="The best thing about working locally"
          />

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map(({ icon: Icon, title, text }) => (
              <div
                key={title}
                className="flex gap-4 rounded-2xl border border-gray-200 bg-white p-6 transition-colors hover:border-primary/40"
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
        </div>
      </section>

      {/* cta */}
      <section className="bg-white px-5 py-16 sm:px-8 sm:py-20">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-2xl font-bold tracking-tight text-navy sm:text-3xl md:text-4xl">
            Ready to get started?{" "}
            <span className="text-primary">Trabaho na!</span>
          </h2>
          <p className="mt-4 text-base text-gray-600 sm:text-lg">
            Join TrabahoNow and connect with trusted people right here in Sta.
            Maria, Bulacan.
          </p>
          <div className="mt-8">
            <PrimaryLink to="/register">Create an account now</PrimaryLink>
          </div>
        </div>
      </section>
    </>
  );
}