import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { getVerification, submitVerification } from "../../api/verification";

const ID_TYPES = [
  "National ID (PhilSys)",
  "Driver's License",
  "Passport",
  "UMID",
  "Postal ID",
  "PRC ID",
  "Voter's ID",
];

const MAX_SIZE = 5 * 1024 * 1024; // matches the backend's 5 MB limit

const roleHome = (role) =>
  role === "client" ? "/client/dashboard" : "/jobseeker/dashboard";

function FilePicker({ label, name, file, onPick, error, required, capture, hint }) {
  return (
    <div>
      <label className="mb-1 block text-sm font-medium text-navy">
        {label} {required && <span className="text-danger">*</span>}
      </label>
      <input
        type="file"
        name={name}
        accept="image/*"
        capture={capture}
        onChange={(e) => onPick(name, e.target.files?.[0] || null)}
        className="block w-full rounded-lg border border-gray-300 text-sm text-muted file:mr-4 file:rounded-l-lg file:border-0 file:bg-primary file:px-4 file:py-2.5 file:text-sm file:font-semibold file:text-white hover:file:bg-primary-hover"
      />
      {file && <p className="mt-1 truncate text-xs text-muted">{file.name}</p>}
      {hint && !error && <p className="mt-1 text-xs text-muted">{hint}</p>}
      {error && <p className="mt-1 text-xs text-danger">{error}</p>}
    </div>
  );
}

