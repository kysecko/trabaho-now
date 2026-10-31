import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
    MagnifyingGlassIcon,
    UserIcon,
    AdjustmentsHorizontalIcon,
    PaperAirplaneIcon,
} from "@heroicons/react/24/outline";

import {
    MapPinIcon,
    StarIcon,
    CheckBadgeIcon,
} from "@heroicons/react/24/solid";

import api from "../../api/client";
import Button from "../../components/ui/Button";
import Field from "../../components/ui/Field";

const TAGS = [
    "All",
    "Plumber",
    "Electrician",
    "Home Cleaning",
    "Carpentry",
    "Aircon service",
    "Painting",
    "Appliance repair",
    "Gardening",
];

const RATE_OPTIONS = [500, 800, 1000, 1500, 2000];
const PER_PAGE = 9;

const INITIAL_FILTERS = {
    service: "",
    barangay: "",
    date: "",
    maxRate: "",
};

const STATUS_STYLES = {
    available: {
        label: "Available now",
        cls: "bg-green-50 text-green-600",
    },
    busy: {
        label: "Busy",
        cls: "bg-amber-50 text-amber-600",
    },
    unavailable: {
        label: "Unavailable",
        cls: "bg-gray-100 text-gray-500",
    },
};

const getAvatarColor = (name) => {
    const colors = [
        "bg-orange-100",
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

// Avatar component that handles broken images automatically
function Avatar({ src, name, getAvatarColor, getInitials }) {
    const [error, setError] = useState(false);

    if (!src || error) {
        return (
            <div
                className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-full text-lg font-bold uppercase text-primary ${getAvatarColor(name)}`}
            >
                {getInitials(name)}
            </div>
        );
    }

    return (
        <img
            src={src}
            alt={name || "Jobseeker"}
            className="h-14 w-14 shrink-0 rounded-full border border-gray-200 object-cover"
            onError={() => setError(true)}
        />
    );
}

// Debounce search input
function useDebounced(value, delay = 400) {
    const [debounced, setDebounced] = useState(value);

    useEffect(() => {
        const t = setTimeout(() => setDebounced(value), delay);

        return () => clearTimeout(t);
    }, [value, delay]);

    return debounced;
}

export default function FindJobseekers() {
    const navigate = useNavigate();

    const [search, setSearch] = useState("");
    const debouncedSearch = useDebounced(search);

    const [filters, setFilters] = useState(INITIAL_FILTERS);
    const [page, setPage] = useState(1);

    const [items, setItems] = useState([]);
    const [total, setTotal] = useState(0);
    const [lastPage, setLastPage] = useState(1);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [barangays, setBarangays] = useState([]);
    const [availableCount, setAvailableCount] = useState(null);

    // Fetch barangay options and available workers count
    useEffect(() => {
        let ignore = false;

        (async () => {
            try {
                const [b, a] = await Promise.all([
                    api.get("/public/barangays"),
                    api.get("/public/jobseekers?available=1&per_page=1"),
                ]);

                if (ignore) return;

                setBarangays(b?.data ?? []);
                setAvailableCount(a?.meta?.total ?? 0);
            } catch {
                // Non-critical request
            }
        })();

        return () => {
            ignore = true;
        };
    }, []);

    // Fetch jobseekers whenever search, filters, or page changes
    useEffect(() => {
        let ignore = false;

        (async () => {
            try {
                setLoading(true);
                setError(null);

                const params = new URLSearchParams({
                    per_page: String(PER_PAGE),
                    page: String(page),
                    sort: "top_rated",
                });

                if (debouncedSearch.trim()) {
                    params.set("q", debouncedSearch.trim());
                }

                if (filters.service) {
                    params.set("service", filters.service);
                }

                if (filters.barangay) {
                    params.set("barangay", filters.barangay);
                }

                if (filters.date) {
                    params.set("date", filters.date);
                }

                if (filters.maxRate) {
                    params.set("max_rate", filters.maxRate);
                }

                const result = await api.get(
                    `/public/jobseekers?${params}`
                );

                if (ignore) return;

                setItems(result?.data ?? []);
                setTotal(result?.meta?.total ?? 0);
                setLastPage(result?.meta?.last_page ?? 1);
            } catch (err) {
                if (!ignore) {
                    setError(err.message || "Unable to load jobseekers.");
                }
            } finally {
                if (!ignore) {
                    setLoading(false);
                }
            }
        })();

        return () => {
            ignore = true;
        };
    }, [debouncedSearch, filters, page]);

    // Update filters
    const updateFilter = (key, value) => {
        setFilters((f) => ({
            ...f,
            [key]: value,
        }));

        setPage(1);
    };

    // Reset search and filters
    const resetAll = () => {
        setSearch("");
        setFilters(INITIAL_FILTERS);
        setPage(1);
    };

    // navigate sa profile page ng bawat jobseeker
    const handleViewProfile = (id) => {
        navigate(`/client/jobseekers/${id}`);
    };

    const handleQuickHire = (id) => {
        console.log("Quick hire:", id);
    };

    return (
        <main className="w-full space-y-6 pb-20">

            {/* Header */}
            <section className="max-w-3xl space-y-4">
                <div className="flex flex-col gap-7 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-navy">
                            Find trusted local jobseekers
                        </h1>

                        <p className="mt-1 text-sm text-muted">
                            Find the right person by skill, date, location,
                            and rate—then send a request.
                        </p>
                    </div>

                    {availableCount !== null && (
                        <div className="inline-flex items-center gap-2 rounded-full border border-green-200 bg-green-50 px-4 py-2 text-sm font-semibold text-green-700">
                            <span className="h-2 w-2 animate-pulse rounded-full bg-green-500" />
                            {availableCount} Available workers today
                        </div>
                    )}
                </div>
            </section>

            {/* Search bar */}
            <form
                className="flex flex-col gap-3 sm:flex-row sm:items-end"
                onSubmit={(e) => e.preventDefault()}
            >
                <div className="flex-1">
                    <Field
                        name="search"
                        value={search}
                        onChange={(e) => {
                            setSearch(e.target.value);
                            setPage(1);
                        }}
                        placeholder="Search a job type. (e.g. plumber, technician, aircon)"
                        icon={<MagnifyingGlassIcon className="h-5 w-5" />}
                        autoComplete="off"
                    />
                </div>

                <Button
                    type="submit"
                    variant="primary"
                    className="px-8 py-2.5 sm:mb-0.5"
                >
                    Search
                </Button>
            </form>

            {/* Category tags */}
            <section className="flex flex-wrap gap-2">
                {TAGS.map((tag, index) => {
                    const value = index === 0 ? "" : tag;
                    const active = filters.service === value;

                    return (
                        <button
                            key={tag}
                            type="button"
                            onClick={() => updateFilter("service", value)}
                            className={`rounded-full border px-4 py-1.5 text-sm font-medium transition ${active
                                ? "border-[#ff4d00] bg-[#ff4d00] text-white"
                                : "border-gray-300 bg-white text-navy hover:border-primary"
                                }`}
                        >
                            {tag}
                        </button>
                    );
                })}
            </section>

            {/* Filters */}
            <section className="rounded-xl border border-gray-200 bg-white p-4">
                <div className="mb-4 flex items-center justify-between border-b border-gray-100 pb-3">
                    <div className="flex items-center gap-2 font-semibold text-navy">
                        <AdjustmentsHorizontalIcon className="h-5 w-5 text-primary" />
                        Filter Workers By:
                    </div>

                    <button
                        type="button"
                        onClick={resetAll}
                        className="text-sm font-medium text-gray-500 hover:text-navy"
                    >
                        Clear all filters
                    </button>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">

                    {/* Barangay */}
                    <div>
                        <label className="mb-1 block text-xs font-semibold text-gray-500">
                            Barangay Location:
                        </label>

                        <select
                            value={filters.barangay}
                            onChange={(e) =>
                                updateFilter("barangay", e.target.value)
                            }
                            className="w-full rounded-md border border-gray-300 p-2 text-sm text-gray-700"
                        >
                            <option value="">All barangays</option>

                            {barangays.map((b) => (
                                <option key={b} value={b}>
                                    {b}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Availability date */}
                    <div>
                        <label className="mb-1 block text-xs font-semibold text-gray-500">
                            Availability / Date:
                        </label>

                        <input
                            type="date"
                            value={filters.date}
                            min={new Date().toISOString().slice(0, 10)}
                            onChange={(e) =>
                                updateFilter("date", e.target.value)
                            }
                            className="w-full rounded-md border border-gray-300 p-2 text-sm text-gray-700"
                        />
                    </div>

                    {/* Rate */}
                    <div>
                        <label className="mb-1 block text-xs font-semibold text-gray-500">
                            Daily Budget / Rate:
                        </label>

                        <select
                            value={filters.maxRate}
                            onChange={(e) =>
                                updateFilter("maxRate", e.target.value)
                            }
                            className="w-full rounded-md border border-gray-300 p-2 text-sm text-gray-700"
                        >
                            <option value="">Any amount</option>

                            {RATE_OPTIONS.map((r) => (
                                <option key={r} value={r}>
                                    Up to ₱{r.toLocaleString("en-PH")}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            </section>

            {/* Results header */}
            <div className="text-lg font-bold text-navy">
                {loading
                    ? "Searching..."
                    : `${total} jobseeker${total === 1 ? "" : "s"} found in`}{" "}
                {!loading && (
                    <span className="text-primary">Sta. Maria</span>
                )}
            </div>

            {error && (
                <p className="text-sm text-red-500">{error}</p>
            )}

            {!loading && !error && items.length === 0 && (
                <p className="text-sm text-muted">
                    No jobseekers match your search. Try removing a filter.
                </p>
            )}

            {/* Jobseeker cards */}
            <section
                className={`grid grid-cols-1 gap-5 transition-opacity md:grid-cols-2 lg:grid-cols-3 ${loading ? "opacity-50" : ""
                    }`}
            >
                {items.map((person) => {
                    const status =
                        STATUS_STYLES[person.availability_status] ??
                        STATUS_STYLES.unavailable;

                    return (
                        <div
                            key={person.id}
                            className="relative rounded-2xl border border-gray-200 bg-white p-4 shadow-sm transition hover:shadow-md"
                        >
                            {/* Verified badge */}
                            {person.is_verified && (
                                <div className="absolute right-4 top-4 inline-flex items-center gap-1 rounded-full bg-primary-soft px-2 py-1">
                                    <CheckBadgeIcon className="h-3.5 w-3.5 text-primary" />

                                    <span className="text-[10px] font-bold text-primary">
                                        VERIFIED
                                    </span>
                                </div>
                            )}

                            {/* Profile header */}
                            <div className="flex items-start gap-3 pr-24">
                                <Avatar
                                    src={person.photo_url}
                                    name={person.name}
                                    getAvatarColor={getAvatarColor}
                                    getInitials={getInitials}
                                />

                                <div className="min-w-0">
                                    <h3 className="truncate font-bold text-navy">
                                        {person.name}
                                    </h3>

                                    <p className="text-xs text-gray-500">
                                        {person.service ?? "Service Provider"}
                                    </p>

                                    <div
                                        className={`mt-1 inline-flex rounded px-2 py-0.5 text-[10px] font-bold ${status.cls}`}
                                    >
                                        {status.label}
                                    </div>
                                </div>
                            </div>

                            {/* Location and rating */}
                            <div className="mt-4 flex items-center justify-between text-sm">
                                <div className="flex items-center gap-1 text-gray-600">
                                    <MapPinIcon className="h-4 w-4 shrink-0" />
                                    {person.barangay ?? "Sta. Maria"}
                                </div>

                                <div className="flex items-center gap-1 font-bold text-navy">
                                    {person.rating ?? "0.0"}
                                    <StarIcon className="h-4 w-4 text-yellow-400" />
                                </div>
                            </div>

                            {/* Standard rate */}
                            <div className="mt-3 flex items-center justify-between border-t border-gray-100 pt-3">
                                <span className="text-sm text-gray-500">
                                    Standard Rate
                                </span>

                                {person.rate != null ? (
                                    <span className="text-lg font-bold text-navy">
                                        ₱{Number(person.rate).toLocaleString("en-PH")}{" "}
                                        <span className="text-xs font-normal text-gray-500">
                                            / {person.rate_unit ?? "job"}
                                        </span>
                                    </span>
                                ) : (
                                    <span className="text-sm text-gray-400">
                                        Not set
                                    </span>
                                )}
                            </div>

                            {/* Actions */}
                            <div className="mt-4 flex gap-2">
                                <button
                                    type="button"
                                    onClick={() => handleViewProfile(person.id)}
                                    className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-gray-300 py-2 text-sm font-semibold text-navy transition hover:bg-gray-50"
                                >
                                    <UserIcon className="h-4 w-4" />
                                    View Full Profile
                                </button>

                                <button
                                    type="button"
                                    onClick={() => handleQuickHire(person.id)}
                                    className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-primary py-2 text-sm font-semibold text-white transition hover:bg-primary-hover"
                                >
                                    <PaperAirplaneIcon className="h-4 w-4" />
                                    Quick hire
                                </button>
                            </div>
                        </div>
                    );
                })}
            </section>

            {/* Pagination */}
            {lastPage > 1 && (
                <div className="flex items-center justify-center gap-3">
                    <button
                        type="button"
                        disabled={page <= 1 || loading}
                        onClick={() => setPage((p) => p - 1)}
                        className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-navy disabled:opacity-40"
                    >
                        Previous
                    </button>

                    <span className="text-sm text-gray-500">
                        Page {page} of {lastPage}
                    </span>

                    <button
                        type="button"
                        disabled={page >= lastPage || loading}
                        onClick={() => setPage((p) => p + 1)}
                        className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-navy disabled:opacity-40"
                    >
                        Next
                    </button>
                </div>
            )}
        </main>
    );
}