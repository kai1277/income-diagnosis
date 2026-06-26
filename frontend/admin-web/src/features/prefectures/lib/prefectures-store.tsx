import { useState, useEffect } from "react";
import type { Prefecture, City } from "@/features/jobs/types";

const API_BASE = import.meta.env.VITE_API_URL ?? "";

export function usePrefectures() {
  const [prefectures, setPrefectures] = useState<Prefecture[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetch(`${API_BASE}/api/admin/prefectures`)
      .then((r) => (r.ok ? r.json() : []))
      .then(setPrefectures)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return { prefectures, loading };
}

export function useCities(prefectureId: string | null) {
  const [cities, setCities] = useState<City[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!prefectureId) {
      setCities([]);
      return;
    }
    setLoading(true);
    fetch(`${API_BASE}/api/admin/prefectures/${prefectureId}/cities`)
      .then((r) => (r.ok ? r.json() : []))
      .then(setCities)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [prefectureId]);

  const addCity = async (name: string): Promise<City> => {
    if (!prefectureId) throw new Error("都道府県を選択してください");
    const res = await fetch(`${API_BASE}/api/admin/prefectures/${prefectureId}/cities`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    });
    if (!res.ok) throw new Error("市区町村の追加に失敗しました");
    const city: City = await res.json();
    setCities((prev) => [...prev, city].sort((a, b) => a.sort_order - b.sort_order));
    return city;
  };

  return { cities, loading, addCity };
}

// ── Add City Modal ────────────────────────────────────────────────────────────

export function AddCityModal({
  onClose,
  onAdd,
  overlayClassName = "z-50",
}: {
  onClose: () => void;
  onAdd: (name: string) => Promise<City>;
  overlayClassName?: string;
}) {
  const [name, setName] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!name.trim()) return;
    setSubmitting(true);
    setError(null);
    try {
      await onAdd(name.trim());
      onClose();
    } catch {
      setError("市区町村の追加に失敗しました");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className={`fixed inset-0 flex items-center justify-center p-6 ${overlayClassName}`}
      style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="bg-white rounded-2xl w-full max-w-sm shadow-2xl p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">市区町村を追加</h2>
        <div className="mb-4">
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
            市区町村名 <span className="text-red-400">*</span>
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="例）羽村市"
            autoFocus
            onKeyDown={(e) => { if (e.key === "Enter") handleSubmit(); }}
            className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg outline-none focus:border-blue-400 bg-white"
          />
          {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
        </div>
        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={submitting}
            className="px-4 py-2 rounded-lg text-sm font-medium text-gray-600 border border-gray-300 hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            キャンセル
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={submitting || !name.trim()}
            className="px-4 py-2 rounded-lg text-sm font-medium text-white hover:opacity-90 transition-opacity disabled:opacity-50"
            style={{ backgroundColor: "#0288d1" }}
          >
            {submitting ? "追加中..." : "追加"}
          </button>
        </div>
      </div>
    </div>
  );
}
