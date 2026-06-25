import { createContext, useContext, useState, useEffect } from "react";
import type { OccupationType } from "@/features/jobs/types";

const API_BASE = import.meta.env.VITE_API_URL ?? "";

type ContextValue = {
  occupationTypes: OccupationType[];
  loading: boolean;
  error: string | null;
};

const Ctx = createContext<ContextValue | null>(null);

export function OccupationTypesProvider({ children }: { children: React.ReactNode }) {
  const [occupationTypes, setOccupationTypes] = useState<OccupationType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
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

    fetchTypes();
  }, []);

  return (
    <Ctx.Provider value={{ occupationTypes, loading, error }}>
      {children}
    </Ctx.Provider>
  );
}

export function useOccupationTypes() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useOccupationTypes must be inside OccupationTypesProvider");
  return ctx;
}
