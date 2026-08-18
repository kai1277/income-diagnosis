const KEPT_JOBS_KEY = "beauty_kept_jobs";

export function readKeptJobIds(): string[] {
  try {
    const stored = localStorage.getItem(KEPT_JOBS_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

export function addKeptJobId(jobId: string): string[] {
  const current = readKeptJobIds();
  if (current.includes(jobId)) return current;
  const next = [...current, jobId];
  localStorage.setItem(KEPT_JOBS_KEY, JSON.stringify(next));
  return next;
}
