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

  return { cities, loading };
}
