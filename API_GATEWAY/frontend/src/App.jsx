import React, { useEffect, useState } from "react";
import AuthSection from "./components/AuthSection.jsx";
import ApiKeysSection from "./components/ApiKeysSection.jsx";
import ProtectedCallSection from "./components/ProtectedCallSection.jsx";
import AdminSection from "./components/AdminSection.jsx";

// 🔧 change this if backend runs on different host/port
const API_BASE = "http://localhost:5000";

export const ApiContext = React.createContext(null);

const App = () => {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState("keys"); // "keys" | "protected" | "admin"
  const [apiKeys, setApiKeys] = useState([]);

  // Load auth from localStorage on refresh
  useEffect(() => {
    const saved = localStorage.getItem("apiManagerAuth");
    if (saved) {
      const parsed = JSON.parse(saved);
      setToken(parsed.token);
      setUser(parsed.user);
    }
  }, []);

  const saveAuth = (token, user) => {
    setToken(token);
    setUser(user);
    localStorage.setItem("apiManagerAuth", JSON.stringify({ token, user }));
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    setApiKeys([]);
    localStorage.removeItem("apiManagerAuth");
  };

  const ctxValue = {
    API_BASE,
    token,
    user,
    saveAuth,
    logout,
    apiKeys,
    setApiKeys,
  };

  const isAdmin = user?.role === "admin";

  return (
    <ApiContext.Provider value={ctxValue}>
      <div className="min-h-screen flex flex-col">
        {/* Top bar */}
        <header className="border-b border-slate-800 bg-slate-950/80 backdrop-blur flex items-center justify-between px-6 py-3">
          <div className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-lg bg-indigo-500 flex items-center justify-center font-bold text-xl">
              R
            </div>
            <div>
              <h1 className="font-semibold text-lg">RateLimit Manager</h1>
              <p className="text-xs text-slate-400">
                API Rate Limiting &amp; API Key Management
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 text-sm">
            {user ? (
              <>
                <div className="text-right">
                  <div className="font-medium">
                    {user.email}{" "}
                    {isAdmin && (
                      <span className="ml-1 rounded bg-emerald-500/20 px-1.5 py-0.5 text-[10px] font-semibold text-emerald-300">
                        ADMIN
                      </span>
                    )}
                  </div>
                  <div className="text-[11px] text-slate-400">
                    JWT active • {token ? "Yes" : "No"}
                  </div>
                </div>
                <button
                  onClick={logout}
                  className="text-xs rounded-lg border border-slate-700 px-3 py-1 hover:bg-slate-800"
                >
                  Logout
                </button>
              </>
            ) : (
              <span className="text-xs text-slate-400">
                Not logged in • Create an account to start
              </span>
            )}
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 px-4 py-6 sm:px-8">
          <div className="grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,1.2fr)]">
            {/* Left column */}
            <div className="space-y-6">
              <AuthSection />

              {/* Tabs for keys / protected / admin */}
              <div className="card">
                <div className="border-b border-slate-800 mb-4 flex gap-2">
                  <TabButton
                    label="API Keys"
                    active={activeTab === "keys"}
                    onClick={() => setActiveTab("keys")}
                  />
                  <TabButton
                    label="Test Protected API"
                    active={activeTab === "protected"}
                    onClick={() => setActiveTab("protected")}
                  />
                  {isAdmin && (
                    <TabButton
                      label="Admin Dashboard"
                      active={activeTab === "admin"}
                      onClick={() => setActiveTab("admin")}
                    />
                  )}
                </div>

                {activeTab === "keys" && <ApiKeysSection />}
                {activeTab === "protected" && <ProtectedCallSection />}
                {activeTab === "admin" && <AdminSection />}
              </div>
            </div>

            {/* Right column – overview */}
            <aside className="space-y-4">
              <OverviewPanel />
            </aside>
          </div>
        </main>

        <footer className="border-t border-slate-800 px-6 py-3 text-xs text-slate-500 flex justify-between">
          <span>Backend: {API_BASE}</span>
          <span>Built with React + Tailwind</span>
        </footer>
      </div>
    </ApiContext.Provider>
  );
};

const TabButton = ({ label, active, onClick }) => (
  <button
    onClick={onClick}
    className={`relative px-3 py-2 text-xs font-medium border-b-2 -mb-[1px] ${
      active
        ? "border-indigo-500 text-indigo-300"
        : "border-transparent text-slate-400 hover:text-slate-200"
    }`}
  >
    {label}
  </button>
);

const OverviewPanel = () => (
  <div className="card space-y-4">
    <h2 className="text-sm font-semibold flex items-center gap-2">
      Overview
      <span className="rounded-full bg-slate-800 px-2 py-0.5 text-[10px] text-slate-300">
        Quick Guide
      </span>
    </h2>
    <ol className="space-y-2 text-xs text-slate-300 list-decimal list-inside">
      <li>Register or login with your email & password.</li>
      <li>Create one or more API keys in the “API Keys” tab.</li>
      <li>
        Use the API key in your client requests as{" "}
        <code className="rounded bg-slate-800 px-1">x-api-key</code>.
      </li>
      <li>
        Try the protected demo endpoint in “Test Protected API” to see rate
        limiting in action.
      </li>
      <li>
        If you are the first registered user (admin), open the “Admin
        Dashboard” tab to see stats and logs.
      </li>
    </ol>

    <div className="grid grid-cols-2 gap-3 text-xs">
      <div className="rounded-xl bg-gradient-to-br from-indigo-500/20 to-indigo-900/10 border border-indigo-500/40 p-3">
        <div className="text-[10px] uppercase text-indigo-300">
          Rate Limit Window
        </div>
        <div className="text-lg font-bold">60 sec</div>
        <div className="text-[11px] text-indigo-200/80">
          Configured in <code>.env</code>
        </div>
      </div>
      <div className="rounded-xl bg-gradient-to-br from-emerald-500/15 to-teal-900/10 border border-emerald-500/40 p-3">
        <div className="text-[10px] uppercase text-emerald-300">
          Max Requests
        </div>
        <div className="text-lg font-bold">30</div>
        <div className="text-[11px] text-emerald-200/80">
          Per API key per window
        </div>
      </div>
    </div>
  </div>
);

export default App;
