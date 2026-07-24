import { FormEvent, useState } from "react";
import { attemptLogin } from "../lib/auth";
import { cn } from "../utils/cn";

interface LoginProps {
  onSuccess: () => void;
}

export default function Login({ onSuccess }: LoginProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [attempts, setAttempts] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  const locked = attempts >= 5;

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (locked) return;
    setSubmitting(true);
    setError("");

    setTimeout(() => {
      const ok = attemptLogin(username, password);
      if (ok) {
        onSuccess();
      } else {
        setAttempts((a) => a + 1);
        setError("Invalid username or password. Please try again.");
      }
      setSubmitting(false);
    }, 350);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-indigo-950 via-slate-900 to-slate-950 p-6">
      <div className="w-full max-w-sm">
        <div className="mb-6 text-center">
          <div className="mx-auto mb-4 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 shadow-lg shadow-indigo-900/50">
            <svg className="h-7 w-7 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="10" rx="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
          </div>
          <h1 className="text-2xl font-semibold text-white">QA API Console</h1>
          <p className="mt-1 text-sm text-slate-400">Sign in to run testing-team API actions</p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-4 rounded-2xl border border-white/10 bg-white/5 p-6 shadow-2xl backdrop-blur"
        >
          <div className="space-y-1.5">
            <label className="text-xs font-medium uppercase tracking-wide text-slate-400">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="username"
              placeholder="Enter username"
              className="w-full rounded-lg border border-white/10 bg-slate-900/60 px-3.5 py-2.5 text-sm text-white placeholder:text-slate-500 outline-none ring-indigo-500 focus:ring-2"
              disabled={locked}
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium uppercase tracking-wide text-slate-400">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                placeholder="Enter password"
                className="w-full rounded-lg border border-white/10 bg-slate-900/60 px-3.5 py-2.5 pr-16 text-sm text-white placeholder:text-slate-500 outline-none ring-indigo-500 focus:ring-2"
                disabled={locked}
              />
              <button
                type="button"
                onClick={() => setShowPassword((s) => !s)}
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded px-2 py-1 text-xs font-medium text-slate-400 hover:text-slate-200"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          {error && (
            <div className="rounded-lg border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-xs font-medium text-rose-300">
              {error}
            </div>
          )}

          {locked && (
            <div className="rounded-lg border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-xs font-medium text-amber-300">
              Too many failed attempts. Please refresh the page to try again.
            </div>
          )}

          <button
            type="submit"
            disabled={submitting || locked || !username || !password}
            className={cn(
              "w-full rounded-lg bg-gradient-to-r from-indigo-500 to-violet-600 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-900/40 transition",
              "hover:from-indigo-400 hover:to-violet-500 disabled:cursor-not-allowed disabled:opacity-50"
            )}
          >
            {submitting ? "Signing in…" : "Sign in"}
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-slate-500">
          Internal tool for the testing team · Access is restricted
        </p>
      </div>
    </div>
  );
}
