import { createContext, useContext, useState, useEffect } from "react";
import type { Job } from "@/features/jobs/types";

const API_BASE = import.meta.env.VITE_API_URL ?? "";

type CreateJobPayload = Omit<Job, "id" | "created_at" | "updated_at">;

type JobsContextValue = {
  jobs: Job[];
  loading: boolean;
  error: string | null;
  addJob: (job: CreateJobPayload) => Promise<void>;
  deleteJob: (id: string) => void;
};

const JobsContext = createContext<JobsContextValue | null>(null);

export function JobsProvider({ children }: { children: React.ReactNode }) {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(`${API_BASE}/api/admin/jobs`)
      .then((res) => {
        if (!res.ok) throw new Error("求人の取得に失敗しました");
        return res.json();
      })
      .then((data: Job[]) => setJobs(data))
      .catch((e: Error) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  const addJob = async (jobData: CreateJobPayload) => {
    const res = await fetch(`${API_BASE}/api/admin/jobs`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(jobData),
    });
    if (!res.ok) throw new Error("求人の追加に失敗しました");
    const created: Job = await res.json();
    setJobs((prev) => [...prev, created]);
  };

  const deleteJob = (id: string) => setJobs((prev) => prev.filter((j) => j.id !== id));

  return (
    <JobsContext.Provider value={{ jobs, loading, error, addJob, deleteJob }}>
      {children}
    </JobsContext.Provider>
  );
}

export function useJobs() {
  const ctx = useContext(JobsContext);
  if (!ctx) throw new Error("useJobs must be used inside JobsProvider");
  return ctx;
}
