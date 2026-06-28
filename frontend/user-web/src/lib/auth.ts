import liff from "@line/liff";

const LIFF_ID = import.meta.env.VITE_LIFF_ID;
const API_URL = import.meta.env.VITE_API_URL ?? "";

export const ACCESS_TOKEN_KEY = "income_access_token";

export interface AuthResult {
  accessToken: string;
  userId: string;
}

export async function initLiffAndLogin(): Promise<AuthResult | null> {
  if (!LIFF_ID) return null;

  try {
    await liff.init({ liffId: LIFF_ID });
  } catch {
    return null;
  }

  if (!liff.isLoggedIn()) {
    liff.login();
    return null;
  }

  const idToken = liff.getIDToken();
  if (!idToken) return null;

  try {
    const res = await fetch(`${API_URL}/api/auth/line`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id_token: idToken }),
    });

    if (!res.ok) return null;

    const data: { accessToken: string; user: { id: string } } = await res.json();
    localStorage.setItem(ACCESS_TOKEN_KEY, data.accessToken);
    return { accessToken: data.accessToken, userId: data.user.id };
  } catch {
    return null;
  }
}

export function getAccessToken(): string | null {
  return localStorage.getItem(ACCESS_TOKEN_KEY);
}
