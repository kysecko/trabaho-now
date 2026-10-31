import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeftIcon, MapPinIcon, StarIcon, CheckBadgeIcon } from "@heroicons/react/24/solid";
import Button from "../../components/ui/Button";
import api from "../../api/client";
import { PaperAirplaneIcon } from "@heroicons/react/24/outline";

// Helper to generate a consistent background color based on the name
const getAvatarColor = (name) => {
    const colors = [
        "bg-orange-500", "bg-blue-500", "bg-green-500",
        "bg-purple-500", "bg-pink-500", "bg-teal-500", "bg-indigo-500"
    ];
    const charCode = name?.charCodeAt(0) || 0;
    return colors[charCode % colors.length];
};

// Get first and last name initials
const getInitials = (name) => {
    return (
        name
            ?.trim()
            .split(/\s+/)
            .filter(Boolean)
            .slice(0, 2)
            .map((part) => part[0])
            .join("")
            .toUpperCase() || "?"
    );
};

// Avatar component that handles broken images and colored fallbacks
function Avatar({ src, name }) {
    const [error, setError] = useState(false);

    if (!src || error) {
        return (
            <div
                className={`flex h-20 w-20 sm:h-24 sm:w-24 shrink-0 items-center justify-center rounded-xl border-4 border-white text-xl sm:text-2xl font-bold uppercase text-white shadow-sm ${getAvatarColor(name)}`}
            >
                {getInitials(name)}
            </div>
        );
    }

    return (
        <img
            src={src}
            alt={name || "Jobseeker"}
            className="h-20 w-20 sm:h-24 sm:w-24 shrink-0 rounded-xl border-4 border-white bg-white object-cover shadow-sm"
            onError={() => setError(true)}
        />
    );
}

