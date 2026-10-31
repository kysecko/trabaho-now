import { useEffect, useState } from "react";
import {
  MagnifyingGlassIcon,
  BriefcaseIcon,
  ClockIcon,
  CalendarDaysIcon,
  CheckCircleIcon,
} from "@heroicons/react/24/outline";

import Button from "../../components/ui/Button";
import AnalyticsCard from "../../components/ui/dashboard/AnalyticsCard";
import JobseekerCard from "../../components/ui/dashboard/JobseekerCard";
import { useAuth } from "../../context/AuthContext";

const API_URL = import.meta.env.VITE_API_URL;

const analytics = [
  { id: 1, title: "Active Requests", value: 0, icon: BriefcaseIcon },
  { id: 2, title: "Pending Requests", value: 0, icon: ClockIcon },
  { id: 3, title: "Upcoming Requests", value: 0, icon: CalendarDaysIcon },
  { id: 4, title: "Completed Services", value: 0, icon: CheckCircleIcon },
];

export default function ClientDashboard({ data = analytics }) {
  const { user } = useAuth();

  const [jobseekers, setJobseekers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const controller = new AbortController();

    (async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch(
          `${API_URL}/api/public/jobseekers?sort=top_rated&per_page=8`,
          {
            headers: { Accept: "application/json" },
            signal: controller.signal,
          }
        );

        if (!res.ok) throw new Error("Failed to load jobseekers");

        const result = await res.json();
        setJobseekers(result.data ?? []);
      } catch (err) {
        if (err.name !== "AbortError") setError(err.message);
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    })();

    return () => controller.abort();
  }, []);

  const handleHire = (jobseekerId) => {
    console.log("Hire:", jobseekerId);
    // e.g. navigate(`/client/requests/new?jobseeker=${jobseekerId}`)
  };

  return (
    <main className="w-full space-y-6">
      {/* Welcome section */}
      <section className="max-w-3xl space-y-4">
        <div>
          <h1 className="text-2xl font-bold text-navy">
            Kumusta 👋, {user?.name || "there"}! Let's get your first job done.
          </h1>

          <p className="mt-2 text-sm leading-relaxed text-muted">
            Trabaho Now connects you with trusted workers in Sta. Maria and
            nearby towns, from painters to plumbers. Your account is ready,
            and everything starts with your first request.
          </p>
        </div>

        <Button leftIcon={MagnifyingGlassIcon} variant="primary">
          Browse Jobseekers
        </Button>
      </section>

      {/* Analytics section */}
      <section>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {data.map((item) => (
            <AnalyticsCard
              key={item.id}
              title={item.title}
              value={item.value}
              icon={item.icon}
            />
          ))}
        </div>
      </section>

      {/* Top recommended jobseekers */}
      <section>
        <h2 className="text-2xl font-bold text-navy">
          Top Recommended Jobseekers nearby
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-muted">
          Verified skilled workers in Sta. Maria, Bulacan
        </p>

        <div className="mt-4">
          {loading && <p className="text-sm text-muted">Loading...</p>}

          {error && <p className="text-sm text-red-500">{error}</p>}

          {!loading && !error && jobseekers.length === 0 && (
            <p className="text-sm text-muted">No jobseekers found yet.</p>
          )}

          {!loading && !error && jobseekers.length > 0 && (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {jobseekers.map((jobseeker) => (
                <JobseekerCard
                  key={jobseeker.id}
                  jobseeker={jobseeker}
                  onHire={handleHire}
                />
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}