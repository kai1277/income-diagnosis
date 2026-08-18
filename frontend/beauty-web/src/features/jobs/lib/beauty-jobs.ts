import type { JobId } from "@/features/diagnosis/types";

export type BeautyJob = {
  id: string;
  imageUrl: string | null;
  imageBadge: string | null;
  title: string;
  incomeRange: string;
  location: string | null;
  jobTypes: string[];
  affiliateUrl: string;
  impressionPixelUrl: string;
};

export type BeautyOccupationCode =
  | "hair_stylist"
  | "nail_technician"
  | "eyelash_technician"
  | "eyebrow_technician"
  | "esthetician"
  | "therapist";

export const BEAUTY_OCCUPATION_OPTIONS: { code: BeautyOccupationCode; label: string }[] = [
  { code: "hair_stylist", label: "美容師" },
  { code: "nail_technician", label: "ネイリスト" },
  { code: "eyelash_technician", label: "アイリスト" },
  { code: "eyebrow_technician", label: "アイブロウリスト" },
  { code: "esthetician", label: "エステティシャン" },
  { code: "therapist", label: "セラピスト" },
];

export const SALARY_TYPE_OPTIONS = ["月給", "時給", "日給", "年俸"];

export type BeautyJobSearchFilters = {
  occupationCodes: string[];
  prefectureId?: string;
  salaryType?: string;
  keyword?: string;
};

const API_URL = import.meta.env.VITE_API_URL ?? "";

export async function fetchBeautyJobs(jobId: JobId): Promise<BeautyJob[]> {
  const res = await fetch(`${API_URL}/api/beauty/jobs?jobId=${jobId}`);
  if (!res.ok) throw new Error(`beauty jobs API error: ${res.status}`);
  return res.json() as Promise<BeautyJob[]>;
}

export async function searchBeautyJobs(filters: BeautyJobSearchFilters): Promise<BeautyJob[]> {
  const params = new URLSearchParams();
  if (filters.occupationCodes.length > 0) {
    params.set("occupationCodes", filters.occupationCodes.join(","));
  }
  if (filters.prefectureId) params.set("prefectureId", filters.prefectureId);
  if (filters.salaryType) params.set("salaryType", filters.salaryType);
  if (filters.keyword) params.set("keyword", filters.keyword);

  const res = await fetch(`${API_URL}/api/beauty/jobs/search?${params.toString()}`);
  if (!res.ok) throw new Error(`beauty jobs search API error: ${res.status}`);
  return res.json() as Promise<BeautyJob[]>;
}
