import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { CheckBadgeIcon, MapPinIcon } from "@heroicons/react/24/outline";
import { StarIcon } from "@heroicons/react/24/solid";
import Container from "../../components/layout/Container";
import { SectionHeading } from "../../components/ui/public/PublicUI";
import { getPublicJobseekers } from "../../api/public";
import { SERVICE_NAMES } from "../../lib/sampleJobseekers";

// 1. Helper to get initials
const initialsOf = (name) => {
  if (!name) return "?";
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .substring(0, 2);
};

// 2. The Avatar Component
const JobseekerAvatar = ({ name, photo }) => {
  if (photo) {
    return (
      <img
        src={photo}
        alt={name}
        className="h-16 w-16 rounded-full object-cover"
      />
    );
  }
  return (
    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-orange-100 text-xl font-bold text-orange-600">
      {initialsOf(name)}
    </div>
  );
};

// 3. The Missing JobseekerCard Component
const JobseekerCard = ({ person }) => {
  return (
    <div className="flex flex-col justify-between rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:shadow-md">
      <div>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <JobseekerAvatar name={person.name} photo={person.photo_path} />
            <div>
              <h3 className="flex items-center gap-1 text-lg font-bold text-navy">
                {person.name}
                {person.is_verified && (
                  <CheckBadgeIcon className="h-5 w-5 text-blue-500" />
                )}
              </h3>
              <p className="text-sm font-medium text-gray-500">
                {person.service || "General Services"}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-4 flex items-center gap-4 text-sm text-gray-600">
          {person.barangay && (
            <div className="flex items-center gap-1">
              <MapPinIcon className="h-4 w-4 text-gray-400" />
              <span>{person.barangay}</span>
            </div>
          )}
          <div className="flex items-center gap-1">
            <StarIcon className="h-4 w-4 text-yellow-400" />
            <span className="font-semibold text-navy">5.0</span>
            <span className="text-gray-400">(0 reviews)</span>
          </div>
        </div>

        {person.bio && (
          <p className="mt-3 line-clamp-2 text-sm text-gray-600">
            {person.bio}
          </p>
        )}
      </div>

      <div className="mt-5 flex items-center justify-between border-t border-gray-100 pt-4">
        <div>
          <p className="text-xs text-gray-500">Starting at</p>
          <p className="text-lg font-bold text-navy">
            ₱{person.rate || "500"}
            <span className="text-sm font-normal text-gray-500">/hr</span>
          </p>
        </div>
        <Link
          to={`/profile/${person.id}`}
          className="rounded-lg bg-navy px-4 py-2 text-sm font-semibold text-white transition hover:bg-gray-800"
        >
          View Profile
        </Link>
      </div>
    </div>
  );
};

// 4. The Main Page Component
export default function Jobseekers() {
  const [params, setParams] = useSearchParams();
  const service = params.get("service") || "All";
  const [onlyAvailable, setOnlyAvailable] = useState(false);

  const [jobseekers, setJobseekers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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
          (!onlyAvailable || person.status === "Available")
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
                className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${
                  active
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
            onClick={() => setOnlyAvailable((v) => !v)}
            aria-pressed={onlyAvailable}
            className={`inline-flex cursor-pointer items-center gap-2.5 rounded-full border px-4 py-2 text-sm font-semibold transition ${
              onlyAvailable
                ? "border-green-600 bg-green-100 text-green-800"
                : "border-gray-300 bg-white text-navy hover:border-navy"
            }`}
          >
            <span className="h-2.5 w-2.5 rounded-full bg-green-500" />
            Available now only
          </button>

          {!loading && !error && (
            <p className="text-sm font-medium text-gray-600" aria-live="polite">
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