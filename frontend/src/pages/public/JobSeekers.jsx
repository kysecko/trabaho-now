import { useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { CheckBadgeIcon, MapPinIcon } from "@heroicons/react/24/outline";
import { StarIcon } from "@heroicons/react/24/solid";
import { useQuery } from "@tanstack/react-query";
import Container from "../../components/layout/Container";
import { SectionHeading } from "../../components/ui/public/PublicUI";
import { getPublicJobseekers } from "../../api/public";
import { SERVICE_NAMES, STATUS_STYLES } from "../../lib/sampleJobseekers";

export default function Jobseekers() {
  const [params, setParams] = useSearchParams();
  const service = params.get("service") || "All";
  const [onlyAvailable, setOnlyAvailable] = useState(false);

  // TanStack Query handles fetching, caching, and loading states
  const { data: jobseekers = [], isLoading, isError, error } = useQuery({
    queryKey: ['publicJobseekers'],
    queryFn: async () => {
      const res = await getPublicJobseekers();
      // Handle Laravel pagination safely
      return Array.isArray(res) ? res : res.data || [];
    },
    staleTime: 1000 * 60 * 5, // Keep cached for 5 minutes (switching tabs won't refresh)
  });

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

          {!isLoading && !isError && (
            <p className="text-sm font-medium text-gray-600" aria-live="polite">
              {results.length} {results.length === 1 ? "jobseeker" : "jobseekers"}
              {service !== "All" && ` in ${service}`}
            </p>
          )}
        </div>

        {/* Results */}
        {isLoading ? (
          <p className="mt-8 text-sm text-gray-600">Loading jobseekers...</p>
        ) : isError ? (
          <div className="mt-8 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
            {error?.message || "Could not load jobseekers."}
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