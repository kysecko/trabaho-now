import { useEffect, useMemo, useRef, useState } from "react";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ClockIcon,
  MapPinIcon,
  CalendarDaysIcon,
  PlusIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";


const MOCK_EVENTS = [
  { id: 1, offset: -2, title: "Repaint gate", client: "Rosa Dizon", time: "9:00 AM", type: "scheduled", location: "Brgy. Muzon" },
  { id: 2, offset: 0, title: "Install ceiling fan", client: "Pedro Reyes", time: "1:00 PM", type: "scheduled", location: "Brgy. Citrus" },
  { id: 3, offset: 1, title: "Fix leaking roof", client: "Maria Santos", time: "8:00 AM", type: "emergency", location: "Brgy. Muzon" },
  { id: 4, offset: 3, title: "Roof warranty check", client: "Maria Santos", time: "9:00 AM", type: "backjob", location: "Brgy. Muzon" },
  { id: 5, offset: 3, title: "Aircon cleaning", client: "Ana Lim", time: "2:00 PM", type: "scheduled", location: "Brgy. Graceville" },
  { id: 6, offset: 4, title: "Replace faucet", client: "Jun Pascual", time: "10:00 AM", type: "scheduled", location: "Brgy. Kaypian" },
  { id: 7, offset: 12, title: "Wiring inspection", client: "Carla Mendoza", time: "11:00 AM", type: "scheduled", location: "Brgy. Minuyan" },
];

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

/* The three availability options a jobseeker can set for a day */
const STATUS = {
  available: {
    label: "Available",
    hint: "Clients can send you requests for this day.",
    sub: "Open for new requests",
    cell: "bg-green-50",
    num: "text-green-700",
    bar: "bg-green-500",
    text: "text-green-700",
    active: "border-green-500 bg-green-50 text-green-700",
  },
  booked: {
    label: "Booked",
    hint: "You’re not taking new requests on this day.",
    sub: "Taken, e.g. a job outside the app",
    cell: "bg-red-50",
    num: "text-red-700",
    bar: "bg-red-500",
    text: "text-red-700",
    active: "border-red-500 bg-red-50 text-red-700",
  },
  dayoff: {
    label: "Day off",
    hint: "You’re not working. Clients can’t book you on this day.",
    sub: "Not working that day",
    cell: "bg-slate-100",
    num: "text-slate-600",
    bar: "bg-slate-400",
    text: "text-slate-600",
    active: "border-slate-400 bg-slate-100 text-slate-700",
  },
};
const STATUS_KEYS = Object.keys(STATUS);

/* Job type colors (left border on chips, dots, badges) */
const TYPES = {
  scheduled: { label: "Scheduled", border: "border-blue-500", dot: "bg-blue-500", badge: null },
  emergency: { label: "Emergency", border: "border-red-500", dot: "bg-red-500", badge: "bg-red-100 text-red-700" },
  backjob: { label: "Back-job", border: "border-amber-500", dot: "bg-amber-500", badge: "bg-amber-100 text-amber-700" },
};

const DEFAULT_START = "08:00";
const DEFAULT_END = "17:00";
const HATCH = "repeating-linear-gradient(135deg,#f1f5f9 0 6px,#e2e8f0 6px 12px)";

/* ---------------------------- helpers --------------------------- */
const pad = (n) => String(n).padStart(2, "0");
const startOfDay = (d) => new Date(d.getFullYear(), d.getMonth(), d.getDate());
const addDays = (d, n) => {
  const x = startOfDay(d);
  x.setDate(x.getDate() + n);
  return x;
};
const toKey = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
const fromKey = (key) => {
  const [y, m, d] = key.split("-").map(Number);
  return new Date(y, m - 1, d);
};
const toMinutes = (t = "") => {
  const m = t.match(/(\d{1,2}):(\d{2})\s*(AM|PM)/i);
  if (!m) return 0;
  return ((+m[1] % 12) + (m[3].toUpperCase() === "PM" ? 12 : 0)) * 60 + +m[2];
};
const fmtTime = (t) => {
  const [h, m] = t.split(":").map(Number);
  return `${h % 12 || 12}:${pad(m)} ${h >= 12 ? "PM" : "AM"}`;
};
const fmtShort = (t) => {
  const [h, m] = t.split(":").map(Number);
  return `${h % 12 || 12}${m ? `:${pad(m)}` : ""}${h >= 12 ? "pm" : "am"}`;
};
const dayLabel = (d, today) => {
  const diff = Math.round((startOfDay(d) - today) / 86400000);
  if (diff === 0) return "Today";
  if (diff === 1) return "Tomorrow";
  return d.toLocaleDateString("en-PH", { month: "short", day: "numeric" });
};
const pluralDays = (n) => `${n} day${n === 1 ? "" : "s"}`;
const validTimes = (s) => !s || s.status !== "available" || s.end > s.start;

