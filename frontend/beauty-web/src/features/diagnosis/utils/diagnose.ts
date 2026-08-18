import { JOBS } from "@/features/diagnosis/constants/jobs";
import type { Answers, Estimate, ExperienceAnswer, JobId, Option } from "@/features/diagnosis/types";

const API_URL = import.meta.env.VITE_API_URL ?? "";

function serializeAnswers(jobId: JobId, answers: Answers): Record<string, unknown> {
  const job = JOBS[jobId];
  const out: Record<string, unknown> = {};
  job.questions.forEach((q) => {
    const a = answers[q.key];
    if (!a) return;
    if (q.type === "single") out[q.key] = (a as Option).v;
    else if (q.type === "slider") out[q.key] = (a as ExperienceAnswer).years;
    else if (q.type === "multi") out[q.key] = (a as Option[]).map((o) => o.v);
  });
  return out;
}

export async function fetchDiagnosis(jobId: JobId, answers: Answers, accessToken?: string | null): Promise<Estimate> {
  const res = await fetch(`${API_URL}/api/beauty/diagnosis`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
    },
    body: JSON.stringify({ jobId, answers: serializeAnswers(jobId, answers) }),
  });
  if (!res.ok) throw new Error(`beauty diagnosis API error: ${res.status}`);
  return res.json() as Promise<Estimate>;
}
