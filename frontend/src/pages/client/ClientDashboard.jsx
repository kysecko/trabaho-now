import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  MagnifyingGlassIcon,
  ClockIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";

import Button from "../../components/ui/Button";
import WelcomeModal from "../../components/shared/WelcomeModal";
import JobseekerCard from "../../components/ui/dashboard/JobseekerCard";
import { useAuth } from "../../context/AuthContext";
import api from "../../api/client";

const toCardData = (j) => ({
  id: j.id,
  name: j.name,
  avatar: j.photo_url,
  profession: j.service ?? "Service Provider",
  location: j.barangay ? `${j.barangay}, Sta. Maria` : "Sta. Maria, Bulacan",
  rating: j.rating,
  rate: j.rate ?? 0,
  rateUnit: j.rate_unit ?? "job",
  verified: j.is_verified,
});

export default function ClientDashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [jobseekers, setJobseekers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let ignore = false;

    (async () => {
      try {
        setLoading(true);
        setError(null);

        const query = new URLSearchParams({ sort: "top_rated", per_page: "8" });
        const result = await api.get(`/public/jobseekers?${query}`);

        if (!ignore) setJobseekers((result?.data ?? []).map(toCardData));
      } catch (err) {
        if (!ignore) setError(err.message);
      } finally {
        if (!ignore) setLoading(false);
      }
    })();

    return () => {
      ignore = true;
    };
  }, []);

  const handleHire = (jobseekerId) => {
    if (!user?.is_verified) {
      navigate("/verify-identity"); 
      return;
    }
    navigate(`/client/requests/new?jobseeker=${jobseekerId}`);
  };

  return (
    <>
      <WelcomeModal /> 
      
      <main className="w-full space-y-6">
        
        {/* 👇 VERIFICATION BANNERS (Made more aggressive) */}
        
        {/* Pending Banner */}
        {user?.verification_status === 'pending' && (
          <div className="rounded-xl border border-yellow-200 bg-yellow-50 p-4">
            <div className="flex items-start gap-3">
              <ClockIcon className="h-6 w-6 shrink-0 text-yellow-600" />
              <div>
                <h3 className="font-bold text-yellow-800">Your ID is under review</h3>
                <p className="text-sm text-yellow-700">
                  Please wait 24-48 hours while our admin reviews your ID. You will be able to hire workers once approved.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Unverified Banner - Triggers if is_verified is strictly false */}
        {user?.is_verified === false && user?.verification_status !== 'pending' && (
          <div className="rounded-xl border border-orange-200 bg-orange-50 p-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                <ExclamationTriangleIcon className="h-6 w-6 shrink-0 text-orange-600" />
                <div>
                  <h3 className="font-bold text-orange-800">Verify your Identity</h3>
                  <p className="text-sm text-orange-700">
                    To ensure the safety of our community, you must verify your ID before hiring workers.
                  </p>
                </div>
              </div>
              <Link 
                to="/verify-identity" 
                className="shrink-0 rounded-lg bg-orange-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-orange-700"
              >
                Verify Now
              </Link>
            </div>
          </div>
        )}

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

          <Button
            type="button"
            onClick={() => navigate("/client/search")}
            leftIcon={MagnifyingGlassIcon}
            variant="primary"
          >
            Browse Jobseekers
          </Button>
        </section>

        {/* 👇 REMOVED THE ANALYTICS GRID HERE */}

        {/* Top recommended jobseekers */}
        <section>
          <h2 className="text-2xl font-bold text-navy">
            Top Recommended Jobseekers nearby
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-muted">
            Verified skilled workers in Sta. Maria, Bulacan
          </p>

          <div className="mt-4">
            {loading && <p className="text-sm text-muted">Loading jobseekers...</p>}
            {error && <p className="text-sm text-red-500">{error}</p>}

            {!loading && !error && jobseekers.length === 0 && (
              <p className="text-sm text-muted">No jobseekers found yet.</p>
            )}

            {!loading && !error && jobseekers.length > 0 && (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
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
    </>
  );
}