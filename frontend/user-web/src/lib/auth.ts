import liff from "@line/liff";

const LIFF_ID = import.meta.env.VITE_LIFF_ID;
const API_URL = import.meta.env.VITE_API_URL ?? "";

export const ACCESS_TOKEN_KEY = "income_access_token";

export interface AuthResult {
  accessToken: string;
  userId: string;
}

export interface AuthDebugResult {
  result: AuthResult | null;
  error: string | null;
}

export async function initLiffAndLogin(): Promise<AuthDebugResult> {
  if (!LIFF_ID) {
    console.warn("[auth] VITE_LIFF_ID is not set");
    return { result: null, error: "VITE_LIFF_ID is not set" };
  }

  try {
    await liff.init({ liffId: LIFF_ID });
  } catch (e) {
    const msg = `liff.init failed: ${e}`;
    console.error("[auth]", msg);
    return { result: null, error: msg };
  }

  if (!liff.isLoggedIn()) {
    console.info("[auth] not logged in, redirecting to LINE login");
    liff.login();
    return { result: null, error: null };
  }

  const idToken = liff.getIDToken();
  if (!idToken) {
    const msg = "liff.getIDToken() returned null — openid scope may not be enabled in LINE Developers Console";
    console.error("[auth]", msg);
    return { result: null, error: msg };
  }

  try {
    const res = await fetch(`${API_URL}/api/auth/line`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id_token: idToken }),
    });

    if (!res.ok) {
      const body = await res.text().catch(() => "(unreadable)");
      const msg = `POST /api/auth/line failed: HTTP ${res.status} — ${body}`;
      console.error("[auth]", msg);
      return { result: null, error: msg };
    }

    const data: { accessToken: string; user: { id: string } } = await res.json();
    localStorage.setItem(ACCESS_TOKEN_KEY, data.accessToken);
    return { result: { accessToken: data.accessToken, userId: data.user.id }, error: null };
  } catch (e) {
    const msg = `network error calling /api/auth/line: ${e}`;
    console.error("[auth]", msg);
    return { result: null, error: msg };
  }
}

export function getAccessToken(): string | null {
  return localStorage.getItem(ACCESS_TOKEN_KEY);
}
