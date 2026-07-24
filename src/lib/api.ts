export type Environment = "UAT" | "PROD";
export type AppType = "imeuswe" | "astrologer";

// Default endpoint templates. UAT values are confirmed from provided Postman
// requests. PROD values are best-guess (uat subdomain removed) — testers can
// override the base URL directly in the UI if it differs.
export const DEFAULT_ENDPOINTS = {
  mobileOtp: {
    UAT: "https://user-management.uat.imeuswe.in/user/testingteamMobileOTP",
    PROD: "https://user-management.imeuswe.in/user/testingteamMobileOTP",
  },
  deleteAccount: {
    UAT: "https://kutumbh-api.redis.imeuswe.in/deleteTestingAccount",
    PROD: "https://kutumbh-api.imeuswe.in/deleteTestingAccount",
  },
};

export interface ApiCallResult {
  ok: boolean;
  status?: number;
  statusText?: string;
  data?: unknown;
  rawText?: string;
  error?: string;
  durationMs: number;
  url: string;
  requestBody: unknown;
}

export async function callApi(url: string, body: Record<string, unknown>): Promise<ApiCallResult> {
  const started = performance.now();
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const durationMs = Math.round(performance.now() - started);
    const rawText = await res.text();
    let data: unknown = undefined;
    try {
      data = rawText ? JSON.parse(rawText) : undefined;
    } catch {
      // not JSON
    }

    return {
      ok: res.ok,
      status: res.status,
      statusText: res.statusText,
      data,
      rawText,
      durationMs,
      url,
      requestBody: body,
    };
  } catch (err) {
    const durationMs = Math.round(performance.now() - started);
    return {
      ok: false,
      error:
        err instanceof Error
          ? `${err.message} (This may be a network/CORS restriction from the API server)`
          : "Unknown network error",
      durationMs,
      url,
      requestBody: body,
    };
  }
}
