import { createContext, useContext, useState, useEffect } from "react";
import type { RequirementCode } from "@/features/jobs/types";

const API_BASE = import.meta.env.VITE_API_URL ?? "";

type CreateCodePayload = Omit<RequirementCode, "id">;

type ContextValue = {
  codes: RequirementCode[];
  loading: boolean;
  error: string | null;
  addCode: (payload: CreateCodePayload) => Promise<void>;
  toggleActive: (id: string) => Promise<void>;
  deleteCode: (id: string) => Promise<void>;
  retry: () => void;
};

const Ctx = createContext<ContextValue | null>(null);

export function RequirementCodesProvider({ children }: { children: React.ReactNode }) {
  const [codes, setCodes] = useState<RequirementCode[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCodes = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE}/api/admin/requirement-codes`);
      if (!res.ok) throw new Error("条件コードの取得に失敗しました");
      const contentType = res.headers.get("content-type") ?? "";
      if (!contentType.includes("application/json")) {
        throw new Error("サーバーが起動中です。しばらく待ってから再試行してください。");
      }
      const data: RequirementCode[] = await res.json();
      setCodes(data);
    } catch (e) {
      const msg = e instanceof Error ? e.message : "条件コードの取得に失敗しました";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCodes();
  }, []);

  const addCode = async (payload: CreateCodePayload) => {
    const res = await fetch(`${API_BASE}/api/admin/requirement-codes`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error("条件コードの追加に失敗しました");
    const created: RequirementCode = await res.json();
    setCodes((prev) =>
      [...prev, created].sort((a, b) => (a.sort_order ?? 9999) - (b.sort_order ?? 9999)),
    );
  };

  const toggleActive = async (id: string) => {
    const target = codes.find((c) => c.id === id);
    if (!target) return;
    const newIsActive = !target.is_active;
    const res = await fetch(`${API_BASE}/api/admin/requirement-codes/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ is_active: newIsActive }),
    });
    if (!res.ok) throw new Error("状態の更新に失敗しました");
    setCodes((prev) => prev.map((c) => (c.id === id ? { ...c, is_active: newIsActive } : c)));
  };

  const deleteCode = async (id: string) => {
    const res = await fetch(`${API_BASE}/api/admin/requirement-codes/${id}`, { method: "DELETE" });
    if (!res.ok) throw new Error("条件コードの削除に失敗しました");
    setCodes((prev) => prev.filter((c) => c.id !== id));
  };

  return (
    <Ctx.Provider value={{ codes, loading, error, addCode, toggleActive, deleteCode, retry: fetchCodes }}>
      {children}
    </Ctx.Provider>
  );
}

export function useRequirementCodes() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useRequirementCodes must be inside RequirementCodesProvider");
  return ctx;
}
