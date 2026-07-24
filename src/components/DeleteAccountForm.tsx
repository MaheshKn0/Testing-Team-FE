import { FormEvent, useEffect, useState } from "react";
import { ApiCallResult, DEFAULT_ENDPOINTS, Environment, callApi } from "../lib/api";
import ResponseViewer from "./ResponseViewer";

interface DeleteAccountFormProps {
  environment: Environment;
}

export default function DeleteAccountForm({ environment }: DeleteAccountFormProps) {
  const [endpoint, setEndpoint] = useState(DEFAULT_ENDPOINTS.deleteAccount[environment]);
  const [mobileNo, setMobileNo] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("Request to Delete Test Account");
  const [description, setDescription] = useState("Please delete this test account.");
  const [formError, setFormError] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ApiCallResult | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);

  useEffect(() => {
    setEndpoint(DEFAULT_ENDPOINTS.deleteAccount[environment]);
    setResult(null);
  }, [environment]);

  const validate = () => {
    const trimmedMobile = mobileNo.trim();
    const trimmedEmail = email.trim();
    if (!trimmedMobile && !trimmedEmail) {
      setFormError("Please provide either a Mobile Number or an Email address.");
      return false;
    }
    setFormError("");
    return true;
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setConfirmOpen(true);
  };

  const performDelete = async () => {
    setConfirmOpen(false);
    const trimmedMobile = mobileNo.trim();
    const trimmedEmail = email.trim();

    const body: Record<string, unknown> = {};
    if (trimmedMobile) body.MobileNo = Number(trimmedMobile);
    if (trimmedEmail) body.Email = trimmedEmail;
    body.Subject = subject;
    body.Description = description;

    setLoading(true);
    setResult(null);
    const res = await callApi(endpoint, body);
    setResult(res);
    setLoading(false);
  };

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <form onSubmit={handleSubmit} className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div>
          <h3 className="text-base font-semibold text-slate-800">Delete Test Account</h3>
          <p className="mt-0.5 text-xs text-slate-500">Permanently remove a test account from the database.</p>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-medium uppercase tracking-wide text-slate-500">Endpoint URL</label>
          <input
            type="text"
            value={endpoint}
            onChange={(e) => setEndpoint(e.target.value)}
            className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 font-mono text-xs text-slate-600 outline-none focus:border-rose-400 focus:bg-white focus:ring-2 focus:ring-rose-100"
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
              placeholder="e.g. 254714026815"
              className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-100"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-medium uppercase tracking-wide text-slate-500">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. test+1@gmail.com"
              className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-100"
            />
          </div>
        </div>
        <p className="-mt-2 text-xs text-slate-400">Provide either Mobile Number or Email (one is required).</p>

        <div className="space-y-1.5">
          <label className="text-xs font-medium uppercase tracking-wide text-slate-500">Subject</label>
          <input
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-100"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-medium uppercase tracking-wide text-slate-500">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={2}
            className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-100"
          />
        </div>

        {formError && (
          <div className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-xs font-medium text-rose-600">
            {formError}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-rose-600 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-rose-500 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "Deleting…" : "Delete Account"}
        </button>
      </form>

      <div>
        <ResponseViewer result={result} loading={loading} />
      </div>

      {confirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl">
            <h4 className="text-base font-semibold text-slate-800">Confirm deletion</h4>
            <p className="mt-2 text-sm text-slate-500">
              This will permanently delete the account for{" "}
              <span className="font-semibold text-slate-700">{mobileNo || email}</span> on{" "}
              <span className="font-semibold text-slate-700">{environment}</span>. This action cannot be undone.
            </p>
            <div className="mt-5 flex justify-end gap-2">
              <button
                onClick={() => setConfirmOpen(false)}
                className="rounded-lg border border-slate-200 px-3.5 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                onClick={performDelete}
                className="rounded-lg bg-rose-600 px-3.5 py-2 text-sm font-semibold text-white hover:bg-rose-500"
              >
                Yes, delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
