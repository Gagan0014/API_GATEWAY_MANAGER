import React, { useContext, useEffect, useState } from "react";
import { ApiContext } from "../App.jsx";

const AdminSection = () => {
  const { API_BASE, token, user } = useContext(ApiContext);
  const [stats, setStats] = useState(null);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const isAdmin = user?.role === "admin";

  useEffect(() => {
    if (!token || !isAdmin) return;

    const fetchData = async () => {
      setLoading(true);
      setErrorMsg("");

      try {
        const [statsRes, logsRes] = await Promise.all([
          fetch(`${API_BASE}/api/admin/stats`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch(`${API_BASE}/api/admin/logs`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        const statsData = await statsRes.json();
        const logsData = await logsRes.json();

        if (!statsRes.ok) throw new Error(statsData.message || "Stats error");
        if (!logsRes.ok) throw new Error(logsData.message || "Logs error");

        setStats(statsData);
        setLogs(logsData);
      } catch (err) {
        setErrorMsg(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token, isAdmin, API_BASE]);

  if (!isAdmin) {
    return (
      <p className="text-xs text-red-400">
        Only admin users can access this section.
      </p>
    );
  }

  return (
    <div className="space-y-4 text-sm">
      <h2 className="text-sm font-semibold">Admin Dashboard</h2>

      {loading && <p className="text-xs text-slate-400">Loading...</p>}

      {errorMsg && (
        <p className="text-xs bg-red-900/40 border border-red-700 px-2 py-1 rounded text-red-300">
          {errorMsg}
        </p>
      )}

      {stats && (
        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
            <div className="text-[10px] text-slate-400">Total Requests</div>
            <div className="text-xl font-bold">{stats.totalRequests}</div>
          </div>

          <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
            <div className="text-[10px] text-slate-400">Rate Limit Violations</div>
            <div className="text-xl font-bold">{stats.rateLimitViolations}</div>
          </div>
        </div>
      )}

      <div>
        <h3 className="text-xs font-semibold mb-2">Recent Logs</h3>
        <div className="max-h-48 overflow-auto rounded-lg border border-slate-800 bg-slate-950 p-2 text-[11px]">
          {logs.length === 0 ? (
            <p className="text-slate-500 text-xs">No logs available</p>
          ) : (
            logs.map((log) => (
              <div key={log._id} className="border-b border-slate-800 py-1">
                <div className="text-slate-300">{log.method} {log.path}</div>
                <div className="text-slate-500">
                  {log.statusCode} • {new Date(log.createdAt).toLocaleString()}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminSection;
