import { useState } from "react";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ClockIcon,
  MapPinIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";

// MOCK DATA for the calendar
const MOCK_EVENTS = [
  { id: 1, day: 1, title: "Fix leaking roof", client: "Maria Santos", time: "8:00 AM", type: "emergency", location: "Brgy. Muzon" },
  { id: 2, day: 3, title: "Install ceiling fan", client: "Pedro Reyes", time: "1:00 PM", type: "scheduled", location: "Brgy. Citrus" },
  { id: 3, day: 5, title: "BACK JOB: Roof warranty", client: "Maria Santos", time: "9:00 AM", type: "backjob", location: "Brgy. Muzon" },
  { id: 4, day: 6, title: "Aircon Cleaning", client: "Ana Lim", time: "10:00 AM", type: "scheduled", location: "Brgy. Graceville" },
];

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export default function JobseekerCalendar() {
  // For demo purposes, we assume the current week starts on Sunday (Index 0)
  const [currentWeek, setCurrentWeek] = useState(1); 
  const [selectedDay, setSelectedDay] = useState(null);

  // Dummy logic to generate days (1-7) for the current week
  const weekDays = [1, 2, 3, 4, 5, 6, 7]; 

  const handlePrevWeek = () => setCurrentWeek((prev) => prev - 1);
  const handleNextWeek = () => setCurrentWeek((prev) => prev + 1);

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">My Calendar</h1>
          <p className="text-gray-500 text-sm mt-1">Manage your schedule, availability, and reservations.</p>
        </div>
        
        {/* Week Navigator */}
        <div className="flex items-center gap-3 bg-white border border-gray-200 rounded-lg p-1">
          <button onClick={handlePrevWeek} className="p-1.5 hover:bg-gray-100 rounded-md text-gray-600">
            <ChevronLeftIcon className="w-5 h-5" />
          </button>
          <span className="font-bold text-sm text-gray-700 px-2">Week {currentWeek}</span>
          <button onClick={handleNextWeek} className="p-1.5 hover:bg-gray-100 rounded-md text-gray-600">
            <ChevronRightIcon className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {/* Days Header */}
        <div className="grid grid-cols-7 border-b border-gray-200 bg-gray-50">
          {DAYS.map((day) => (
            <div key={day} className="p-3 text-center text-xs font-bold text-gray-500 uppercase tracking-wider">
              {day}
            </div>
          ))}
        </div>

        {/* Days Cells */}
        <div className="grid grid-cols-7 h-96">
          {weekDays.map((day, index) => {
            // Find events for this day
            const dayEvents = MOCK_EVENTS.filter((e) => e.day === day);
            const isToday = day === 3; // Hardcoded for demo

            return (
              <div
                key={day}
                onClick={() => setSelectedDay(day)}
                className={`border-r border-b border-gray-100 p-2 cursor-pointer transition-colors hover:bg-gray-50 flex flex-col ${
                  isToday ? "bg-orange-50/30" : ""
                }`}
              >
                <span className={`text-sm font-bold w-7 h-7 flex items-center justify-center rounded-full ${
                  isToday ? "bg-[#ff4d00] text-white" : "text-gray-700"
                }`}>
                  {day + (currentWeek - 1) * 7}
                </span>

                {/* Render small event bars */}
                <div className="mt-2 space-y-1 overflow-y-auto flex-1">
                  {dayEvents.map((event) => {
                    let colorClass = "bg-blue-100 text-blue-800 border-blue-200"; // scheduled
                    if (event.type === "emergency") colorClass = "bg-red-100 text-red-800 border-red-200";
                    if (event.type === "backjob") colorClass = "bg-yellow-100 text-yellow-800 border-yellow-200";

                    return (
                      <div key={event.id} className={`text-[10px] truncate p-1 rounded border-l-2 font-semibold ${colorClass}`}>
                        {event.time} - {event.title}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Legend */}
      <div className="flex gap-4 text-sm text-gray-600">
        <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-blue-400"></span> Scheduled</div>
        <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-red-400"></span> Emergency</div>
        <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-yellow-400"></span> Back-Job</div>
      </div>

      {/* Selected Day Details Drawer (Mobile friendly) */}
      {selectedDay && (
        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm animate-in slide-in-from-bottom-2 duration-200">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-gray-800 text-lg">
              Events for Day {selectedDay + (currentWeek - 1) * 7}
            </h3>
            <button onClick={() => setSelectedDay(null)} className="text-sm font-semibold text-gray-500 hover:text-gray-800">Close</button>
          </div>

          {MOCK_EVENTS.filter((e) => e.day === selectedDay).length === 0 ? (
            <p className="text-sm text-gray-500 italic py-4">No jobs scheduled for this day. You are available.</p>
          ) : (
            <div className="space-y-3">
              {MOCK_EVENTS.filter((e) => e.day === selectedDay).map((event) => (
                <div key={event.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 bg-gray-50 rounded-lg border border-gray-100">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-bold text-gray-900">{event.title}</h4>
                      {event.type === 'emergency' && <span className="text-[10px] bg-red-100 text-red-700 font-bold px-2 py-0.5 rounded">EMERGENCY</span>}
                      {event.type === 'backjob' && <span className="text-[10px] bg-yellow-100 text-yellow-700 font-bold px-2 py-0.5 rounded">BACK-JOB</span>}
                    </div>
                    <p className="text-sm text-gray-600 font-medium">Client: {event.client}</p>
                    <div className="flex items-center gap-4 text-xs text-gray-500 mt-2">
                      <span className="flex items-center gap-1"><ClockIcon className="w-3.5 h-3.5"/> {event.time}</span>
                      <span className="flex items-center gap-1"><MapPinIcon className="w-3.5 h-3.5"/> {event.location}</span>
                    </div>
                  </div>
                  <button className="shrink-0 px-4 py-2 bg-white border border-gray-300 text-gray-700 text-sm font-bold rounded-lg hover:bg-gray-50">View Details</button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}