/* --------------------------- job card --------------------------- */
function EventCard({ event, onViewDetails }) {
  const t = TYPES[event.type] ?? TYPES.scheduled;
  return (
    <div className="flex gap-3 rounded-xl border border-gray-200 bg-white p-3">
      <span className={`w-1 shrink-0 rounded-full ${t.dot}`} aria-hidden="true" />
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <h4 className="font-bold text-navy">{event.title}</h4>
          {t.badge && <span className={`rounded px-2 py-0.5 text-[11px] font-bold ${t.badge}`}>{t.label}</span>}
        </div>
        <p className="mt-0.5 text-sm text-muted">{event.client}</p>
        <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted">
          <span className="inline-flex items-center gap-1"><ClockIcon className="h-3.5 w-3.5" /> {event.time}</span>
          <span className="inline-flex items-center gap-1"><MapPinIcon className="h-3.5 w-3.5" /> {event.location}</span>
        </div>
      </div>
      <button
        type="button"
        onClick={() => onViewDetails?.(event)}
        className="h-fit shrink-0 rounded-lg border border-gray-300 px-3 py-1.5 text-xs font-bold text-navy transition hover:bg-gray-50"
      >
        View details
      </button>
    </div>
  );
}

/* ------------------- "Add availability" dialog ------------------ */
function AddAvailabilityModal({ today, initialKey, eventsByDay, onClose, onSave }) {
  const todayKey = toKey(today);
  const [status, setStatus] = useState("available");
  const [from, setFrom] = useState(initialKey < todayKey ? todayKey : initialKey);
  const [to, setTo] = useState(initialKey < todayKey ? todayKey : initialKey);
  const [days, setDays] = useState(() => new Set([0, 1, 2, 3, 4, 5, 6]));
  const [start, setStart] = useState(DEFAULT_START);
  const [end, setEnd] = useState(DEFAULT_END);
  const [note, setNote] = useState("");
  const formRef = useRef(null);

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    formRef.current?.focus();
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  // Work out which dates this schedule will touch and what is invalid
  const { dates, skipped, error } = useMemo(() => {
    const out = [];
    let skip = 0;
    let err = "";
    if (!from || !to) err = "Choose a start and end date.";
    else if (from < todayKey) err = "Start date can’t be in the past.";
    else if (to < from) err = "End date must be on or after the start date.";
    else if ((fromKey(to) - fromKey(from)) / 86400000 > 180) err = "Choose a range of 6 months or less.";
    else if (days.size === 0) err = "Pick at least one weekday.";
    else if (status === "available" && end <= start) err = "End time must be after the start time.";

    if (!err) {
      const span = Math.round((fromKey(to) - fromKey(from)) / 86400000);
      for (let i = 0; i <= span; i++) {
        const d = addDays(fromKey(from), i);
        if (!days.has(d.getDay())) continue;
        const k = toKey(d);
        if (eventsByDay[k]?.length) skip++;
        else out.push(k);
      }
      if (out.length === 0) err = "No days to update. Days with jobs are always booked.";
    }
    return { dates: out, skipped: skip, error: err };
  }, [from, to, days, status, start, end, todayKey, eventsByDay]);

  const toggleWeekday = (i) =>
    setDays((prev) => {
      const next = new Set(prev);
      next.has(i) ? next.delete(i) : next.add(i);
      return next;
    });

  const submit = (e) => {
    e.preventDefault();
    if (error) return;
    onSave(dates, {
      status,
      start: status === "available" ? start : DEFAULT_START,
      end: status === "available" ? end : DEFAULT_END,
      note: note.trim(),
    });
  };

  const input = "w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-800 focus-visible:outline-2 focus-visible:outline-primary";
  const label = "mb-1 block text-xs font-semibold text-muted";

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <form
        ref={formRef}
        tabIndex={-1}
        onSubmit={submit}
        role="dialog"
        aria-modal="true"
        aria-labelledby="add-availability-title"
        className="relative max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-t-2xl outline-none bg-white p-5 shadow-2xl sm:rounded-2xl sm:p-6"
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute right-4 top-4 rounded-full p-1 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600"
        >
          <XMarkIcon className="h-5 w-5" />
        </button>

        <h2 id="add-availability-title" className="text-xl font-bold text-navy">Add availability</h2>
        <p className="mt-1 text-sm text-muted">Set one day or a whole stretch at once.</p>

        {/* Status */}
        <fieldset className="mt-5">
          <legend className={label}>What’s your status?</legend>
          <div className="grid gap-2 sm:grid-cols-3">
            {STATUS_KEYS.map((k) => (
              <button
                key={k}
                type="button"
                aria-pressed={status === k}
                onClick={() => setStatus(k)}
                className={`rounded-xl border-2 p-3 text-left transition ${
                  status === k ? STATUS[k].active : "border-gray-200 bg-white text-navy hover:border-gray-300"
                }`}
              >
                <span className="flex items-center gap-2 text-sm font-bold">
                  <span className={`h-2.5 w-2.5 rounded-full ${STATUS[k].bar}`} />
                  {STATUS[k].label}
                </span>
                <span className="mt-1 block text-xs font-normal text-muted">{STATUS[k].sub}</span>
              </button>
            ))}
          </div>
        </fieldset>

        {/* Dates */}
        <div className="mt-5 grid grid-cols-2 gap-3">
          <div>
            <label htmlFor="av-from" className={label}>From</label>
            <input
              id="av-from"
              type="date"
              min={todayKey}
              value={from}
              onChange={(e) => {
                setFrom(e.target.value);
                if (to < e.target.value) setTo(e.target.value);
              }}
              className={input}
            />
          </div>
          <div>
            <label htmlFor="av-to" className={label}>To</label>
            <input id="av-to" type="date" min={from || todayKey} value={to} onChange={(e) => setTo(e.target.value)} className={input} />
          </div>
        </div>

        {/* Weekdays */}
        <fieldset className="mt-4">
          <legend className={label}>Repeat on</legend>
          <div className="flex flex-wrap gap-2">
            {WEEKDAYS.map((d, i) => (
              <button
                key={d}
                type="button"
                aria-pressed={days.has(i)}
                onClick={() => toggleWeekday(i)}
                className={`rounded-full border px-3 py-1 text-xs font-semibold transition ${
                  days.has(i) ? "border-primary bg-primary-soft text-primary" : "border-gray-300 bg-white text-gray-600 hover:border-gray-400"
                }`}
              >
                {d}
              </button>
            ))}
          </div>
        </fieldset>

        {/* Hours (available only) */}
        {status === "available" && (
          <div className="mt-4 grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="av-start" className={label}>Available from</label>
              <input id="av-start" type="time" value={start} onChange={(e) => setStart(e.target.value)} className={input} />
            </div>
            <div>
              <label htmlFor="av-end" className={label}>Until</label>
              <input id="av-end" type="time" value={end} onChange={(e) => setEnd(e.target.value)} className={input} />
            </div>
          </div>
        )}

        <div className="mt-4">
          <label htmlFor="av-note" className={label}>Note (optional)</label>
          <input
            id="av-note"
            type="text"
            maxLength={80}
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="e.g. Half day, afternoon only"
            className={input}
          />
        </div>

        {/* Summary + actions */}
        <div className="mt-5 rounded-xl bg-gray-50 p-3 text-sm" aria-live="polite">
          {error ? (
            <p className="font-semibold text-red-600">{error}</p>
          ) : (
            <p className="text-gray-700">
              <span className="font-bold text-navy">{STATUS[status].label}</span> on {pluralDays(dates.length)}
              {status === "available" && <> · {fmtTime(start)} to {fmtTime(end)}</>}
              {skipped > 0 && <span className="block text-xs text-muted">{pluralDays(skipped)} with jobs will be skipped.</span>}
            </p>
          )}
        </div>

        <div className="mt-5 flex gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 rounded-xl border border-gray-300 bg-white py-2.5 text-sm font-bold text-gray-700 transition hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={Boolean(error)}
            className="flex-1 rounded-xl bg-primary py-2.5 text-sm font-bold text-white transition hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-40"
          >
            Save schedule
          </button>
        </div>
      </form>
    </div>
  );
}

