import { createContext, useContext, useState, useEffect } from "react";
import type { Job, JobRequirementRow } from "@/features/jobs/types";

const API_BASE = import.meta.env.VITE_API_URL ?? "";

type CreateJobPayload = Omit<Job, "id" | "created_at" | "updated_at">;
type UpdateJobPayload = Partial<CreateJobPayload>;

function normalizeJob(raw: Record<string, unknown>): Job {
  const reqs = (raw.job_requirements as Record<string, unknown>[] | undefined) ?? [];
  const jots = (raw.job_occupation_types as Record<string, unknown>[] | undefined) ?? [];
  return {
    ...(raw as unknown as Job),
    job_types: (raw.job_types as string[]) ?? [],
    job_location: (raw.job_location as string | null) ?? null,
    prefecture_id: (raw.prefecture_id as string | null) ?? null,
    city_id: (raw.city_id as string | null) ?? null,
    prefecture: (raw.prefecture as Job["prefecture"]) ?? null,
    city: (raw.city as Job["city"]) ?? null,
    occupation_type_ids: jots.map((jot) => jot.occupation_type_id as string),
    occupation_types: jots.map((jot) => {
      const ot = jot.occupation_type as { id: string; label: string } | undefined;
      return { id: ot?.id ?? "", label: ot?.label ?? "" };
    }),
    requirements: reqs.map((r): JobRequirementRow => ({
      requirement_code_id: r.requirement_code_id as string,
      level: r.level as "required" | "preferred",
      operator: r.operator as string,
      value: (r.value as string | null) ?? "",
    })),
  };
}

type JobsContextValue = {
  jobs: Job[];
  loading: boolean;
  error: string | null;
  addJob: (job: CreateJobPayload) => Promise<void>;
  updateJob: (id: string, job: UpdateJobPayload) => Promise<Job>;
  deleteJob: (id: string) => Promise<void>;
  retry: () => void;
};

const JobsContext = createContext<JobsContextValue | null>(null);

export function JobsProvider({ children }: { children: React.ReactNode }) {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchJobs = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE}/api/admin/jobs`);
      if (!res.ok) throw new Error("求人の取得に失敗しました");
      const contentType = res.headers.get("content-type") ?? "";
      if (!contentType.includes("application/json")) {
        throw new Error("サーバーが起動中です。しばらく待ってから再試行してください。");
      }
      const data: Record<string, unknown>[] = await res.json();
      setJobs(data.map(normalizeJob));
    } catch (e) {
      const msg = e instanceof Error ? e.message : "求人の取得に失敗しました";
      setError(msg.includes("<!DOCTYPE") ? "サーバーが起動中です。しばらく待ってから再試行してください。" : msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const addJob = async (jobData: CreateJobPayload) => {
    const res = await fetch(`${API_BASE}/api/admin/jobs`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(jobData),
    });
    if (!res.ok) throw new Error("求人の追加に失敗しました");
    const created = normalizeJob(await res.json());
    setJobs((prev) => [...prev, created]);
  };

  const updateJob = async (id: string, jobData: UpdateJobPayload): Promise<Job> => {
    const res = await fetch(`${API_BASE}/api/admin/jobs/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(jobData),
    });
    if (!res.ok) throw new Error("求人の更新に失敗しました");
    const updated = normalizeJob(await res.json());
    setJobs((prev) => prev.map((j) => (j.id === id ? updated : j)));
    return updated;
  };

  const deleteJob = async (id: string) => {
    const res = await fetch(`${API_BASE}/api/admin/jobs/${id}`, { method: "DELETE" });
    if (!res.ok) throw new Error("求人の削除に失敗しました");
    setJobs((prev) => prev.filter((j) => j.id !== id));
  };

  return (
    <JobsContext.Provider value={{ jobs, loading, error, addJob, updateJob, deleteJob, retry: fetchJobs }}>
      {children}
    </JobsContext.Provider>
  );
}

export function useJobs() {
  const ctx = useContext(JobsContext);
  if (!ctx) throw new Error("useJobs must be used inside JobsProvider");
  return ctx;
}
