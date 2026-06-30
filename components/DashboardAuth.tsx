"use client";

import { useState, useEffect, FormEvent } from "react";
import { useLocale } from "next-intl";

const SESSION_KEY = "better_dashboard_auth";

export default function DashboardAuth({ children }: { children: React.ReactNode }) {
  const locale = useLocale();
  const isEs = locale === "es";
  const [authenticated, setAuthenticated] = useState(false);
  const [checking, setChecking] = useState(true);
  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const stored = sessionStorage.getItem(SESSION_KEY);
    if (stored === "true") setAuthenticated(true);
    setChecking(false);
  }, []);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setError("");

    const validUser = process.env.NEXT_PUBLIC_DASHBOARD_USER;
    const validPass = process.env.NEXT_PUBLIC_DASHBOARD_PASS;

    if (user === validUser && pass === validPass) {
      sessionStorage.setItem(SESSION_KEY, "true");
      setAuthenticated(true);
    } else {
      setError(isEs ? "Usuario o clave incorrectos" : "Incorrect username or password");
    }
  };

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!authenticated) {
    return (
      <main className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="w-full max-w-sm bg-white rounded-[2rem] p-8 shadow-2xl border border-slate-100">
          <h1 className="text-2xl font-black tracking-tighter uppercase text-slate-900 mb-1 text-center">
            Better Editor
          </h1>
          <p className="text-slate-400 text-xs font-bold uppercase tracking-widest text-center mb-8">
            {isEs ? "Acceso restringido" : "Restricted access"}
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">
                {isEs ? "Usuario" : "Username"}
              </label>
              <input
                className="w-full px-5 py-4 rounded-2xl border-2 border-slate-100 font-bold focus:border-blue-600 outline-none transition-all"
                value={user}
                onChange={(e) => setUser(e.target.value)}
                autoFocus
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">
                {isEs ? "Clave" : "Password"}
              </label>
              <input
                type="password"
                className="w-full px-5 py-4 rounded-2xl border-2 border-slate-100 font-bold focus:border-blue-600 outline-none transition-all"
                value={pass}
                onChange={(e) => setPass(e.target.value)}
                required
              />
            </div>

            {error && (
              <div className="p-3 bg-red-50 text-red-600 rounded-xl text-center text-xs font-bold">
                {error}
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-slate-900 text-white py-4 rounded-2xl font-black uppercase tracking-[0.2em] text-xs hover:bg-blue-600 transition-all shadow-xl"
            >
              {isEs ? "Ingresar →" : "Sign in →"}
            </button>
          </form>
        </div>
      </main>
    );
  }

  return <>{children}</>;
}