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

// サーバーに保存された回答は Option オブジェクトではなく素の値（v / 年数 / 配列）なので、
// 選択肢定義から label を逆引きしてタグを組み立てる。
export function buildTagsFromRawAnswers(job: Job, answers: Record<string, unknown>): string[] {
  const tags: string[] = [];
  job.questions.forEach((q) => {
    const v = answers[q.key];
    if (v === undefined || v === null) return;
    if (q.type === "single") {
      const opt = q.options.find((o) => o.v === v);
      if (opt) tags.push(opt.label);
    } else if (q.type === "slider") {
      tags.push(`経験${v}年`);
    } else if (q.type === "multi" && Array.isArray(v)) {
      v.forEach((val) => {
        const opt = q.options.find((o) => o.v === val);
        if (opt) tags.push(opt.label);
      });
    }
  });
  return tags;
}
