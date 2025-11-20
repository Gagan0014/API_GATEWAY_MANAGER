import React, { useContext, useEffect, useState } from "react";
import { ApiContext } from "../App.jsx";

const ApiKeysSection = () => {
  const { API_BASE, token, user, apiKeys, setApiKeys } = useContext(ApiContext);
  const [label, setLabel] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingKeys, setLoadingKeys] = useState(false);
  const [message, setMessage] = useState("");

  const authedHeaders = () => ({
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  });

  const loadKeys = async () => {
    if (!token) return;
    setLoadingKeys(true);
    setMessage("");
    try {
      const res = await fetch(`${API_BASE}/api/keys`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Could not load keys");
      setApiKeys(data);
    } catch (err) {
      setMessage(err.message);
    } finally {
      setLoadingKeys(false);
    }
  };

  useEffect(() => {
    loadKeys();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const createKey = async (e) => {
    e.preventDefault();
    if (!token) return;
    setLoading(true);
    setMessage("");
    try {
      const res = await fetch(`${API_BASE}/api/keys`, {
        method: "POST",
        headers: authedHeaders(),
        body: JSON.stringify({ label }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Could not create key");
      setLabel("");
      setApiKeys((prev) => [data, ...prev]);
      setMessage("API key created successfully.");
    } catch (err) {
      setMessage(err.message);
    } finally {
      setLoading(false);
    }
  };

  const toggleKey = async (id) => {
    if (!token) return;
    try {
      const res = await fetch(`${API_BASE}/api/keys/${id}/toggle`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Could not update key");
      setApiKeys((prev) => prev.map((k) => (k._id === id ? data : k)));
    } catch (err) {
      setMessage(err.message);
    }
  };

  if (!user) {
    return (
      <p className="text-xs text-slate-400">
        Please login or register first to manage your API keys.
      </p>
    );
  }

  return (
    <div className="space-y-4 text-sm">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold">API Keys</h2>
        <button
          onClick={loadKeys}
          className="text-xs rounded-lg border border-slate-700 px-3 py-1 hover:bg-slate-900"
          disabled={loadingKeys}
        >
          {loadingKeys ? "Refreshing..." : "Refresh"}
        </button>
      </div>

      <form onSubmit={createKey} className="grid gap-2 md:grid-cols-[1fr_auto]">
        <input
          className="input"
          placeholder="Label for your key (e.g. 'Mobile App', 'Test Client')"
          value={label}
          onChange={(e) => setLabel(e.target.value)}
        />
        <button className="btn" disabled={loading || !token}>
          {loading ? "Creating..." : "Create New Key"}
        </button>
      </form>

      {message && (
        <p className="text-xs text-amber-300 bg-amber-500/10 border border-amber-500/30 rounded px-2 py-1">
          {message}
        </p>
      )}

      <div className="space-y-2 max-h-64 overflow-auto pr-1">
        {apiKeys.length === 0 ? (
          <p className="text-xs text-slate-400">
            No keys yet. Create your first API key.
          </p>
        ) : (
          apiKeys.map((k) => (
            <div
              key={k._id}
              className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 rounded-lg border border-slate-800 bg-slate-950/50 px-3 py-2"
            >
              <div>
                <div className="text-xs text-slate-300">
                  {k.label || "Untitled key"}
                </div>
                <div className="mt-1 text-[11px] font-mono bg-slate-900 rounded px-2 py-1 break-all">
                  {k.key}
                </div>
                <div className="mt-1 text-[10px] text-slate-500">
                  Created: {new Date(k.createdAt).toLocaleString()}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span
                  className={`text-[10px] px-2 py-0.5 rounded-full ${
                    k.active
                      ? "bg-emerald-500/20 text-emerald-300"
                      : "bg-slate-700 text-slate-300"
                  }`}
                >
                  {k.active ? "Active" : "Inactive"}
                </span>
                <button
                  type="button"
                  onClick={() => toggleKey(k._id)}
                  className="text-[11px] rounded-lg border border-slate-700 px-2 py-1 hover:bg-slate-900"
                >
                  {k.active ? "Deactivate" : "Activate"}
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ApiKeysSection;
