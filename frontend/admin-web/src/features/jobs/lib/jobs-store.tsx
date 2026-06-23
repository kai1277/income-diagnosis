import { createContext, useContext, useState } from "react";
import type { Job } from "@/features/jobs/types";
import { MOCK_JOBS } from "./mock-jobs";

type JobsContextValue = {
  jobs: Job[];
  addJob: (job: Job) => void;
  deleteJob: (id: string) => void;
};

const JobsContext = createContext<JobsContextValue | null>(null);

export function JobsProvider({ children }: { children: React.ReactNode }) {
  const [jobs, setJobs] = useState<Job[]>(MOCK_JOBS);

  const addJob = (job: Job) => setJobs((prev) => [...prev, job]);
  const deleteJob = (id: string) => setJobs((prev) => prev.filter((j) => j.id !== id));

  return (
    <JobsContext.Provider value={{ jobs, addJob, deleteJob }}>
      {children}
    </JobsContext.Provider>
  );
}

export function useJobs() {
  const ctx = useContext(JobsContext);
  if (!ctx) throw new Error("useJobs must be used inside JobsProvider");
  return ctx;
}
