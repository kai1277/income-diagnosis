import { createContext, useContext, useState } from "react";
import type { RequirementCode } from "@/features/jobs/types";
import { MOCK_REQUIREMENT_CODES } from "@/features/jobs/lib/mock-requirement-codes";

type ContextValue = {
  codes: RequirementCode[];
  addCode: (code: RequirementCode) => void;
  toggleActive: (id: string) => void;
  deleteCode: (id: string) => void;
};

const Ctx = createContext<ContextValue | null>(null);

export function RequirementCodesProvider({ children }: { children: React.ReactNode }) {
  const [codes, setCodes] = useState<RequirementCode[]>(MOCK_REQUIREMENT_CODES);

  const addCode = (code: RequirementCode) =>
    setCodes((prev) =>
      [...prev, code].sort((a, b) => (a.sort_order ?? 9999) - (b.sort_order ?? 9999)),
    );

  const toggleActive = (id: string) =>
    setCodes((prev) => prev.map((c) => (c.id === id ? { ...c, is_active: !c.is_active } : c)));

  const deleteCode = (id: string) =>
    setCodes((prev) => prev.filter((c) => c.id !== id));

  return <Ctx.Provider value={{ codes, addCode, toggleActive, deleteCode }}>{children}</Ctx.Provider>;
}

export function useRequirementCodes() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useRequirementCodes must be inside RequirementCodesProvider");
  return ctx;
}
