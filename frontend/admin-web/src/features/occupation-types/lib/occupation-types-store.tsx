import { createContext, useContext, useState, useEffect } from "react";
import type { OccupationType } from "@/features/jobs/types";

const API_BASE = import.meta.env.VITE_API_URL ?? "";

type CreatePayload = {
  code: string;
  label: string;
  is_active?: boolean;
  sort_order?: number | null;
};

type ContextValue = {
  occupationTypes: OccupationType[];
  loading: boolean;
  error: string | null;
  addType: (payload: CreatePayload) => Promise<void>;
  deleteType: (id: string) => Promise<void>;
  retry: () => void;
};

const Ctx = createContext<ContextValue | null>(null);

export function OccupationTypesProvider({ children }: { children: React.ReactNode }) {
  const [occupationTypes, setOccupationTypes] = useState<OccupationType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTypes = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE}/api/admin/occupation-types`);
      if (!res.ok) throw new Error("職種カテゴリの取得に失敗しました");
      const contentType = res.headers.get("content-type") ?? "";
      if (!contentType.includes("application/json")) {
        throw new Error("サーバーが起動中です。しばらく待ってから再試行してください。");
      }
      const data: OccupationType[] = await res.json();
      setOccupationTypes(data);
    } catch (e) {
      const msg = e instanceof Error ? e.message : "職種カテゴリの取得に失敗しました";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTypes();
  }, []);

  const addType = async (payload: CreatePayload) => {
    const res = await fetch(`${API_BASE}/api/admin/occupation-types`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error("職種カテゴリの追加に失敗しました");
    const created: OccupationType = await res.json();
    setOccupationTypes((prev) =>
      [...prev, created].sort((a, b) => (a.sort_order ?? 9999) - (b.sort_order ?? 9999)),
    );
  };

  const deleteType = async (id: string) => {
    const res = await fetch(`${API_BASE}/api/admin/occupation-types/${id}`, { method: "DELETE" });
    if (!res.ok) throw new Error("職種カテゴリの削除に失敗しました");
    setOccupationTypes((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <Ctx.Provider value={{ occupationTypes, loading, error, addType, deleteType, retry: fetchTypes }}>
      {children}
    </Ctx.Provider>
  );
}

export function useOccupationTypes() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useOccupationTypes must be inside OccupationTypesProvider");
  return ctx;
}
