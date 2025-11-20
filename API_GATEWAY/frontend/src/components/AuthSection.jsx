import React, { useContext, useState } from "react";
import { ApiContext } from "../App.jsx";

const AuthSection = () => {
  const { API_BASE, saveAuth, user } = useContext(ApiContext);
  const [mode, setMode] = useState("login"); // "login" | "register"
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg("");
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/auth/${mode}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Request failed");
      }
      saveAuth(data.token, data.user);
      setMsg(
        `${mode === "login" ? "Logged in" : "Registered"} as ${data.user.email}`
      );
    } catch (err) {
      setMsg(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h2 className="text-sm font-semibold">Authentication</h2>
          <p className="text-[11px] text-slate-400">
            {user
              ? "You are authenticated. You can now manage API keys."
              : "Register or login to start creating API keys."}
          </p>
        </div>
        <div className="flex gap-1 rounded-lg bg-slate-900 p-1 text-[11px]">
          <button
            className={`px-2 py-1 rounded ${
              mode === "login" ? "bg-slate-800" : "text-slate-400"
            }`}
            onClick={() => setMode("login")}
          >
            Login
          </button>
          <button
            className={`px-2 py-1 rounded ${
              mode === "register" ? "bg-slate-800" : "text-slate-400"
            }`}
            onClick={() => setMode("register")}
          >
            Register
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid gap-2 text-sm">
        <div>
          <label className="text-xs text-slate-400">Email</label>
          <input
            className="input mt-1"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            required
          />
        </div>
        <div>
          <label className="text-xs text-slate-400">Password</label>
          <input
            className="input mt-1"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
          />
        </div>
        <button className="btn mt-1" disabled={loading}>
          {loading
            ? "Please wait..."
            : mode === "login"
            ? "Login"
            : "Register & Login"}
        </button>
      </form>

      {msg && (
        <p className="mt-2 text-[11px] text-amber-300 bg-amber-500/10 border border-amber-500/30 rounded px-2 py-1">
          {msg}
        </p>
      )}
    </div>
  );
};

export default AuthSection;
