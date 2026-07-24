import { useState } from "react";
import { cn } from "../utils/cn";
import type { ApiCallResult } from "../lib/api";

interface ResponseViewerProps {
  result: ApiCallResult | null;
  loading: boolean;
}

export default function ResponseViewer({ result, loading }: ResponseViewerProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (!result) return;
    const text = result.data ? JSON.stringify(result.data, null, 2) : result.rawText || result.error || "";
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  if (loading) {
    return (
      <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 p-6 text-slate-500">
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-slate-300 border-t-indigo-500" />
        <span className="text-sm font-medium">Sending request…</span>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50/60 p-6 text-center text-sm text-slate-400">
        Response will appear here after you submit a request.
      </div>
    );
  }

  const isSuccess = result.ok;
  const statusLabel = result.status ? `${result.status} ${result.statusText || ""}`.trim() : "Network Error";

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span
            className={cn(
              "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold",
              isSuccess ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700"
            )}
          >
            <span className={cn("h-1.5 w-1.5 rounded-full", isSuccess ? "bg-emerald-500" : "bg-rose-500")} />
            {statusLabel}
          </span>
          <span className="text-xs text-slate-400">{result.durationMs} ms</span>
        </div>
        <button
          onClick={handleCopy}
          className="rounded-lg border border-slate-200 px-2.5 py-1 text-xs font-medium text-slate-500 transition hover:bg-slate-100"
        >
          {copied ? "Copied!" : "Copy response"}
        </button>
      </div>

      <div className="rounded-xl border border-slate-200 bg-slate-900 p-4">
        <pre className="max-h-80 overflow-auto whitespace-pre-wrap break-all font-mono text-xs leading-relaxed text-emerald-300">
          {result.error
            ? result.error
            : result.data !== undefined
            ? JSON.stringify(result.data, null, 2)
            : result.rawText || "(empty response body)"}
        </pre>
      </div>

      <details className="rounded-lg bg-slate-50 p-3 text-xs text-slate-500">
        <summary className="cursor-pointer select-none font-medium text-slate-600">Request details</summary>
        <div className="mt-2 space-y-1">
          <p className="break-all">
            <span className="font-semibold text-slate-600">URL:</span> {result.url}
          </p>
          <p className="break-all">
            <span className="font-semibold text-slate-600">Body:</span>{" "}
            {JSON.stringify(result.requestBody)}
          </p>
        </div>
      </details>
    </div>
  );
}
