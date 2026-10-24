
import { useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  CheckBadgeIcon,
  MapPinIcon,
} from "@heroicons/react/24/outline";
import { StarIcon } from "@heroicons/react/24/solid";
import Container from "../../components/layout/Container";
import { SectionHeading } from "../../components/ui/public/PublicUI";
import {
  JOBSEEKERS,
  SERVICE_NAMES,
  STATUS_STYLES,
} from "../../lib/sampleJobseekers";

function initialsOf(name) {
  return name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function JobseekerAvatar({ person }) {
  const [imageFailed, setImageFailed] = useState(false);

  return (
    <div className="flex h-14 w-14 flex-none items-center justify-center overflow-hidden rounded-full bg-navy text-base font-bold text-primary ring-1 ring-gray-200">
      {person.image && !imageFailed ? (
        <img
          src={person.image}
          alt={`Demo profile of ${person.name}`}
          className="h-full w-full object-cover"
          loading="lazy"
          onError={() => setImageFailed(true)}
        />
      ) : (
        initialsOf(person.name)
      )}
    </div>
  );
}

function JobseekerCard({ person }) {
  const status = STATUS_STYLES[person.status];

  return (
    <article className="flex flex-col gap-4 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
      {/* Profile */}
      <div className="flex items-center gap-4">
        <JobseekerAvatar person={person} />

        <div className="min-w-0">
          <h3 className="truncate text-base font-bold text-navy">
            {person.name}
          </h3>

          <p className="flex items-center gap-1 text-sm text-gray-600">
            <span className="truncate">{person.service}</span>
            <span aria-hidden="true">·</span>
            <MapPinIcon className="h-4 w-4 flex-none" />
            <span className="truncate">{person.barangay}</span>
          </p>
        </div>
      </div>


      {/* Availability and verified badge */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span
          className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold ${status?.badge || "bg-gray-100 text-gray-700"
            }`}
        >
          <span
            className={`h-2 w-2 rounded-full ${status?.dot || "bg-gray-400"
              }`}
          />
          {person.status}
        </span>

        <span className="inline-flex items-center gap-1 rounded-full border border-orange-200 bg-orange-50 px-2.5 py-1 text-xs font-semibold text-orange-700">
          <CheckBadgeIcon className="h-4 w-4" />
          Verified
        </span>
      </div>


      {/* Ratings and statistics */}
      <dl className="grid grid-cols-3 gap-2 text-center">
        <div className="rounded-xl bg-gray-100 p-2.5">
          <dt className="text-[11px] font-medium text-gray-600">
            Rating
          </dt>
          <dd className="mt-0.5 flex items-center justify-center gap-1 text-base font-extrabold text-navy">
            <StarIcon className="h-4 w-4 text-amber-500" />
            {Number(person.rating ?? 0).toFixed(1)}
          </dd>
        </div>

        <div className="rounded-xl bg-gray-100 p-2.5">
          <dt className="text-[11px] font-medium text-gray-600">
            Jobs done
          </dt>
          <dd className="mt-0.5 text-base font-extrabold text-navy">
            {person.jobs ?? 0}
          </dd>
        </div>

        <div className="rounded-xl bg-gray-100 p-2.5">
          <dt className="text-[11px] font-medium text-gray-600">
            Cancelled
          </dt>
          <dd className="mt-0.5 text-base font-extrabold text-navy">
            {person.cancelRate ?? 0}%
          </dd>
        </div>
      </dl>

      {/* Rate and action */}
      <div className="mt-auto flex items-center justify-between gap-3 border-t border-gray-100 pt-4">
        <p className="text-lg font-extrabold text-navy">
          {person.rate}
        </p>

        <Link
          to="/login"
          className="rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
        >
          Hire Now
        </Link>
      </div>
    </article>
  );
}

export default function Jobseekers() {
  const [params, setParams] = useSearchParams();
  const service = params.get("service") || "All";
  const [onlyAvailable, setOnlyAvailable] = useState(false);

  const setService = (name) => {
    if (name === "All") {
      setParams({});
    } else {
      setParams({ service: name });
    }
  };

  const results = useMemo(
    () =>
      JOBSEEKERS.filter(
        (person) =>
          (service === "All" || person.service === service) &&
          (!onlyAvailable || person.status === "Available")
      ),
    [service, onlyAvailable]
  );

  const reset = () => {
    setParams({});
    setOnlyAvailable(false);
  };

  return (
    <section className="bg-white py-14 sm:py-20">
      <Container>
        <SectionHeading
          center={false}
          eyebrow="Browse jobseekers"
          title="See who is free near you."
          subtitle="Filter by service or availability, compare rates and reliability, then send a request."
        />

        {/* Service filters */}
        <div className="mt-8 flex flex-wrap gap-2.5">
          {["All", ...SERVICE_NAMES].map((name) => {
            const active = service === name;

            return (
              <button
                key={name}
                type="button"
                onClick={() => setService(name)}
                aria-pressed={active}
                className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${active
                    ? "border-navy bg-navy text-white"
                    : "border-gray-300 bg-white text-navy hover:border-navy"
                  }`}
              >
                {name}
              </button>
            );
          })}
        </div>

        {/* Availability filter and result count */}
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => setOnlyAvailable((value) => !value)}
            aria-pressed={onlyAvailable}
            className={`inline-flex items-center gap-2.5 rounded-full border px-4 py-2 text-sm font-semibold transition  cursor-pointer ${onlyAvailable
                ? "border-green-600 bg-green-100 text-green-800"
                : "border-gray-300 bg-white text-navy hover:border-navy"
              }`}
          >
            <span className="h-2.5 w-2.5 rounded-full bg-green-500" />
            Available now only
          </button>

          <p
            className="text-sm font-medium text-gray-600"
            aria-live="polite"
          >
            {results.length}{" "}
            {results.length === 1 ? "jobseeker" : "jobseekers"}
            {service !== "All" && ` in ${service}`}
          </p>
        </div>

        {/* Jobseeker results: maximum 3 cards per row */}
        {results.length > 0 ? (
          <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {results.map((person) => (
              <JobseekerCard
                key={person.id}
                person={person}
              />
            ))}
          </div>
        ) : (
          /* Empty state */
          <div className="mt-8 rounded-2xl border border-dashed border-gray-300 bg-gray-50 px-6 py-12 text-center">
            <p className="text-lg font-bold text-navy">
              No jobseekers match these filters yet.
            </p>

            <p className="mt-1 text-sm text-gray-600 cursor-pointer">
              Try another service or turn off
              {" "} &ldquo;Available now only&rdquo;.
            </p>

            <button
              type="button"
              onClick={reset}
              className="mt-5 rounded-lg bg-navy px-5 py-2.5 text-sm font-semibold text-white transition hover:opacity-90"
            >
              Show all jobseekers
            </button>
          </div>
        )}

      </Container>
    </section>
  );
}
