import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  WrenchScrewdriverIcon,
  PlusIcon,
  EyeIcon,
  PencilSquareIcon,
  TrashIcon,
  XMarkIcon,
  InformationCircleIcon,
} from "@heroicons/react/24/outline";
import { useAuth } from "../../context/AuthContext";

/* Same service list the clients filter by on Find Jobseekers */
const CATEGORIES = [
  "Plumber",
  "Electrician",
  "Home Cleaning",
  "Carpentry",
  "Aircon service",
  "Painting",
  "Appliance repair",
  "Gardening",
];

const RATE_UNITS = [
  { value: "job", label: "per job" },
  { value: "hour", label: "per hour" },
  { value: "day", label: "per day" },
];

const MAX_DESC = 300;

const DEMO_SERVICES = [
  { id: 1, title: "Aircon Cleaning & Repair", category: "Aircon service", description: "Split-type and window units. Cleaning, freon refill, and repair. I bring my own tools.", rate: 800, rateUnit: "job", status: "active", views: 128, requests: 14 },
  { id: 2, title: "General Carpentry", category: "Carpentry", description: "Cabinets, doors, shelves, and furniture repair.", rate: 500, rateUnit: "hour", status: "active", views: 64, requests: 5 },
  { id: 3, title: "House Painting", category: "Painting", description: "", rate: 1500, rateUnit: "day", status: "hidden", views: 0, requests: 0 },
];

const EMPTY_FORM = { title: "", category: "", description: "", rate: "", rateUnit: "job", status: "active" };

const peso = (n) => `₱${Number(n).toLocaleString("en-PH")}`;
const unitLabel = (u) => RATE_UNITS.find((r) => r.value === u)?.label ?? `per ${u}`;

/* ---------------------------- locked view ---------------------------- */
function LockedState({ onVerify }) {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-md flex-col items-center justify-center p-6 text-center">
      <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-gray-100">
        <WrenchScrewdriverIcon className="h-10 w-10 text-gray-400" />
      </div>
      <h2 className="mb-2 text-xl font-bold text-navy">Services are locked</h2>
      <p className="mb-6 text-sm text-muted">
        Verify your identity to create service posts and appear in client searches.
      </p>
      <button
        type="button"
        onClick={onVerify}
        className="rounded-xl bg-primary px-6 py-2.5 text-sm font-bold text-white transition hover:bg-primary-hover"
      >
        Verify now
      </button>
    </div>
  );
}

