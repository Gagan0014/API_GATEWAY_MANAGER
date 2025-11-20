import React, { useContext, useState } from "react";
import { ApiContext } from "../App.jsx";

const ProtectedCallSection = () => {
  const { API_BASE, apiKeys } = useContext(ApiContext);
  const [selectedKey, setSelectedKey] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");

  const callApi = async () => {
    const keyToUse = selectedKey || apiKeys[0]?.key;
    if (!keyToUse) {
      alert("Please create an API key first.");
      return;
    }
    setLoading(true);
    setResult("");
    try {
      const res = await fetch(`${API_BASE}/api/protected/data`, {
        headers: { "x-api-key": keyToUse },
      });
      const data = await res.json();
      setResult(JSON.stringify(data, null, 2));
    } catch (err) {
      setResult(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-3 text-sm">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold">Test Protected Endpoint</h2>
        <span className="text-[11px] text-slate-400">
          GET /api/protected/data
        </span>
      </div>

      <div className="grid gap-2 md:grid-cols-[1.5fr_auto]">
        <select
          className="input"
          value={selectedKey}
          onChange={(e) => setSelectedKey(e.target.value)}
        >
          <option value="">
            {apiKeys.length
              ? "Use first active key"
              : "No keys found – create one first"}
          </option>
          {apiKeys.map((k) => (
            <option key={k._id} value={k.key}>
              {k.label || "Untitled"} ({k.active ? "active" : "inactive"})
            </option>
          ))}
        </select>
        <button className="btn" onClick={callApi} disabled={loading}>
          {loading ? "Calling..." : "Send Request"}
        </button>
      </div>

      <div className="rounded-lg bg-slate-950 border border-slate-800 p-3 text-xs font-mono max-h-52 overflow-auto">
        {result || "Response will appear here after you call the endpoint."}
      </div>
    </div>
  );
};

export default ProtectedCallSection;
