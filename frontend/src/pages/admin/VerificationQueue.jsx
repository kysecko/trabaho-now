import { useCallback, useEffect, useState } from "react";
import { CheckCircleIcon, XCircleIcon, DocumentIcon } from "@heroicons/react/24/outline";
import Button from "../../components/ui/Button";
import { useSearchParams } from "react-router-dom";
import {
  getVerifications,
  getVerificationDetail,
  approveVerification,
  rejectVerification,
} from "../../api/admin";

const TABS = [
  { key: "pending", label: "Pending" },
  { key: "approved", label: "Approved" },
  { key: "rejected", label: "Rejected" },
];

const DOC_LABELS = {
  govId: "Government ID",
  selfie: "Selfie with ID",
  residency: "Proof of Residency",
  nbi: "NBI / Police Clearance",
};

const fmtDate = (value, withTime = false) =>
  value
    ? new Date(value).toLocaleString("en-PH", {
        year: "numeric",
        month: "short",
        day: "numeric",
        ...(withTime ? { hour: "numeric", minute: "2-digit" } : {}),
      })
    : "—";

function Detail({ label, value, className = "" }) {
  return (
    <div className={`min-w-0 ${className}`}>
      <dt className="text-xs text-gray-500">{label}</dt>
      <dd className="text-sm font-medium text-navy break-words whitespace-pre-line">{value || "—"}</dd>
    </div>
  );
}

