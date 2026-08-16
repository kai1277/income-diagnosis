const API_URL = import.meta.env.VITE_API_URL ?? "";

export async function apiGet<T>(path: string, accessToken: string): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json() as Promise<T>;
}
