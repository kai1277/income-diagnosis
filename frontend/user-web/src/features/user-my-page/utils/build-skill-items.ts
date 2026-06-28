import type { SkillItem } from "@/features/user-home/types";

export function buildSkillItems(answers: Record<string, string>): SkillItem[] {
  const items: SkillItem[] = [];

  if (answers.education) {
    const edu = answers.schoolTier
      ? `${answers.education}（${answers.schoolTier}）`
      : answers.education;
    items.push({ label: "最終学歴", value: edu });
  }

  if (answers.jobLevel1) {
    const job = answers.jobLevel3
      ? `${answers.jobLevel1} / ${answers.jobLevel3}`
      : answers.jobLevel1;
    items.push({ label: "経験職種", value: job });
  }

  if (answers.yearsOfExperience) {
    items.push({ label: "経験年数", value: answers.yearsOfExperience });
  }

  if (answers.managementYears && answers.managementYears !== "なし") {
    items.push({ label: "マネジメント経験", value: answers.managementYears });
  }

  if (answers.englishLevel && answers.englishLevel !== "なし/初級") {
    items.push({ label: "英語力", value: answers.englishLevel });
  }

  return items;
}