/* ------------------------------ page ---------------------------- */
export default function JobseekerCalendar({ events = null, onViewDetails, onScheduleChange }) {
  const today = useMemo(() => startOfDay(new Date()), []);
  const todayKey = toKey(today);

  const [month, setMonth] = useState(new Date(today.getFullYear(), today.getMonth(), 1));
  const [selected, setSelected] = useState(today);
  const [modalOpen, setModalOpen] = useState(false);
  const [notice, setNotice] = useState("");
  const noticeTimer = useRef(null);
  const panelRef = useRef(null);

  // schedule: { "2026-11-06": { status, start, end, note } }
  const [schedule, setSchedule] = useState(() => ({
    [toKey(addDays(today, 2))]: { status: "available", start: "08:00", end: "17:00", note: "" },
    [toKey(addDays(today, 5))]: { status: "available", start: "08:00", end: "12:00", note: "Morning only" },
    [toKey(addDays(today, 6))]: { status: "dayoff", start: DEFAULT_START, end: DEFAULT_END, note: "" },
    [toKey(addDays(today, 8))]: { status: "booked", start: DEFAULT_START, end: DEFAULT_END, note: "Booked outside the app" },
  }));

  useEffect(() => () => clearTimeout(noticeTimer.current), []);
  const notify = (msg) => {
    setNotice(msg);
    clearTimeout(noticeTimer.current);
    noticeTimer.current = setTimeout(() => setNotice(""), 2600);
  };

  const eventsByDay = useMemo(() => {
    const source = events ?? MOCK_EVENTS.map((e) => ({ ...e, date: toKey(addDays(today, e.offset)) }));
    const map = {};
    source.forEach((e) => (map[e.date] ||= []).push(e));
    Object.values(map).forEach((list) => list.sort((a, b) => toMinutes(a.time) - toMinutes(b.time)));
    return map;
  }, [events, today]);

  // A day with jobs is always Booked. Otherwise use what the jobseeker set.
  const effective = (key) => (eventsByDay[key]?.length ? { status: "booked", auto: true } : schedule[key] ?? null);

  const cells = useMemo(() => {
    const first = new Date(month.getFullYear(), month.getMonth(), 1);
    const lead = first.getDay();
    const length = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate();
    const total = Math.ceil((lead + length) / 7) * 7;
    return Array.from({ length: total }, (_, i) => addDays(first, i - lead));
  }, [month]);

  const monthCounts = useMemo(() => {
    const counts = { available: 0, booked: 0, dayoff: 0 };
    const length = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate();
    for (let d = 1; d <= length; d++) {
      const key = toKey(new Date(month.getFullYear(), month.getMonth(), d));
      const eff = eventsByDay[key]?.length ? { status: "booked" } : schedule[key];
      if (eff) counts[eff.status]++;
    }
    return counts;
  }, [month, schedule, eventsByDay]);

  const upcoming = useMemo(
    () =>
      Object.entries(eventsByDay)
        .filter(([k]) => k >= todayKey)
        .sort(([a], [b]) => a.localeCompare(b))
        .flatMap(([k, list]) => list.map((e) => ({ ...e, key: k })))
        .slice(0, 4),
    [eventsByDay, todayKey]
  );

  const selKey = toKey(selected);
  const selEvents = eventsByDay[selKey] ?? [];
  const selEff = effective(selKey);
  const selLocked = selEvents.length > 0;
  const selPast = selected < today;
  const selSchedule = schedule[selKey];

  const selectDay = (d) => {
    setSelected(d);
    if (d.getMonth() !== month.getMonth() || d.getFullYear() !== month.getFullYear()) {
      setMonth(new Date(d.getFullYear(), d.getMonth(), 1));
    }
  };
  // When the day panel sits below the grid (screens narrower than xl), bring it into view
  const scrollToPanel = () => {
    if (!window.matchMedia("(max-width: 1279px)").matches) return;
    const calm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    requestAnimationFrame(() => panelRef.current?.scrollIntoView({ behavior: calm ? "auto" : "smooth", block: "nearest" }));
  };
  const shiftMonth = (n) => setMonth(new Date(month.getFullYear(), month.getMonth() + n, 1));
  const goToday = () => {
    setMonth(new Date(today.getFullYear(), today.getMonth(), 1));
    setSelected(today);
  };

  const commit = (next) => {
    setSchedule(next);
    onScheduleChange?.(next);
  };
  const setDayStatus = (status) =>
    commit({
      ...schedule,
      [selKey]: { start: DEFAULT_START, end: DEFAULT_END, note: "", ...schedule[selKey], status },
    });
  const setDayTime = (field, value) =>
    commit({ ...schedule, [selKey]: { ...schedule[selKey], [field]: value } });
  const clearDay = () => {
    const next = { ...schedule };
    delete next[selKey];
    commit(next);
  };
  const saveSchedule = (dates, payload) => {
    const next = { ...schedule };
    dates.forEach((k) => (next[k] = payload));
    commit(next);
    setModalOpen(false);
    notify(`Saved: ${STATUS[payload.status].label} for ${pluralDays(dates.length)}`);
  };

  const subtitle = selEvents.length
    ? `${selEvents.length} job${selEvents.length > 1 ? "s" : ""} scheduled`
    : selEff
    ? `${STATUS[selEff.status].label}${
        selEff.status === "available" && validTimes(selEff) ? ` · ${fmtTime(selEff.start)} to ${fmtTime(selEff.end)}` : ""
      }`
    : "No availability set";

  return (
    <div className="space-y-6 ">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-navy">My Calendar</h1>
          <p className="mt-1 text-sm text-muted">Show clients when you’re available, booked, or off.</p>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={goToday}
            className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-navy transition hover:bg-gray-50"
          >
            <CalendarDaysIcon className="h-4 w-4 text-primary" />
            Today
          </button>
          <button
            type="button"
            onClick={() => setModalOpen(true)}
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-bold text-white transition hover:bg-primary-hover"
          >
            <PlusIcon className="h-4 w-4" />
            Add availability
          </button>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_340px]">
        {/* Month grid */}
        <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
          <div className="flex items-center justify-between gap-3 border-b border-gray-200 px-4 py-4 sm:px-5">
            <div>
              <h2 className="text-lg font-bold text-navy" aria-live="polite">
                {month.toLocaleDateString("en-PH", { month: "long", year: "numeric" })}
              </h2>
              <p className="text-xs text-muted">
                {monthCounts.available} available · {monthCounts.booked} booked · {monthCounts.dayoff} off
              </p>
            </div>
            <div className="flex items-center gap-1">
              <button type="button" onClick={() => shiftMonth(-1)} aria-label="Previous month" className="rounded-lg border border-gray-200 p-2 text-gray-600 transition hover:bg-gray-50">
                <ChevronLeftIcon className="h-4 w-4" />
              </button>
              <button type="button" onClick={() => shiftMonth(1)} aria-label="Next month" className="rounded-lg border border-gray-200 p-2 text-gray-600 transition hover:bg-gray-50">
                <ChevronRightIcon className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-7 border-b border-gray-200 bg-gray-50">
            {WEEKDAYS.map((d) => (
              <div key={d} className="py-2 text-center text-xs font-semibold text-muted">{d}</div>
            ))}
          </div>

          <div className="-mb-px -mr-px grid grid-cols-7">
            {cells.map((d) => {
              const key = toKey(d);
              const inMonth = d.getMonth() === month.getMonth();
              const evs = inMonth ? eventsByDay[key] ?? [] : [];
              const eff = inMonth ? effective(key) : null;
              const st = eff ? STATUS[eff.status] : null;
              const isToday = key === todayKey;
              const isSel = key === selKey;
              const past = d < today;

              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => {
                    selectDay(d);
                    scrollToPanel();
                  }}
                  aria-pressed={isSel}
                  aria-current={isToday ? "date" : undefined}
                  aria-label={`${d.toLocaleDateString("en-PH", { month: "long", day: "numeric" })}, ${
                    evs.length ? `${evs.length} job${evs.length > 1 ? "s" : ""}, booked` : st ? st.label : "not set"
                  }`}
                  style={eff?.status === "dayoff" ? { backgroundImage: HATCH } : undefined}
                  className={`relative flex min-h-16 flex-col gap-1 overflow-hidden border-b border-r border-gray-100 p-1.5 pb-2 text-left transition focus-visible:z-10 focus-visible:outline-2 focus-visible:outline-primary md:min-h-28 md:p-2 ${
                    st && eff.status !== "dayoff" ? st.cell : eff?.status === "dayoff" ? "" : inMonth ? "bg-white" : "bg-gray-50"
                  } ${isSel ? "z-10 ring-2 ring-inset ring-primary" : "hover:brightness-95"}`}
                >
                  <span
                    className={`flex h-7 w-7 items-center justify-center rounded-full text-sm font-bold ${
                      isToday ? "bg-primary text-white" : !inMonth ? "text-gray-300" : past ? "text-gray-400" : st ? st.num : "text-navy"
                    }`}
                  >
                    {d.getDate()}
                  </span>

                  {/* Desktop: job chips or availability label */}
                  <div className={`hidden min-w-0 flex-1 flex-col gap-1 md:flex ${past ? "opacity-60" : ""}`}>
                    {evs.slice(0, 2).map((e) => (
                      <div
                        key={e.id}
                        className={`truncate rounded border-l-2 bg-white px-1.5 py-0.5 text-[11px] font-semibold text-navy shadow-sm ${(TYPES[e.type] ?? TYPES.scheduled).border}`}
                      >
                        {e.time.replace(":00", "")} {e.title}
                      </div>
                    ))}
                    {evs.length > 2 && <span className="px-1 text-[11px] font-semibold text-muted">+{evs.length - 2} more</span>}
                    {evs.length === 0 && st && (
                      <span className={`px-1 text-[11px] font-semibold leading-tight ${st.text}`}>
                        {st.label}
                        {eff.status === "available" && validTimes(eff) && (
                          <span className="block truncate font-medium opacity-80">
                            {fmtShort(eff.start)}–{fmtShort(eff.end)}
                          </span>
                        )}
                      </span>
                    )}
                  </div>

                  {/* Mobile: job dots */}
                  <div className="flex gap-1 md:hidden">
                    {evs.slice(0, 3).map((e) => (
                      <span key={e.id} className={`h-1.5 w-1.5 rounded-full ${(TYPES[e.type] ?? TYPES.scheduled).dot}`} />
                    ))}
                  </div>

                  {/* Status bar */}
                  {st && <span className={`absolute inset-x-0 bottom-0 h-1 ${st.bar}`} aria-hidden="true" />}
                </button>
              );
            })}
          </div>

          {/* Legend */}
          <div className="flex flex-wrap gap-x-5 gap-y-2 border-t border-gray-200 px-4 py-3 text-xs text-muted sm:px-5">
            {STATUS_KEYS.map((k) => (
              <span key={k} className="inline-flex items-center gap-1.5">
                <span className={`h-2.5 w-2.5 rounded-sm ${STATUS[k].bar}`} /> {STATUS[k].label}
              </span>
            ))}
            <span className="hidden h-4 w-px bg-gray-200 sm:block" />
            {Object.entries(TYPES).map(([k, t]) => (
              <span key={k} className="inline-flex items-center gap-1.5">
                <span className={`h-2.5 w-2.5 rounded-full ${t.dot}`} /> {t.label} job
              </span>
            ))}
          </div>
        </section>

        {/* Side column */}
        <div className="grid items-start gap-6 md:grid-cols-2 xl:grid-cols-1">
          {/* Selected day */}
          <section ref={panelRef} className="scroll-mt-4 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="text-lg font-bold text-navy">
                  {selected.toLocaleDateString("en-PH", { weekday: "long", month: "long", day: "numeric" })}
                </h3>
                <p className={`text-sm font-medium ${selEff ? STATUS[selEff.status].text : "text-muted"}`}>{subtitle}</p>
              </div>
              {selKey === todayKey && (
                <span className="rounded-full bg-primary-soft px-2.5 py-1 text-xs font-bold text-primary">Today</span>
              )}
            </div>

            {selEvents.length > 0 && (
              <div className="mt-4 space-y-3">
                {selEvents.map((e) => (
                  <EventCard key={e.id} event={e} onViewDetails={onViewDetails} />
                ))}
              </div>
            )}

            {/* Availability controls */}
            <div className="mt-5 border-t border-gray-100 pt-4">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-navy">Availability</h4>
                {selEff && !selLocked && !selPast && (
                  <button type="button" onClick={clearDay} className="text-xs font-semibold text-muted hover:text-navy">
                    Clear
                  </button>
                )}
              </div>

              <div role="group" aria-label="Availability for this day" className="mt-2 grid grid-cols-3 gap-2">
                {STATUS_KEYS.map((k) => {
                  const on = selEff?.status === k;
                  return (
                    <button
                      key={k}
                      type="button"
                      aria-pressed={on}
                      disabled={selLocked || selPast}
                      onClick={() => setDayStatus(k)}
                      className={`rounded-xl border-2 px-2 py-2.5 text-sm font-bold transition disabled:cursor-not-allowed ${
                        on ? STATUS[k].active : "border-gray-200 bg-white text-navy hover:border-gray-300 disabled:opacity-50 disabled:hover:border-gray-200"
                      }`}
                    >
                      {STATUS[k].label}
                    </button>
                  );
                })}
              </div>

              <p className="mt-2 text-xs text-muted">
                {selLocked
                  ? "Booked automatically because you have jobs on this day."
                  : selPast
                  ? "Past days can’t be changed."
                  : selEff
                  ? STATUS[selEff.status].hint
                  : "Not set yet. Pick an option so clients know if you’re free."}
              </p>

              {!selLocked && !selPast && selEff?.status === "available" && (
                <div className="mt-3 grid grid-cols-2 gap-3">
                  <div>
                    <label htmlFor="day-start" className="mb-1 block text-xs font-semibold text-muted">From</label>
                    <input
                      id="day-start"
                      type="time"
                      value={selSchedule?.start ?? DEFAULT_START}
                      onChange={(e) => setDayTime("start", e.target.value)}
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus-visible:outline-2 focus-visible:outline-primary"
                    />
                  </div>
                  <div>
                    <label htmlFor="day-end" className="mb-1 block text-xs font-semibold text-muted">Until</label>
                    <input
                      id="day-end"
                      type="time"
                      value={selSchedule?.end ?? DEFAULT_END}
                      onChange={(e) => setDayTime("end", e.target.value)}
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus-visible:outline-2 focus-visible:outline-primary"
                    />
                  </div>
                  {!validTimes(selSchedule) && (
                    <p className="col-span-2 text-xs font-semibold text-red-600">End time must be after the start time.</p>
                  )}
                </div>
              )}

              {!selLocked && selSchedule?.note && <p className="mt-3 text-sm text-gray-600">Note: {selSchedule.note}</p>}
            </div>
          </section>

          {/* Up next */}
          <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <h3 className="text-lg font-bold text-navy">Up next</h3>
            {upcoming.length === 0 ? (
              <p className="mt-3 text-sm text-muted">No upcoming jobs. New requests will show up here.</p>
            ) : (
              <ul className="mt-3 divide-y divide-gray-100">
                {upcoming.map((e) => (
                  <li key={e.id}>
                    <button
                      type="button"
                      onClick={() => selectDay(fromKey(e.key))}
                      className="flex w-full items-center gap-3 py-3 text-left transition hover:bg-gray-50"
                    >
                      <span className={`h-8 w-1 shrink-0 rounded-full ${(TYPES[e.type] ?? TYPES.scheduled).dot}`} />
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-sm font-bold text-navy">{e.title}</span>
                        <span className="block truncate text-xs text-muted">{e.client}</span>
                      </span>
                      <span className="shrink-0 text-right text-xs">
                        <span className="block font-semibold text-navy">{dayLabel(fromKey(e.key), today)}</span>
                        <span className="text-muted">{e.time}</span>
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>
      </div>

      {modalOpen && (
        <AddAvailabilityModal
          today={today}
          initialKey={selKey}
          eventsByDay={eventsByDay}
          onClose={() => setModalOpen(false)}
          onSave={saveSchedule}
        />
      )}

      <div
        role="status"
        className={`pointer-events-none fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-lg bg-navy px-4 py-2.5 text-sm font-semibold text-white shadow-lg transition-opacity ${
          notice ? "opacity-100" : "opacity-0"
        }`}
      >
        {notice}
      </div>
    </div>
  );
} 