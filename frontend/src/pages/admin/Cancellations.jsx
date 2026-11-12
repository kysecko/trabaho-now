import { useEffect, useState } from "react";
import {
  XCircleIcon,
  FunnelIcon,
  ArrowPathIcon,
} from "@heroicons/react/24/outline";
import { listCancellations } from "../../api/admin";

const ROLE_LABEL = { client: "Client", jobseeker: "Jobseeker", admin: "Admin" };
const ROLE_BADGE = {
  client: "bg-blue-100 text-blue-700",
  jobseeker: "bg-purple-100 text-purple-700",
  admin: "bg-gray-200 text-gray-800",
};

export default function Cancellations() {
  const [rows, setRows] = useState([]);
  const [filter, setFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const data = await listCancellations(filter || undefined);
      setRows(Array.isArray(data) ? data : data?.data ?? []);
    } catch (e) {
      setError(e.message || "Couldn't load cancellations");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter]);

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Cancellations</h1>
          <p className="mt-1 text-sm text-gray-500">
            Every cancelled request with who cancelled, why, and when.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <label className="flex items-center gap-1.5 text-sm text-gray-600">
            <FunnelIcon className="h-4 w-4" />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm"
            >
              <option value="">All roles</option>
              <option value="client">By client</option>
              <option value="jobseeker">By jobseeker</option>
              <option value="admin">By admin</option>
            </select>
          </label>

          <button
            onClick={load}
            className="rounded-lg border border-gray-300 bg-white p-2 text-gray-500 hover:bg-gray-50"
            aria-label="Refresh"
          >
            <ArrowPathIcon className="h-4 w-4" />
          </button>
        </div>
      </header>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
        {loading ? (
          <div className="p-10 text-center text-sm text-gray-500">Loading…</div>
        ) : rows.length === 0 ? (
          <div className="flex flex-col items-center p-10 text-center">
            <XCircleIcon className="h-12 w-12 text-gray-300" />
            <p className="mt-3 font-bold text-gray-900">No cancellations</p>
            <p className="mt-1 text-sm text-gray-500">
              Nothing has been cancelled{filter ? ` by ${ROLE_LABEL[filter]}s` : ""} yet.
            </p>
          </div>
        ) : (
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-xs font-bold uppercase tracking-wider text-gray-500">
              <tr>
                <th className="px-4 py-3">Request</th>
                <th className="px-4 py-3">By</th>
                <th className="px-4 py-3">Reason</th>
                <th className="px-4 py-3">Note</th>
                <th className="px-4 py-3">Cancelled at</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {rows.map((r) => (
                <tr key={r.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <p className="font-bold text-gray-900">#{r.id} · {r.title}</p>
                    <p className="text-xs text-gray-500">
                      {r.client?.name ?? "Client"} → {r.jobseeker?.name ?? "Jobseeker"}
                    </p>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs font-bold ${
                        ROLE_BADGE[r.cancelled_by_role] ?? "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {ROLE_LABEL[r.cancelled_by_role] ?? "—"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-700">{r.cancel_reason ?? "—"}</td>
                  <td className="max-w-xs truncate px-4 py-3 text-gray-500">
                    {r.cancel_note || "—"}
                  </td>
                  <td className="px-4 py-3 text-gray-500">
                    {r.cancelled_at
                      ? new Date(r.cancelled_at).toLocaleString("en-PH", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                          hour: "numeric",
                          minute: "2-digit",
                        })
                      : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}