/* ---------------------------- live switch ---------------------------- */
function LiveSwitch({ on, onChange, label }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      aria-label={label}
      onClick={onChange}
      className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${
        on ? "bg-green-500" : "bg-gray-300"
      }`}
    >
      <span
        className={`inline-block h-5 w-5 rounded-full bg-white shadow transition-transform ${
          on ? "translate-x-5" : "translate-x-0.5"
        }`}
      />
    </button>
  );
}

/* ---------------------------- service card --------------------------- */
function ServiceCard({ service: s, onToggle, onEdit, onView }) {
  const live = s.status === "active";
  return (
    <article className={`rounded-2xl border bg-white p-5 shadow-sm ${live ? "border-gray-200" : "border-dashed border-gray-300"}`}>
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="truncate text-lg font-bold text-navy">{s.title}</h3>
            <span className="rounded-full bg-primary-soft px-2.5 py-0.5 text-xs font-bold text-primary">{s.category}</span>
          </div>
          <p className={`mt-1 line-clamp-2 text-sm ${s.description ? "text-gray-600" : "italic text-muted"}`}>
            {s.description || "No description yet. Add one so clients know what to expect."}
          </p>
        </div>
        <div className="flex shrink-0 flex-col items-end gap-1">
          <LiveSwitch on={live} onChange={() => onToggle(s)} label={`${live ? "Hide" : "Publish"} ${s.title}`} />
          <span className={`text-xs font-bold ${live ? "text-green-700" : "text-gray-500"}`}>{live ? "Live" : "Hidden"}</span>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-end justify-between gap-4 border-t border-gray-100 pt-4">
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
          <div>
            <p className="text-xl font-extrabold text-navy">
              {peso(s.rate)} <span className="text-sm font-medium text-muted">{unitLabel(s.rateUnit)}</span>
            </p>
          </div>
          <dl className="flex gap-5 text-sm">
            <div>
              <dt className="text-xs text-muted">Views</dt>
              <dd className="font-bold text-navy">{s.views}</dd>
            </div>
            <div>
              <dt className="text-xs text-muted">Requests</dt>
              <dd className="font-bold text-navy">{s.requests}</dd>
            </div>
          </dl>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => onView(s)}
            className="inline-flex items-center gap-1.5 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-semibold text-navy transition hover:bg-gray-50"
          >
            <EyeIcon className="h-4 w-4" /> Preview
          </button>
          <button
            type="button"
            onClick={() => onEdit(s)}
            className="inline-flex items-center gap-1.5 rounded-lg bg-navy px-3 py-2 text-sm font-semibold text-white transition hover:bg-navy-2"
          >
            <PencilSquareIcon className="h-4 w-4" /> Edit
          </button>
        </div>
      </div>
    </article>
  );
}

/* ---------------------------- add / edit ----------------------------- */
function ServiceModal({ service, onClose, onSave, onDelete }) {
  const editing = Boolean(service);
  const [form, setForm] = useState(() => (service ? { ...service, rate: String(service.rate) } : EMPTY_FORM));
  const [errors, setErrors] = useState({});
  const [confirmDelete, setConfirmDelete] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    ref.current?.focus();
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [onClose]);

  const set = (field, value) => {
    setForm((f) => ({ ...f, [field]: value }));
    if (errors[field]) setErrors((e) => ({ ...e, [field]: undefined }));
  };

  const validate = () => {
    const e = {};
    if (form.title.trim().length < 3) e.title = "Give your service a title (at least 3 characters).";
    if (!form.category) e.category = "Choose the category that fits best.";
    if (!(Number(form.rate) > 0)) e.rate = "Enter a rate greater than ₱0.";
    if (form.description.length > MAX_DESC) e.description = `Keep it under ${MAX_DESC} characters.`;
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const submit = (ev) => {
    ev.preventDefault();
    if (!validate()) return;
    onSave({
      ...form,
      title: form.title.trim(),
      description: form.description.trim(),
      rate: Number(form.rate),
    });
  };

  const field =
    "w-full rounded-lg border bg-white px-3 py-2.5 text-sm text-gray-800 focus-visible:outline-2 focus-visible:outline-primary";
  const border = (name) => (errors[name] ? "border-red-400" : "border-gray-300");
  const label = "mb-1 block text-sm font-semibold text-navy";
  const live = form.status === "active";

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <form
        ref={ref}
        tabIndex={-1}
        onSubmit={submit}
        noValidate
        role="dialog"
        aria-modal="true"
        aria-labelledby="service-title-heading"
        className="relative max-h-[92vh] w-full max-w-xl overflow-y-auto rounded-t-2xl bg-white p-5 shadow-2xl outline-none sm:rounded-2xl sm:p-6"
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute right-4 top-4 rounded-full p-1 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600"
        >
          <XMarkIcon className="h-5 w-5" />
        </button>

        <h2 id="service-title-heading" className="text-xl font-bold text-navy">
          {editing ? "Edit service" : "Add a service"}
        </h2>
        <p className="mt-1 text-sm text-muted">This is what clients see when they find you.</p>

        <div className="mt-5">
          <label htmlFor="svc-title" className={label}>Service title</label>
          <input
            id="svc-title"
            value={form.title}
            onChange={(e) => set("title", e.target.value)}
            placeholder="e.g. Aircon cleaning and repair"
            maxLength={60}
            aria-invalid={Boolean(errors.title)}
            aria-describedby={errors.title ? "svc-title-err" : undefined}
            className={`${field} ${border("title")}`}
          />
          {errors.title && <p id="svc-title-err" className="mt-1 text-xs font-semibold text-red-600">{errors.title}</p>}
        </div>

        <div className="mt-4">
          <label htmlFor="svc-category" className={label}>Category</label>
          <select
            id="svc-category"
            value={form.category}
            onChange={(e) => set("category", e.target.value)}
            aria-invalid={Boolean(errors.category)}
            aria-describedby={errors.category ? "svc-category-err" : undefined}
            className={`${field} ${border("category")}`}
          >
            <option value="">Select a category</option>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
          {errors.category && <p id="svc-category-err" className="mt-1 text-xs font-semibold text-red-600">{errors.category}</p>}
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3">
          <div>
            <label htmlFor="svc-rate" className={label}>Rate (₱)</label>
            <input
              id="svc-rate"
              type="number"
              inputMode="numeric"
              min="1"
              value={form.rate}
              onChange={(e) => set("rate", e.target.value)}
              placeholder="800"
              aria-invalid={Boolean(errors.rate)}
              aria-describedby={errors.rate ? "svc-rate-err" : undefined}
              className={`${field} ${border("rate")}`}
            />
          </div>
          <div>
            <label htmlFor="svc-unit" className={label}>Charged</label>
            <select
              id="svc-unit"
              value={form.rateUnit}
              onChange={(e) => set("rateUnit", e.target.value)}
              className={`${field} border-gray-300`}
            >
              {RATE_UNITS.map((u) => (
                <option key={u.value} value={u.value}>{u.label}</option>
              ))}
            </select>
          </div>
          {errors.rate && <p id="svc-rate-err" className="col-span-2 -mt-1 text-xs font-semibold text-red-600">{errors.rate}</p>}
        </div>

        <div className="mt-4">
          <div className="flex items-baseline justify-between">
            <label htmlFor="svc-desc" className={label}>Description <span className="font-normal text-muted">(optional)</span></label>
            <span className={`text-xs ${form.description.length > MAX_DESC ? "font-bold text-red-600" : "text-muted"}`}>
              {form.description.length}/{MAX_DESC}
            </span>
          </div>
          <textarea
            id="svc-desc"
            rows={3}
            value={form.description}
            onChange={(e) => set("description", e.target.value)}
            placeholder="What’s included, what tools you bring, areas you cover."
            aria-invalid={Boolean(errors.description)}
            className={`${field} ${border("description")}`}
          />
          {errors.description && <p className="mt-1 text-xs font-semibold text-red-600">{errors.description}</p>}
        </div>

        <div className="mt-4 flex items-center justify-between gap-4 rounded-xl border border-gray-200 p-3">
          <div>
            <p className="text-sm font-semibold text-navy">{live ? "Live to the public" : "Hidden from clients"}</p>
            <p className="text-xs text-muted">
              {live ? "Clients can find and request this service." : "Only you can see it until you publish."}
            </p>
          </div>
          <LiveSwitch on={live} onChange={() => set("status", live ? "hidden" : "active")} label="Publish this service" />
        </div>

        {/* Live preview */}
        <div className="mt-4">
          <p className="mb-1 text-xs font-semibold text-muted">How clients see it</p>
          <div className="rounded-xl bg-gray-50 p-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-bold text-navy">{form.title.trim() || "Your service title"}</span>
              {form.category && (
                <span className="rounded-full bg-primary-soft px-2 py-0.5 text-xs font-bold text-primary">{form.category}</span>
              )}
            </div>
            <p className="mt-0.5 text-sm font-semibold text-navy">
              {Number(form.rate) > 0 ? peso(form.rate) : "₱0"}{" "}
              <span className="font-medium text-muted">{unitLabel(form.rateUnit)}</span>
            </p>
          </div>
        </div>

        {/* Delete */}
        {editing && (
          <div className="mt-5 border-t border-gray-100 pt-4">
            {confirmDelete ? (
              <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl bg-red-50 p-3">
                <p className="text-sm font-semibold text-red-700">Delete this service? Clients won’t be able to find it.</p>
                <div className="flex gap-2">
                  <button type="button" onClick={() => setConfirmDelete(false)} className="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm font-semibold text-gray-700">
                    Keep
                  </button>
                  <button type="button" onClick={() => onDelete(service)} className="rounded-lg bg-red-600 px-3 py-1.5 text-sm font-bold text-white hover:bg-red-700">
                    Delete
                  </button>
                </div>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setConfirmDelete(true)}
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-red-600 hover:text-red-700"
              >
                <TrashIcon className="h-4 w-4" /> Delete service
              </button>
            )}
          </div>
        )}

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
            className="flex-1 rounded-xl bg-primary py-2.5 text-sm font-bold text-white transition hover:bg-primary-hover"
          >
            {editing ? "Save changes" : "Add service"}
          </button>
        </div>
      </form>
    </div>
  );
}

/* -------------------------------- page ------------------------------- */
export default function MyJobPost({ initialServices = null, onChange, onView }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const isVerified = user?.is_verified === true || user?.verification_status === "approved";

  const [services, setServices] = useState(initialServices ?? DEMO_SERVICES);
  const [modal, setModal] = useState(null); // null | "new" | service object
  const [toast, setToast] = useState("");
  const toastTimer = useRef(null);

  useEffect(() => () => clearTimeout(toastTimer.current), []);

  const liveCount = useMemo(() => services.filter((s) => s.status === "active").length, [services]);

  if (!isVerified) return <LockedState onVerify={() => navigate("/verify")} />;

  const notify = (msg) => {
    setToast(msg);
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(""), 2600);
  };
  const commit = (next) => {
    setServices(next);
    onChange?.(next);
  };

  const toggle = (s) => {
    const status = s.status === "active" ? "hidden" : "active";
    commit(services.map((x) => (x.id === s.id ? { ...x, status } : x)));
    notify(status === "active" ? `“${s.title}” is now live.` : `“${s.title}” is hidden from clients.`);
  };
  const save = (data) => {
    if (data.id) {
      commit(services.map((x) => (x.id === data.id ? { ...x, ...data } : x)));
      notify("Service updated.");
    } else {
      commit([{ ...data, id: Date.now(), views: 0, requests: 0 }, ...services]);
      notify(data.status === "active" ? "Service added and live." : "Service saved as hidden.");
    }
    setModal(null);
  };
  const remove = (s) => {
    commit(services.filter((x) => x.id !== s.id));
    setModal(null);
    notify("Service deleted.");
  };
  const view = (s) => (onView ? onView(s) : notify("The public post preview would open here."));

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-navy">My Services</h1>
          <p className="mt-1 text-sm text-muted">
            {services.length === 0
              ? "Add the services you offer so clients can find you."
              : `${services.length} service${services.length === 1 ? "" : "s"} · ${liveCount} live`}
          </p>
        </div>
        <button
          type="button"
          onClick={() => setModal("new")}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-bold text-white transition hover:bg-primary-hover"
        >
          <PlusIcon className="h-5 w-5" /> Add service
        </button>
      </div>

      {services.length > 0 && liveCount === 0 && (
        <div className="flex items-start gap-3 rounded-xl bg-amber-50 p-4 text-sm text-amber-800">
          <InformationCircleIcon className="mt-0.5 h-5 w-5 shrink-0" />
          <p>None of your services are live, so clients can’t find you in search. Turn one on to start getting requests.</p>
        </div>
      )}

      {services.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-10 text-center">
          <WrenchScrewdriverIcon className="mx-auto h-12 w-12 text-gray-300" />
          <p className="mt-3 font-bold text-navy">No services yet</p>
          <p className="mx-auto mt-1 max-w-xs text-sm text-muted">
            Post what you do and your rate. Verified clients nearby will be able to find and book you.
          </p>
          <button
            type="button"
            onClick={() => setModal("new")}
            className="mt-5 inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-bold text-white transition hover:bg-primary-hover"
          >
            <PlusIcon className="h-5 w-5" /> Add your first service
          </button>
        </div>
      ) : (
        <div className="grid gap-4">
          {services.map((s) => (
            <ServiceCard key={s.id} service={s} onToggle={toggle} onEdit={setModal} onView={view} />
          ))}
        </div>
      )}

      {modal && (
        <ServiceModal
          service={modal === "new" ? null : modal}
          onClose={() => setModal(null)}
          onSave={save}
          onDelete={remove}
        />
      )}

      <div
        role="status"
        className={`pointer-events-none fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-lg bg-navy px-4 py-2.5 text-sm font-semibold text-white shadow-lg transition-opacity ${
          toast ? "opacity-100" : "opacity-0"
        }`}
      >
        {toast}
      </div>
    </div>
  );
}