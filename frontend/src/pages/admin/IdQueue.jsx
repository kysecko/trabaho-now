import { useCallback, useEffect, useState } from "react";
import { approveId, fetchIdImage, getIdQueue, rejectId } from "../../api/admin";

const TABS = ["pending", "approved", "rejected"];

function IdImage({ id, type, label }) {
  const [url, setUrl] = useState(null);
  const [state, setState] = useState("loading"); // loading | ok | missing

  useEffect(() => {
    let objectUrl;
    let cancelled = false;
    fetchIdImage(id, type)
      .then((blob) => {
        if (cancelled) return;
        objectUrl = URL.createObjectURL(blob);
        setUrl(objectUrl);
        setState("ok");
      })
      .catch(() => !cancelled && setState("missing"));
    return () => {
      cancelled = true;
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [id, type]);

  return (
    <div>
      <p className="mb-1 text-xs font-medium text-muted">{label}</p>
      {state === "ok" ? (
        <a href={url} target="_blank" rel="noreferrer">
          <img src={url} alt={label} className="h-48 w-full rounded-lg border object-cover" />
        </a>
      ) : (
        <div className="flex h-48 items-center justify-center rounded-lg border bg-gray-50 text-xs text-muted">
          {state === "loading" ? "Loading..." : "Not provided"}
        </div>
      )}
    </div>
  );
}

export default function IdQueue() {
  const [tab, setTab] = useState("pending");
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [openId, setOpenId] = useState(null);
  const [reason, setReason] = useState("");
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await getIdQueue(tab);
      setItems(res.data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [tab]);

  useEffect(() => {
    setOpenId(null);
    load();
  }, [load]);

  const removeItem = (id) => {
    setItems((list) => list.filter((i) => i.id !== id));
    setOpenId(null);
    setReason("");
  };

  const handleApprove = async (id) => {
    setBusy(true);
    setError("");
    try {
      await approveId(id);
      removeItem(id);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  const handleReject = async (id) => {
    if (!reason.trim()) {
      setError("Enter a reason so the user knows what to fix.");
      return;
    }
    setBusy(true);
    setError("");
    try {
      await rejectId(id, reason.trim());
      removeItem(id);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-4xl">
      <h1 className="text-2xl font-bold text-navy">ID queue</h1>

      <div className="mt-4 flex gap-2">
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`rounded-lg px-4 py-2 text-sm font-semibold capitalize transition ${
              tab === t ? "bg-primary text-white" : "bg-white text-navy hover:bg-gray-50"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {error && (
        <div className="mt-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-danger">{error}</div>
      )}

      {loading ? (
        <p className="mt-8 text-sm text-muted">Loading...</p>
      ) : items.length === 0 ? (
        <p className="mt-8 text-sm text-muted">Nothing {tab} right now.</p>
      ) : (
        <ul className="mt-4 space-y-3">
          {items.map((item) => {
            const open = openId === item.id;
            return (
              <li key={item.id} className="rounded-xl bg-white p-4 shadow-sm">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="font-semibold text-navy">{item.user?.name}</p>
                    <p className="text-sm text-muted">
                      {item.user?.email} · {item.user?.role} · {item.id_type}
                    </p>
                    <p className="text-xs text-muted">
                      Submitted {new Date(item.created_at).toLocaleString()}
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setOpenId(open ? null : item.id);
                      setReason("");
                      setError("");
                    }}
                    className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold text-navy hover:bg-gray-50"
                  >
                    {open ? "Close" : tab === "pending" ? "Review" : "View"}
                  </button>
                </div>

                {open && (
                  <div className="mt-4 border-t pt-4">
                    <div className="grid gap-4 sm:grid-cols-3">
                      <IdImage id={item.id} type="front" label="ID front" />
                      <IdImage id={item.id} type="back" label="ID back" />
                      <IdImage id={item.id} type="selfie" label="Selfie with ID" />
                    </div>

                    {item.status === "rejected" && item.reject_reason && (
                      <p className="mt-3 text-sm text-danger">Reason: {item.reject_reason}</p>
                    )}

                    {item.status === "pending" && (
                      <div className="mt-4 space-y-3">
                        <textarea
                          value={reason}
                          onChange={(e) => setReason(e.target.value)}
                          placeholder="Reason (required only when rejecting)"
                          rows={2}
                          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                        <div className="flex gap-3">
                          <button
                            onClick={() => handleApprove(item.id)}
                            disabled={busy}
                            className="flex-1 rounded-lg bg-primary py-2.5 text-sm font-semibold text-white hover:bg-primary-hover disabled:opacity-60"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => handleReject(item.id)}
                            disabled={busy}
                            className="flex-1 rounded-lg border border-danger py-2.5 text-sm font-semibold text-danger hover:bg-red-50 disabled:opacity-60"
                          >
                            Reject
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}