import { FormEvent, useEffect, useState } from "react";
import { ApiCallResult, AppType, DEFAULT_ENDPOINTS, Environment, callApi } from "../lib/api";
import ResponseViewer from "./ResponseViewer";
import { cn } from "../utils/cn";

interface MobileOtpFormProps {
  environment: Environment;
}

export default function MobileOtpForm({ environment }: MobileOtpFormProps) {
  const [endpoint, setEndpoint] = useState(DEFAULT_ENDPOINTS.mobileOtp[environment]);
  const [mobileNo, setMobileNo] = useState("");
  const [email, setEmail] = useState("");
  const [appType, setAppType] = useState<AppType>("imeuswe");
  const [formError, setFormError] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ApiCallResult | null>(null);

  useEffect(() => {
    setEndpoint(DEFAULT_ENDPOINTS.mobileOtp[environment]);
    setResult(null);
  }, [environment]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setFormError("");

    const trimmedMobile = mobileNo.trim();
    const trimmedEmail = email.trim();

    if (!trimmedMobile && !trimmedEmail) {
      setFormError("Please provide either a Mobile Number or an Email address.");
      return;
    }

    const body: Record<string, unknown> = {
      mobileNo: trimmedMobile ? Number(trimmedMobile) : null,
      email: trimmedEmail ? trimmedEmail : null,
      appType,
    };

    setLoading(true);
    setResult(null);
    const res = await callApi(endpoint, body);
    setResult(res);
    setLoading(false);
  };

  const maskEndpoint = (url: string) => {
  try {
    const parsed = new URL(url);
    return `${parsed.protocol}//******${parsed.pathname}`;
  } catch {
    return url;
  }
};

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <form onSubmit={handleSubmit} className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div>
          <h3 className="text-base font-semibold text-slate-800">Get Mobile OTP</h3>
          <p className="mt-0.5 text-xs text-slate-500">Fetch the verification OTP stored for a test account.</p>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-medium uppercase tracking-wide text-slate-500">Endpoint URL</label>
          <input
            type="text"
            value={maskEndpoint(endpoint)}
            readOnly
            className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 font-mono text-xs text-slate-600"
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <label className="text-xs font-medium uppercase tracking-wide text-slate-500">Mobile Number</label>
            <input
              type="text"
              inputMode="numeric"
              value={mobileNo}
              onChange={(e) => setMobileNo(e.target.value.replace(/[^0-9]/g, ""))}
              placeholder="e.g. 917820202823"
              className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-medium uppercase tracking-wide text-slate-500">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. test+1@gmail.com"
              className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
            />
          </div>
        </div>
        <p className="-mt-2 text-xs text-slate-400">Provide either Mobile Number or Email (one is required).</p>

        <div className="space-y-1.5">
          <label className="text-xs font-medium uppercase tracking-wide text-slate-500">App Type</label>
          <div className="flex gap-2">
            {(["imeuswe", "astrologer"] as AppType[]).map((type) => (
              <button
                type="button"
                key={type}
                onClick={() => setAppType(type)}
                className={cn(
                  "flex-1 rounded-lg border px-3 py-2 text-sm font-medium capitalize transition",
                  appType === type
                    ? "border-indigo-500 bg-indigo-50 text-indigo-700"
                    : "border-slate-200 text-slate-500 hover:bg-slate-50"
                )}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {formError && (
          <div className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-xs font-medium text-rose-600">
            {formError}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-indigo-600 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "Requesting…" : "Get OTP"}
        </button>
      </form>

      <div>
        <ResponseViewer result={result} loading={loading} />
      </div>
    </div>
  );
}
