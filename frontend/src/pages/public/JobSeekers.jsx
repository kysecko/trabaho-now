import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { CheckBadgeIcon, MapPinIcon, ShieldCheckIcon } from "@heroicons/react/24/outline";
import { StarIcon } from "@heroicons/react/24/solid";
import { HugeiconsIcon } from "@hugeicons/react";
import { SentIcon } from "@hugeicons/core-free-icons";

import Container from "../../components/layout/Container";
import { SectionHeading } from "../../components/ui/public/PublicUI";
import { getPublicJobseekers } from "../../api/public";
import { SERVICE_NAMES } from "../../lib/sampleJobseekers";

const initialsOf = (name) => {
  if (!name) return "?";
  return name.split(" ").map((n) => n[0]).join("").toUpperCase().substring(0, 2);
};

const JobseekerAvatar = ({ name, image }) => {
  if (image) {
    return <img src={image} alt={name} className="h-14 w-14 rounded-full object-cover" />;
  }
  return (
    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-orange-100 text-lg font-bold text-orange-600">
      {initialsOf(name)}
    </div>
  );
};

const JobseekerCard = ({ person }) => {
  const isAvailable = person.availability_status === 'available';

  return (
    <div className="flex flex-col justify-between rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:shadow-md">

      {/* Top Section: Avatar & Details */}
      <div>
        <div className="flex items-start gap-3">
          <JobseekerAvatar name={person.name} image={person.photo_path} />
          <div className="flex flex-col">
            <h3 className="text-lg font-bold text-navy leading-tight">
              {person.name}
            </h3>
            <p className="mt-0.5 flex items-center gap-1.5 text-sm text-gray-500">
              <span>{person.service || "General Services"}</span>
              <span className="text-gray-300">&middot;</span>
              <MapPinIcon className="h-3.5 w-3.5" />
              <span>{person.barangay || "Unknown"}</span>
            </p>
          </div>
        </div>

        {/* Badges Row (Available & Verified) */}
        <div className="mt-4 flex items-center justify-between">
          <div className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${isAvailable ? "bg-green-50 text-green-700" : "bg-gray-100 text-gray-600"
            }`}>
            <span className={`h-1.5 w-1.5 rounded-full ${isAvailable ? "bg-green-500" : "bg-gray-400"}`} />
            {isAvailable ? "Available" : "Booked"}
          </div>

          {person.is_verified && (
            <div className="inline-flex items-center gap-1 rounded-full border border-orange-200 bg-orange-50 px-2.5 py-1 text-xs font-semibold text-orange-600">
              <ShieldCheckIcon className="h-3.5 w-3.5" />
              Verified
            </div>
          )}
        </div>

        {/* Stats Box (Rating, Jobs, Cancelled) */}
        <div className="mt-4 grid grid-cols-3 gap-2 rounded-xl bg-gray-50 p-2">
          <div className="flex flex-col items-center justify-center py-1">
            <span className="text-[11px] font-medium text-gray-500">Rating</span>
            <div className="flex items-center gap-1 mt-0.5">
              <StarIcon className="h-3.5 w-3.5 text-orange-500" />
              <span className="font-bold text-navy text-sm">{person.rating || "4.8"}</span>
            </div>
          </div>
          <div className="flex flex-col items-center justify-between border-x border-gray-200 py-1">
            <span className="text-[11px] font-medium text-gray-500">Jobs done</span>
            <span className="mt-0.5 font-bold text-navy text-sm">{person.jobs || "42"}</span>
          </div>
          <div className="flex flex-col items-center justify-center py-1">
            <span className="text-[11px] font-medium text-gray-500">Cancelled</span>
            <span className="mt-0.5 font-bold text-navy text-sm">{person.cancelRate || "0"}%</span>
          </div>
        </div>
      </div>

      {/* Bottom Section: Rate & Action Button */}
      <div className="mt-5 flex items-center justify-between pt-2">
        <div>
          <p className="text-lg font-bold text-navy">
            ₱{person.rate || "500"} <span className="text-sm font-medium text-gray-500">/ hr</span>
          </p>
        </div>
        <Link
          to={`/profile/${person.id}`}
          className="inline-flex items-center gap-2 rounded-lg bg-[#ff4d00] px-5 py-2 text-sm font-bold textcd-white transition hover:bg-orange-600/90"
        >
          Hire Now
          <HugeiconsIcon
        icon={SentIcon}
        className="size-6 text-blue-600"
      />
        </Link>
      </div>
    </div>
  );
};

// ORIGINAL MAIN COMPONENT 

export default function Jobseekers() {
  const [params, setParams] = useSearchParams();
  const service = params.get("service") || "All";
  const [onlyAvailable, setOnlyAvailable] = useState(false);

  const [jobseekers, setJobseekers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // FETCHES REAL DATA FROM DATABASE
  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const res = await getPublicJobseekers();
        if (!cancelled) {
          setJobseekers(Array.isArray(res) ? res : res.data || []);
        }
      } catch (err) {
        if (!cancelled) setError(err.message || "Could not load jobseekers.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  const setService = (name) => {
    if (name === "All") setParams({});
    else setParams({ service: name });
  };

  const results = useMemo(
    () =>
      jobseekers.filter(
        (person) =>
          (service === "All" || person.service === service) &&
          (!onlyAvailable || person.availability_status === "available")
      ),
    [jobseekers, service, onlyAvailable]
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
                  ? "border-[#ff4d00] bg-[#ff4d00] text-white"
                  : "border-gray-300 bg-white text-navy hover:border-[#ff4d00]"
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
            onClick={() => setOnlyAvailable((v) => !v)}
            aria-pressed={onlyAvailable}
            className={`inline-flex cursor-pointer items-center gap-2.5 rounded-full border px-4 py-2 text-sm font-semibold transition ${onlyAvailable
              ? "border-green-600 bg-green-100 text-green-800"
              : "border-gray-300 bg-white text-navy hover:border-navy"
              }`}
          >
            <span className="h-2.5 w-2.5 rounded-full bg-green-500" />
            Available now only
          </button>

          {!loading && !error && (
            <p className="text-sm font-bold text-gray-500" aria-live="polite">
              {results.length} {results.length === 1 ? "jobseeker" : "jobseekers"}
              {service !== "All" && ` in ${service}`}
            </p>
          )}
        </div>

        {/* Results */}
        {loading ? (
          <p className="mt-8 text-sm text-gray-600">Loading jobseekers...</p>
        ) : error ? (
          <div className="mt-8 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        ) : results.length > 0 ? (
          <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {results.map((person) => (
              <JobseekerCard key={person.id} person={person} />
            ))}
          </div>
        ) : (
          <div className="mt-8 rounded-2xl border border-dashed border-gray-300 bg-gray-50 px-6 py-12 text-center">
            <p className="text-lg font-bold text-navy">
              No jobseekers match these filters yet.
            </p>
            <p className="mt-1 text-sm text-gray-600">
              Try another service or turn off &ldquo;Available now only&rdquo;.
            </p>
            <button
              type="button"
              onClick={reset}
              className="mt-5 rounded-lg bg-[#ff4d00] px-5 py-2.5 text-sm font-semibold text-white transition hover:opacity-90"
            >
              Show all jobseekers
            </button>
          </div>
        )}
      </Container>
    </section>
  );
}
