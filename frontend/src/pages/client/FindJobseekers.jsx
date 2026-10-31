import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { 
  MagnifyingGlassIcon, 
  MapPinIcon, 
  StarIcon, 
  UserIcon,
  BoltIcon,
  AdjustmentsHorizontalIcon
} from "@heroicons/react/24/outline";

export default function FindJobseekers() {
  const { user } = useAuth();

  // Dummy data based on your screenshot
  const jobseekers = [
    { id: 1, name: "Mang Juan Santos", service: "Aircon Cleaning", status: "Available now", location: "Caypombo", rating: 4.5, rate: 600, avatar: "https://i.pravatar.cc/150?img=11" },
    { id: 2, name: "Mang Juan Santos", service: "Aircon Cleaning", status: "Available now", location: "Caypombo", rating: 4.5, rate: 600, avatar: "https://i.pravatar.cc/150?img=11" },
    { id: 3, name: "Mang Juan Santos", service: "Aircon Cleaning", status: "Available now", location: "Caypombo", rating: 4.5, rate: 600, avatar: "https://i.pravatar.cc/150?img=11" },
  ];

  return (
    <main className="w-full space-y-6 pb-20">
      {/* Welcome section */}
      <section className="max-w-3xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-navy">Find trusted local jobseekers</h1>
            <p className="mt-1 text-sm text-muted">
              Find the right person by skill, date, location, and rate—then send a request.
            </p>
          </div>
          <div className="inline-flex items-center gap-2 rounded-full border border-green-200 bg-green-50 px-4 py-2 text-sm font-semibold text-green-700">
            <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>
            21 Available workers available today
          </div>
        </div>
      </section>

      {/* Search Bar */}
      <section className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search a job type. ( e.g. plumber, technician, aircon )" 
            className="w-full rounded-lg border border-gray-300 py-3 pl-11 pr-4 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
        <button className="rounded-lg bg-[#ff4d00] px-8 py-3 text-sm font-semibold text-white transition hover:bg-orange-600">
          Search
        </button>
      </section>

      {/* Filter Tags */}
      <section className="flex flex-wrap gap-2">
        {["All work", "Plumber", "Electrician", "Carpentry", "Cleaning", "Appliance Repair"].map((tag, index) => (
          <button 
            key={tag}
            className={`rounded-full border px-4 py-1.5 text-sm font-medium transition ${
              index === 0 
                ? "border-[#ff4d00] bg-[#ff4d00] text-white" 
                : "border-gray-300 bg-white text-navy hover:border-navy"
            }`}
          >
            {tag}
          </button>
        ))}
      </section>

      {/* Filter Bar */}
      <section className="rounded-xl border border-gray-200 bg-white p-4">
        <div className="flex items-center justify-between border-b border-gray-100 pb-3 mb-4">
          <div className="flex items-center gap-2 font-semibold text-navy">
            <AdjustmentsHorizontalIcon className="h-5 w-5 text-[#ff4d00]" />
            Filter Workers By:
          </div>
          <button className="text-sm font-medium text-gray-500 hover:text-navy">
            Reset all filters
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="mb-1 block text-xs font-semibold text-gray-500">Barangay Location:</label>
            <select className="w-full rounded-md border border-gray-300 p-2 text-sm text-gray-700">
              <option>Select a barangay</option>
            </select>
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold text-gray-500">Availability / Date:</label>
            <input type="date" className="w-full rounded-md border border-gray-300 p-2 text-sm text-gray-700" />
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold text-gray-500">Daily Budget / Rate:</label>
            <select className="w-full rounded-md border border-gray-300 p-2 text-sm text-gray-700">
              <option>Select amount</option>
            </select>
          </div>
        </div>
      </section>

      {/* Results Header */}
      <div className="text-lg font-bold text-navy">
        7 jobseekers found in <span className="text-[#ff4d00]">Sta. Maria</span>
      </div>

      {/* Jobseeker Cards Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {jobseekers.map((person) => (
          <div key={person.id} className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm hover:shadow-md transition">
            
            {/* Header: Avatar & Info */}
            <div className="flex items-start gap-3">
              <img src={person.avatar} alt={person.name} className="h-14 w-14 rounded-full object-cover border border-gray-200" />
              <div>
                <h3 className="font-bold text-navy flex items-center gap-1">
                  {person.name}
                </h3>
                <p className="text-xs text-gray-500">{person.service}</p>
                <div className="mt-1 inline-flex items-center gap-1 rounded bg-green-50 px-2 py-0.5 text-[10px] font-bold text-green-600">
                  {person.status}
                </div>
              </div>
            </div>

            {/* Location & Rating */}
            <div className="mt-4 flex items-center justify-between text-sm">
              <div className="flex items-center gap-1 text-gray-600">
                <MapPinIcon className="h-4 w-4" />
                {person.location}
              </div>
              <div className="flex items-center gap-1 font-bold text-navy">
                {person.rating} <StarIcon className="h-4 w-4 text-yellow-400" />
              </div>
            </div>

            {/* Rate */}
            <div className="mt-3 flex items-center justify-between border-t border-gray-100 pt-3">
              <span className="text-sm text-gray-500">Standard Rate</span>
              <span className="text-lg font-bold text-navy">₱{person.rate} <span className="text-xs font-normal text-gray-500">/ job</span></span>
            </div>

            {/* Actions */}
            <div className="mt-4 flex gap-2">
              <button className="flex-1 flex items-center justify-center gap-2 rounded-lg border border-gray-300 py-2 text-sm font-semibold text-navy hover:bg-gray-50 transition">
                <UserIcon className="h-4 w-4" /> View Full Profile
              </button>
              <button className="flex-1 flex items-center justify-center gap-2 rounded-lg bg-[#ff4d00] py-2 text-sm font-semibold text-white hover:bg-orange-600 transition">
                <BoltIcon className="h-4 w-4" /> Quick hire
              </button>
            </div>
            
          </div>
        ))}
      </section>
    </main>
  );
}