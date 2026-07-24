import { useState } from "react";
import { Environment } from "../lib/api";
import { cn } from "../utils/cn";
import MobileOtpForm from "./MobileOtpForm";
import DeleteAccountForm from "./DeleteAccountForm";

type Action = "otp" | "delete";

interface DashboardProps {
  onLogout: () => void;
}

export default function Dashboard({ onLogout }: DashboardProps) {
  const [environment, setEnvironment] = useState<Environment>("UAT");
  const [action, setAction] = useState<Action>("otp");

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600">
              <svg className="h-5 w-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="10" rx="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-800">QA API Console</p>
              <p className="text-xs text-slate-400">Testing team utility</p>
            </div>
          </div>

          <button
            onClick={onLogout}
            className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-500 hover:bg-slate-100"
          >
            Log out
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-5xl space-y-6 px-6 py-8">
        {/* Environment selector */}
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Environment</p>
          <div className="mt-3 flex gap-3">
            {(["UAT", "PROD"] as Environment[]).map((env) => (
              <button
                key={env}
                onClick={() => setEnvironment(env)}
                className={cn(
                  "flex-1 rounded-xl border-2 px-4 py-3 text-left transition",
                  environment === env
                    ? env === "PROD"
                      ? "border-rose-500 bg-rose-50"
                      : "border-indigo-500 bg-indigo-50"
                    : "border-slate-200 hover:bg-slate-50"
                )}
              >
                <span
                  className={cn(
                    "text-sm font-bold",
                    environment === env ? (env === "PROD" ? "text-rose-700" : "text-indigo-700") : "text-slate-600"
                  )}
                >
                  {env}
                </span>
                <p className="mt-0.5 text-xs text-slate-400">
                  {env === "UAT" ? "Safe testing environment" : "Live production — use with caution"}
                </p>
              </button>
            ))}
          </div>
          {environment === "PROD" && (
            <div className="mt-3 flex items-center gap-2 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs font-medium text-amber-700">
              <span>⚠️</span>
              You are targeting PRODUCTION. Double-check details before submitting.
            </div>
          )}
        </section>

        {/* Action selector */}
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Choose an action</p>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <button
              onClick={() => setAction("otp")}
              className={cn(
                "flex items-start gap-3 rounded-xl border-2 px-4 py-3.5 text-left transition",
                action === "otp" ? "border-indigo-500 bg-indigo-50" : "border-slate-200 hover:bg-slate-50"
              )}
            >
              <span className="text-2xl">🔐</span>
              <span>
                <span className="block text-sm font-semibold text-slate-800">Get Mobile OTP</span>
                <span className="block text-xs text-slate-400">Fetch stored OTP by mobile or email</span>
              </span>
            </button>
            <button
              onClick={() => setAction("delete")}
              className={cn(
                "flex items-start gap-3 rounded-xl border-2 px-4 py-3.5 text-left transition",
                action === "delete" ? "border-rose-500 bg-rose-50" : "border-slate-200 hover:bg-slate-50"
              )}
            >
              <span className="text-2xl">🗑️</span>
              <span>
                <span className="block text-sm font-semibold text-slate-800">Delete Test Account</span>
                <span className="block text-xs text-slate-400">Remove a test account by mobile or email</span>
              </span>
            </button>
          </div>
        </section>

        {/* Form */}
        <section>
          {action === "otp" ? (
            <MobileOtpForm environment={environment} />
          ) : (
            <DeleteAccountForm environment={environment} />
          )}
        </section>
      </main>
    </div>
  );
}
