import { useCallback, useEffect, useState } from "react";
import { getUsers } from "../../api/admin";

const ROLES = ["all", "client", "jobseeker"];
const STATUSES = ["all", "pending", "approved", "rejected"];

export default function AdminDashboard() {
  const [roleTab, setRoleTab] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      // Pass the current filters to the API
      const res = await getUsers(
        roleTab === "all" ? null : roleTab,
        statusFilter === "all" ? null : statusFilter
      );
      
      setUsers(res.data || []); 
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [roleTab, statusFilter]);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <div className="mx-auto w-full max-w-5xl">
      <h1 className="text-2xl font-bold text-navy">User Management</h1>
      <p className="mt-1 text-sm text-muted">Manage all registered users on the platform.</p>

      {/* Filters Row */}
      <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
        
        {/* Role Tabs */}
        <div className="flex gap-2">
          {ROLES.map((r) => (
            <button
              key={r}
              onClick={() => setRoleTab(r)}
              className={`rounded-lg px-4 py-2 text-sm font-semibold capitalize transition ${
                roleTab === r ? "bg-primary text-white" : "bg-white text-navy hover:bg-gray-50"
              }`}
            >
              {r === "all" ? "All Users" : r + "s"}
            </button>
          ))}
        </div>

        {/* Status Dropdown */}
        <div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm font-semibold text-navy focus:outline-none focus:ring-2 focus:ring-primary"
          >
            {STATUSES.map((s) => (
              <option key={s} value={s}>
                {s === "all" ? "All Statuses" : s.charAt(0).toUpperCase() + s.slice(1)}
              </option>
            ))}
          </select>
        </div>
      </div>

      {error && (
        <div className="mt-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-danger">{error}</div>
      )}

      {/* Data List */}
      {loading ? (
        <p className="mt-8 text-sm text-muted">Loading users...</p>
      ) : users.length === 0 ? (
        <p className="mt-8 text-sm text-muted">No users found matching these filters.</p>
      ) : (
        <div className="mt-4 overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-gray-200">
          <table className="w-full text-left text-sm text-navy">
            <thead className="bg-gray-50 text-xs uppercase text-muted">
              <tr>
                <th className="px-4 py-3 font-semibold">Name</th>
                <th className="px-4 py-3 font-semibold">Role</th>
                <th className="px-4 py-3 font-semibold">Status</th>
                <th className="px-4 py-3 font-semibold">Joined</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <p className="font-semibold">{user.name}</p>
                    <p className="text-xs text-muted">{user.email}</p>
                  </td>
                  <td className="px-4 py-3 capitalize">{user.role}</td>
                  <td className="px-4 py-3">
                    {/* Status Badge */}
                    <span
                      className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
                        user.verification_status === "approved"
                          ? "bg-green-100 text-green-700"
                          : user.verification_status === "rejected"
                          ? "bg-red-100 text-red-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {user.verification_status || "pending"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-muted">
                    {new Date(user.created_at).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}