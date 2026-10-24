import { Link } from "react-router-dom";
import {
  WrenchScrewdriverIcon,
  BoltIcon,
  SparklesIcon,
  HomeModernIcon,
  CloudIcon,
  PaintBrushIcon,
  CpuChipIcon,
  AcademicCapIcon,
  TruckIcon,
  SunIcon,
  ChevronRightIcon,
} from "@heroicons/react/24/outline";
import Container from "../../components/layout/Container";
import { SectionHeading, PrimaryLink } from "../../components/ui/public/PublicUI";

const services = [
  { name: "Plumbing", icon: WrenchScrewdriverIcon, text: "Leaks, clogs, faucets and pipe repairs." },
  { name: "Electrical", icon: BoltIcon, text: "Wiring, outlets, lighting and fixtures." },
  { name: "Home cleaning", icon: SparklesIcon, text: "Regular or one-time cleaning for your home." },
  { name: "Carpentry", icon: HomeModernIcon, text: "Furniture, doors, cabinets and repairs." },
  { name: "Aircon service", icon: CloudIcon, text: "Cleaning, checkups and troubleshooting." },
  { name: "Painting", icon: PaintBrushIcon, text: "Interior and exterior painting jobs." },
  { name: "Appliance repair", icon: CpuChipIcon, text: "Washers, fridges, fans and small appliances." },
  { name: "Tutoring", icon: AcademicCapIcon, text: "Lessons and school support, one on one." },
  { name: "Delivery help", icon: TruckIcon, text: "Errands, pickups and light hauling." },
  { name: "Gardening", icon: SunIcon, text: "Lawn care, trimming and garden upkeep." },
];

export default function Services() {
  return (
    <>
      <section className="bg-white py-14 sm:py-20">
        <Container>
          <SectionHeading
            eyebrow="Services"
            title="Everyday work, handled by neighbors."
            subtitle="Pick a service to see the verified jobseekers who offer it in Sta. Maria."
          />

          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {services.map(({ name, icon: Icon, text }) => (
              <Link
                key={name}
                to={`/jobseekers?service=${encodeURIComponent(name)}`}
                className="group flex flex-col rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-primary hover:shadow-md"
              >
                <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-navy text-primary">
                  <Icon className="h-6 w-6" />
                </span>
                <h3 className="mt-5 text-lg font-bold text-navy">{name}</h3>
                <p className="mt-1 flex-1 text-sm leading-relaxed text-gray-600">
                  {text}
                </p>
                <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-primary">
                  See jobseekers
                  <ChevronRightIcon className="h-4 w-4 transition group-hover:translate-x-0.5" />
                </span>
              </Link>
            ))}
          </div>

        </Container>
      </section>

      <section className="bg-navy py-14 text-center sm:py-16">
        <Container>
          <h2 className="text-2xl font-bold text-white sm:text-3xl">
            Don&apos;t see your service? <span className="text-primary">Offer it.</span>
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-navy-text">
            Verify your ID, post what you do and set your availability.
            Jobseekers never pay credits.
          </p>
          <div className="mt-8">
            <PrimaryLink to="/register">Create an account now</PrimaryLink>
          </div>
        </Container>
      </section>
    </>
  );
}