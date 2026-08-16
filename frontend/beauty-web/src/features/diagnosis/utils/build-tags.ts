import type { Answers, ExperienceAnswer, Job, Option } from "@/features/diagnosis/types";

export function buildTags(job: Job, answers: Answers): string[] {
  const tags: string[] = [];
  job.questions.forEach((q) => {
    const a = answers[q.key];
    if (!a) return;
    if (q.type === "single") tags.push((a as Option).label);
    else if (q.type === "slider") tags.push(`経験${(a as ExperienceAnswer).years}年`);
    else if (q.type === "multi") (a as Option[]).forEach((x) => tags.push(x.label));
  });
  return tags;
}
