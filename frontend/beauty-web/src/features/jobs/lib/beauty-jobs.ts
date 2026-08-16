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

const API_URL = import.meta.env.VITE_API_URL ?? "";

export async function fetchBeautyJobs(jobId: JobId): Promise<BeautyJob[]> {
  const res = await fetch(`${API_URL}/api/beauty/jobs?jobId=${jobId}`);
  if (!res.ok) throw new Error(`beauty jobs API error: ${res.status}`);
  return res.json() as Promise<BeautyJob[]>;
}
