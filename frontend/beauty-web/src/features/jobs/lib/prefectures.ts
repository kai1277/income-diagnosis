export type Prefecture = {
  id: string;
  name: string;
};

const API_URL = import.meta.env.VITE_API_URL ?? "";

export async function fetchPrefectures(): Promise<Prefecture[]> {
  const res = await fetch(`${API_URL}/api/admin/prefectures`);
  if (!res.ok) throw new Error(`prefectures API error: ${res.status}`);
  return res.json() as Promise<Prefecture[]>;
}