export default function VerificationQueue() {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState("pending");
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [selected, setSelected] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);

  const [rejecting, setRejecting] = useState(false);
  const [reason, setReason] = useState("");
  const [busy, setBusy] = useState(false);
  const [actionError, setActionError] = useState(null);

  const loadList = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await getVerifications(status);
      setItems(res?.data ?? []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [status]);

  useEffect(() => {
    loadList();
    setSelected(null);
  }, [loadList]);

  const openRequest = async (id) => {
    try {
      setDetailLoading(true);
      setActionError(null);
      setRejecting(false);
      setReason("");
      const res = await getVerificationDetail(id);
      setSelected(res?.data ?? res);
    } catch (err) {
      setActionError(err.message);
    } finally {
      setDetailLoading(false);
    }
  };

  // Deep link from the admin dashboard: /admin/verifications?open=<id>
  useEffect(() => {
    const openId = searchParams.get("open");
    if (openId) openRequest(openId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const act = async (path, body) => {
    try {
      setBusy(true);
      setActionError(null);
      await (path === "approve"
        ? approveVerification(selected.id)
        : rejectVerification(selected.id, body.reason));
      setSelected(null);
      setRejecting(false);
      setReason("");
      await loadList();
    } catch (err) {
      setActionError(err.message);
    } finally {
      setBusy(false);
    }
  };

  const d = selected?.data ?? {};
  const fullName = [d.firstName, d.middleName, d.lastName].filter(Boolean).join(" ");

  return (
    <main className="w-full space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-navy">ID Verifications</h1>
        <p className="mt-1 text-sm text-muted">Review submitted documents and approve or reject each request.</p>
      </div>

      <div className="flex gap-2">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setStatus(tab.key)}
            className={`cursor-pointer rounded-full border px-4 py-1.5 text-sm font-medium transition ${
              status === tab.key
                ? "border-[#ff4d00] bg-[#ff4d00] text-white"
                : "border-gray-300 bg-white text-navy hover:border-[#ff4d00]"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 items-start gap-5 xl:grid-cols-2">
        {/* List */}
        <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
          {loading && <p className="p-5 text-sm text-muted">Loading...</p>}
          {error && <p className="p-5 text-sm text-red-600">{error}</p>}
          {!loading && !error && items.length === 0 && (
            <p className="p-5 text-sm text-muted">No {status} requests.</p>
          )}

          <ul className="divide-y divide-gray-100">
            {items.map((v) => (
              <li key={v.id}>
                <button
                  type="button"
                  onClick={() => openRequest(v.id)}
                  className={`flex w-full cursor-pointer items-center justify-between gap-3 px-4 py-3 text-left transition hover:bg-gray-50 ${
                    selected?.id === v.id ? "bg-orange-50" : ""
                  }`}
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-navy">{v.name || v.user?.name}</p>
                    <p className="truncate text-xs text-gray-500">{v.user?.email}</p>
                  </div>
                  <div className="shrink-0 text-right">
                    <span className="rounded-full bg-gray-100 px-2 py-0.5 text-[11px] font-semibold capitalize text-gray-700">
                      {v.role}
                    </span>
                    <p className="mt-1 text-[11px] text-gray-400">{fmtDate(v.submitted_at)}</p>
                  </div>
                </button>
              </li>
            ))}
          </ul>
        </section>

        {/* Detail */}
        <section className="rounded-2xl border border-gray-200 bg-white p-5">
          {detailLoading && <p className="text-sm text-muted">Loading request...</p>}

          {!detailLoading && !selected && (
            <p className="text-sm text-muted">Select a request to review it.</p>
          )}

          {!detailLoading && selected && (
            <div className="space-y-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="text-base font-bold text-navy">{fullName || selected.user?.name}</h2>
                  <p className="text-xs text-gray-500 capitalize">
                    {selected.role} · submitted {fmtDate(selected.submitted_at, true)}
                  </p>
                </div>
                <span className="rounded-full bg-gray-100 px-2.5 py-1 text-xs font-semibold capitalize text-gray-700">
                  {selected.status}
                </span>
              </div>

              <dl className="grid grid-cols-1 gap-x-4 gap-y-3 sm:grid-cols-2">
                <Detail label="Email" value={d.email} className="sm:col-span-2" />
                <Detail label="Mobile" value={d.mobile} />
                <Detail label="Gender" value={d.gender} />
                <Detail label="ZIP code" value={d.zip} />
                <Detail
                  label="Address"
                  value={[d.street, d.barangay].filter(Boolean).join(", ")}
                  className="sm:col-span-2"
                />
                {selected.role === "jobseeker" && (
                  <>
                    <Detail label="Primary skill" value={d.skill} />
                    <Detail label="Experience" value={d.experience ? `${d.experience} yr(s)` : ""} />
                    <Detail label="Bio" value={d.bio} className="sm:col-span-2" />
                  </>
                )}
              </dl>

              <div>
                <h3 className="mb-2 text-sm font-bold text-navy">Documents</h3>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {selected.documents?.map((doc) => {
                    const isImage = doc.mime?.startsWith("image/");
                    return (
                      <a
                        key={doc.key}
                        href={doc.url}
                        target="_blank"
                        rel="noreferrer"
                        className="block overflow-hidden rounded-xl border border-gray-200 transition hover:border-[#ff4d00]"
                      >
                        {isImage ? (
                          <img src={doc.url} alt={DOC_LABELS[doc.key] ?? doc.key} className="h-32 w-full object-cover" />
                        ) : (
                          <div className="flex h-32 items-center justify-center bg-gray-50">
                            <DocumentIcon className="h-8 w-8 text-gray-400" />
                          </div>
                        )}
                        <p className="px-3 py-2 text-xs font-semibold text-navy">
                          {DOC_LABELS[doc.key] ?? doc.key}
                        </p>
                      </a>
                    );
                  })}
                </div>
                <p className="mt-2 text-[11px] text-gray-400">Document links expire after 10 minutes.</p>
              </div>

              {selected.status === "rejected" && (
                <div className="rounded-lg bg-red-50 p-3 text-sm text-red-700">
                  <span className="font-semibold">Rejected:</span> {selected.rejection_reason}
                </div>
              )}

              {actionError && <p className="text-sm text-red-600">{actionError}</p>}

              {selected.status === "pending" && (
                <div className="space-y-3 border-t border-gray-100 pt-4">
                  {rejecting ? (
                    <>
                      <label className="block text-xs font-semibold text-gray-700">
                        Reason (the user will see this)
                      </label>
                      <textarea
                        rows={3}
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                        placeholder="e.g. The ID photo is blurry. Please upload a clearer image."
                        className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
                      />
                      <div className="flex justify-end gap-3">
                        <Button variant="outline" onClick={() => setRejecting(false)} disabled={busy}>
                          Cancel
                        </Button>
                        <Button
                          variant="danger"
                          leftIcon={XCircleIcon}
                          onClick={() => act("reject", { reason })}
                          disabled={!reason.trim()}
                          loading={busy}
                        >
                          Confirm reject
                        </Button>
                      </div>
                    </>
                  ) : (
                    <div className="flex justify-end gap-3">
                      <Button variant="outline" leftIcon={XCircleIcon} onClick={() => setRejecting(true)} disabled={busy}>
                        Reject
                      </Button>
                      <Button leftIcon={CheckCircleIcon} onClick={() => act("approve")} loading={busy}>
                        Approve
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}