export default function Verify() {
  const { user, refreshUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from;

  const [info, setInfo] = useState(null);
  const [checking, setChecking] = useState(false);
  const [idType, setIdType] = useState("");
  const [files, setFiles] = useState({ id_front: null, id_back: null, selfie: null });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const first = (key) => errors[key]?.[0];
  const isClient = user?.role === "client";

  const load = async () => {
    try {
      const data = await getVerification();
      setInfo(data);
      if (data.is_verified && !user?.is_verified) await refreshUser();
    } catch (err) {
      setInfo({ verification_status: "none" });
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const checkStatus = async () => {
    setChecking(true);
    await load();
    setChecking(false);
  };

  const pick = (name, file) => {
    setFiles((f) => ({ ...f, [name]: file }));
    setErrors((e) => ({ ...e, [name]: undefined }));
  };

  const validate = () => {
    const e = {};
    if (!idType) e.id_type = ["Select the type of ID."];
    if (!files.id_front) e.id_front = ["Upload the front of your ID."];
    if (!files.selfie) e.selfie = ["Upload a selfie holding your ID."];
    for (const [key, f] of Object.entries(files)) {
      if (!f) continue;
      if (!f.type.startsWith("image/")) e[key] = ["File must be an image."];
      else if (f.size > MAX_SIZE) e[key] = ["Image must be 5 MB or smaller."];
    }
    return e;
  };

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    const local = validate();
    if (Object.keys(local).length) {
      setErrors(local);
      return;
    }

    setSubmitting(true);
    setErrors({});
    try {
      const fd = new FormData();
      fd.append("id_type", idType);
      fd.append("id_front", files.id_front);
      if (files.id_back) fd.append("id_back", files.id_back);
      fd.append("selfie", files.selfie);

      await submitVerification(fd);
      setInfo((i) => ({ ...i, verification_status: "pending", reject_reason: null }));
      await refreshUser();
    } catch (err) {
      setErrors(err.errors || { form: [err.message] });
    } finally {
      setSubmitting(false);
    }
  };

  const status = info?.verification_status;
  const verified = info?.is_verified;

  // Standard page wrapper to match your other dashboard pages
  const pageWrapper = "max-w-4xl mx-auto py-8 px-4";
  
  // Centered card for the form/status content
  const card = "mx-auto max-w-xl rounded-2xl bg-white p-6 shadow-sm border border-gray-100 sm:p-8 mt-4";

  // APPROVED
  if (verified) {
    return (
      <div className={pageWrapper}>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Verification</h1>
        <p className="text-gray-500 mb-6">Manage your identity verification status.</p>

        <div className={card}>
          <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">
            ✓
          </div>
          <h1 className="text-2xl font-bold text-navy text-center mb-2">You're verified</h1>
          <p className="text-center text-sm text-muted mb-6">
            {isClient
              ? "You can now book and hire jobseekers."
              : "You can now create services and accept booking requests."}
          </p>
          <button
            onClick={() => navigate(from || roleHome(user.role), { replace: true })}
            className="w-full rounded-lg bg-primary py-3 text-sm font-semibold text-white transition hover:bg-primary-hover"
          >
            Continue to Dashboard
          </button>
        </div>
      </div>
    );
  }

  // PENDING
  if (status === "pending") {
    return (
      <div className={pageWrapper}>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Verification</h1>
        <p className="text-gray-500 mb-6">Manage your identity verification status.</p>

        <div className={card}>
          <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">
            ⏳
          </div>
          <h1 className="text-2xl font-bold text-navy text-center mb-2">Under review</h1>
          <p className="text-center text-sm text-muted mb-6">
            We received your ID and our team is reviewing it. You'll be able to{" "}
            {isClient ? "hire jobseekers" : "offer your services"} once it's approved.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              onClick={checkStatus}
              disabled={checking}
              className="flex-1 rounded-lg bg-primary py-3 text-sm font-semibold text-white transition hover:bg-primary-hover disabled:opacity-60"
            >
              {checking ? "Checking..." : "Refresh status"}
            </button>
            <button
              onClick={() => navigate(roleHome(user.role))}
              className="flex-1 rounded-lg border border-gray-300 py-3 text-sm font-semibold text-navy transition hover:bg-gray-50"
            >
              Back to my account
            </button>
          </div>
        </div>
      </div>
    );
  }

  // NONE or REJECTED: show the form instantly
  return (
    <div className={pageWrapper}>
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Verify your identity</h1>
      <p className="text-gray-500 mb-6">
        {isClient
          ? "Verification is required before you can hire a jobseeker."
          : "Verification is required before you can offer services."}{" "}
        Your documents are stored privately and only reviewed by our team.
      </p>

      <div className={card}>
        {status === "rejected" && (
          <div className="mb-6 rounded-lg bg-red-50 px-4 py-3 text-sm text-danger">
            Your last submission was rejected.
            {info?.reject_reason && <> Reason: {info.reject_reason}</>} Please submit again.
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {first("form") && (
            <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-danger">
              {first("form")}
            </div>
          )}

          <div>
            <label className="mb-1 block text-sm font-medium text-navy">
              ID type <span className="text-danger">*</span>
            </label>
            <select
              value={idType}
              onChange={(e) => {
                setIdType(e.target.value);
                setErrors((x) => ({ ...x, id_type: undefined }));
              }}
              className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="">Select...</option>
              {ID_TYPES.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
            {first("id_type") && <p className="mt-1 text-xs text-danger">{first("id_type")}</p>}
          </div>

          <FilePicker
            label="ID (front)" name="id_front" required
            file={files.id_front} onPick={pick} error={first("id_front")}
            hint="Clear photo, all corners visible, no glare."
          />
          <FilePicker
            label="ID (back)" name="id_back"
            file={files.id_back} onPick={pick} error={first("id_back")}
            hint="If your ID has a back side."
          />
          <FilePicker
            label="Selfie holding your ID" name="selfie" required capture="user"
            file={files.selfie} onPick={pick} error={first("selfie")}
            hint="Your face and the ID must both be readable."
          />

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-lg bg-primary py-3 text-sm font-semibold text-white transition hover:bg-primary-hover disabled:opacity-60"
          >
            {submitting ? "Uploading..." : "Submit for review"}
          </button>
        </form>
      </div>
    </div>
  );
}