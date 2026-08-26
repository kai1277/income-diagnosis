import liff from '@line/liff';

const LIFF_ID = import.meta.env.VITE_LIFF_ID;
const API_URL = import.meta.env.VITE_API_URL ?? '';

export const ACCESS_TOKEN_KEY = 'income_access_token';

export interface AuthResult {
  accessToken: string;
  userId: string;
}

let _lastAuthError: string | null = null;
export function getLastAuthError(): string | null {
  return _lastAuthError;
}

export async function initLiffAndLogin(): Promise<AuthResult | null> {
  _lastAuthError = null;

  if (!LIFF_ID) {
    _lastAuthError = 'VITE_LIFF_ID is not set';
    console.warn('[auth]', _lastAuthError);
    return null;
  }

  try {
    await liff.init({ liffId: LIFF_ID });
  } catch (e) {
    _lastAuthError = `liff.init failed: ${e}`;
    console.error('[auth]', _lastAuthError);
    return null;
  }

  if (!liff.isInClient()) {
    console.info('[auth] not opened inside LINE app, skipping LINE login');
    return null;
  }

  if (!liff.isLoggedIn()) {
    console.info('[auth] not logged in, redirecting to LINE login');
    liff.login();
    return null;
  }

  const idToken = liff.getIDToken();
  if (!idToken) {
    _lastAuthError =
      'liff.getIDToken() returned null — openid scope may not be enabled in LINE Developers Console';
    console.error('[auth]', _lastAuthError);
    return null;
  }

  try {
    const res = await fetch(`${API_URL}/api/auth/line`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id_token: idToken }),
    });

    if (!res.ok) {
      const body = await res.text().catch(() => '(unreadable)');
      _lastAuthError = `POST /api/auth/line failed: HTTP ${res.status} — ${body}`;
      console.error('[auth]', _lastAuthError);
      return null;
    }

    const data: { accessToken: string; user: { id: string } } = await res.json();
    localStorage.setItem(ACCESS_TOKEN_KEY, data.accessToken);
    return { accessToken: data.accessToken, userId: data.user.id };
  } catch (e) {
    _lastAuthError = `network error calling /api/auth/line: ${e}`;
    console.error('[auth]', _lastAuthError);
    return null;
  }
}

export function getAccessToken(): string | null {
  return localStorage.getItem(ACCESS_TOKEN_KEY);
}