export default function JobseekerProfile() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [jobseeker, setJobseeker] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        let ignore = false;
        (async () => {
            try {
                setLoading(true);
                setError(null);
                const response = await api.get(`/public/jobseekers/${id}`);
                if (!ignore) setJobseeker(response.data);
            } catch (err) {
                if (!ignore) setError(err.message || "Failed to load jobseeker profile.");
            } finally {
                if (!ignore) setLoading(false);
            }
        })();
        return () => { ignore = true; };
    }, [id]);

    if (loading) {
        return (
            <div className="flex h-[50vh] items-center justify-center">
                <p className="text-sm font-medium text-gray-500">Loading jobseeker's profile...</p>
            </div>
        );
    }

    if (error || !jobseeker) {
        return (
            <div className="flex h-[50vh] flex-col items-center justify-center space-y-4">
                <p className="text-lg font-bold text-red-500">{error || "Jobseeker not found."}</p>
                <button
                    onClick={() => navigate(-1)}
                    className="text-sm font-semibold text-orange-600 hover:underline"
                >
                    Go back
                </button>
            </div>
        );
    }

    return (
        <div className="w-full max-w-5xl mx-auto space-y-4 sm:space-y-6 pb-20 px-4 sm:px-6 lg:px-0">
            {/* Back Button */}
            <button
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 text-sm font-semibold text-orange-600 hover:underline cursor-pointer"
            >
                <ArrowLeftIcon className="h-4 w-4" /> Back to Jobseekers List
            </button>

            {/* Profile Header Card */}
            <div className="rounded-2xl border border-gray-200 bg-white overflow-hidden shadow-sm">
                <div className="h-20 sm:h-24 bg-[#ff4d00]" /> {/* Orange Banner */}

                <div className="px-4 sm:px-6 pb-6 relative">
                    {/* Container for Avatar & Info */}
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 pt-4 sm:pt-6">

                        <div className="flex flex-col sm:flex-row items-start sm:items-end gap-3 sm:gap-4 w-full sm:w-auto">

                            {/* Avatar pulled up into banner */}
                            <div className="-mt-16 sm:-mt-20 shrink-0">
                                <Avatar src={jobseeker.photo_url} name={jobseeker.name} />
                            </div>

                            {/* Name & Details */}
                            <div className="pb-1 w-full mt-2 sm:mt-0">
                                <div className="flex flex-wrap items-center gap-2">
                                    <h1 className="text-xl sm:text-2xl font-bold text-navy">{jobseeker.name}</h1>
                                    {jobseeker.is_verified && (
                                        <span className="inline-flex items-center gap-1 rounded-full bg-orange-100 px-2.5 py-1 text-[10px] font-bold uppercase text-orange-600">
                                            <CheckBadgeIcon className="h-4 w-4 text-orange-600" />
                                            Verified
                                        </span>
                                    )}
                                </div>
                                <p className="text-sm text-gray-600 flex items-center gap-1 mt-1">
                                    {jobseeker.service ?? "Service Provider"} <span className="text-gray-300">•</span> <MapPinIcon className="h-4 w-4 shrink-0" /> {jobseeker.barangay ?? "Sta. Maria"}
                                </p>
                            </div>
                        </div>

                        {/* Button - Full width on mobile, auto on desktop */}
                        <div className="w-full sm:w-auto mt-2 sm:mt-0">
                            <Button rightIcon={PaperAirplaneIcon} variant="primary" className="w-full sm:w-auto px-6 py-2.5">
                                Send Hire Request
                            </Button>
                        </div>
                    </div>

                    {/* Stats Row */}
                    <div className="mt-5 sm:mt-6 flex flex-wrap items-center gap-2 sm:gap-3 border-t border-gray-100 pt-4 text-sm">
                        <div className="flex items-center gap-1 border rounded-lg px-2.5 sm:px-3 py-1.5">
                            <span className="text-gray-500">Rating</span>
                            <span className="font-bold text-navy">{jobseeker.rating ?? "0.0"}</span>
                            <StarIcon className="h-3 w-3 text-yellow-400" />
                            <span className="text-xs text-gray-400">({jobseeker.reviews_count ?? 0})</span>
                        </div>
                        <div className="flex items-center gap-1 border rounded-lg px-2.5 sm:px-3 py-1.5">
                            <span className="text-gray-500">Jobs</span>
                            <span className="font-bold text-navy">{jobseeker.completed_jobs ?? 0}</span>
                        </div>
                        <div className="flex items-center gap-1 border rounded-lg px-2.5 sm:px-3 py-1.5">
                            <span className="text-gray-500">Exp.</span>
                            <span className="font-bold text-navy">{jobseeker.experience ?? "1 year"}</span>
                        </div>
                        <div className="flex items-center gap-1 border rounded-lg px-2.5 sm:px-3 py-1.5 w-full sm:w-auto sm:ml-auto mt-1 sm:mt-0">
                            <span className="text-gray-500">Rate:</span>
                            <span className="font-bold text-navy">₱{Number(jobseeker.rate ?? 0).toLocaleString("en-PH")}</span>
                            <span className="text-xs text-gray-400">/{jobseeker.rate_unit ?? "job"}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Two Column Layout */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">

                {/* Left Column (About & Services) */}
                <div className="md:col-span-2 space-y-4 sm:space-y-6">
                    <div className="rounded-2xl border border-gray-200 bg-white p-4 sm:p-6 shadow-sm">
                        <h2 className="text-lg font-bold text-navy mb-3">About</h2>
                        <p className="text-sm text-gray-600 leading-relaxed">
                            {jobseeker.about ?? "No description provided."}
                        </p>

                        <h3 className="text-md font-bold text-navy mt-6 mb-3">Services</h3>
                        <div className="flex flex-wrap gap-2">
                            {jobseeker.services?.length > 0 ? (
                                jobseeker.services.map((s, i) => (
                                    <span key={i} className="border border-gray-200 rounded-lg px-3 py-1 text-sm font-medium text-gray-600">
                                        {s.name}
                                    </span>
                                ))
                            ) : (
                                <span className="text-sm text-gray-500">No specific services listed.</span>
                            )}
                        </div>
                    </div>

                    {/* Availability Schedule */}
                    <div className="rounded-2xl border border-gray-200 bg-white p-4 sm:p-6 shadow-sm">
                        <h2 className="text-lg font-bold text-navy mb-1">Availability Schedule</h2>
                        <p className="text-xs text-gray-500 mb-4">View available dates and select your preferred hiring schedule.</p>

                        <div className="flex justify-between items-center mb-4">
                            <button className="text-gray-500 hover:text-navy">&lt;</button>
                            <span className="font-semibold text-navy">November 2026</span>
                            <button className="text-gray-500 hover:text-navy">&gt;</button>
                        </div>

                        <div className="grid grid-cols-7 gap-1 sm:gap-2 text-center text-xs mb-2">
                            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(d => (
                                <div key={d} className="font-semibold text-gray-400 text-[10px] sm:text-xs">{d}</div>
                            ))}
                        </div>

                        {/* Calendar Grid */}
                        <div className="grid grid-cols-7 gap-1 sm:gap-2 text-center text-xs sm:text-sm">
                            {Array.from({ length: 30 }).map((_, i) => (
                                <div
                                    key={i}
                                    className={`p-1.5 sm:p-2 rounded-md border ${i % 7 === 0 ? "bg-green-50 border-green-200 text-green-700" :
                                        i % 5 === 0 ? "bg-red-50 border-red-200 text-red-700" :
                                            "bg-gray-50 border-gray-100 text-gray-600"
                                        }`}
                                >
                                    {i + 1}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right Column (Tools & Payments) */}
                <div className="space-y-4 sm:space-y-6">
                    <div className="rounded-2xl border border-gray-200 bg-white p-4 sm:p-6 shadow-sm">
                        <h2 className="text-lg font-bold text-navy mb-3">Tools & Equipments</h2>
                        <div className="flex flex-wrap gap-2">
                            {Array.from({ length: 3 }).map((_, i) => (
                                <span key={i} className="border border-orange-200 text-orange-600 rounded-lg px-3 py-1 text-xs font-medium">
                                    Tool Name
                                </span>
                            ))}
                        </div>
                    </div>

                    <div className="rounded-2xl border border-gray-200 bg-white p-4 sm:p-6 shadow-sm">
                        <h2 className="text-lg font-bold text-navy mb-3">Accepted Payments</h2>
                        <div className="flex flex-wrap gap-2">
                            {["GCash", "Maya", "Cash"].map(p => (
                                <span key={p} className="border border-orange-200 text-orange-600 rounded-lg px-4 py-1.5 text-sm font-medium">
                                    {p}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}