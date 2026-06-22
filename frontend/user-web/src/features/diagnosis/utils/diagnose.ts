import type { CharacterResult, QuizAnswers, TierDef } from "@/features/diagnosis/types";
import {
  INCOME_BASE,
  MAX_SCORES,
  SCORE_MAP,
  TIERS,
} from "@/features/diagnosis/constants/diagnosis-rules";

function computeMaxScore(answers: QuizAnswers): number {
  let max =
    MAX_SCORES.birthYear +
    MAX_SCORES.education +
    MAX_SCORES.graduationYear +
    MAX_SCORES.companyType +
    MAX_SCORES.employmentType +
    MAX_SCORES.industryLevel1 +
    MAX_SCORES.companySize +
    MAX_SCORES.position +
    MAX_SCORES.currentIncome +
    MAX_SCORES.jobLevel1 +
    MAX_SCORES.jobLevel3 +
    MAX_SCORES.yearsOfExperience +
    MAX_SCORES.managementYears +
    MAX_SCORES.englishLevel;

  if (answers.education === "大学" || answers.education === "大学院") {
    max += MAX_SCORES.schoolTier;
  }
  if (answers.industryLevel1 === "IT/インターネット/通信") {
    max += MAX_SCORES.industryLevel3;
  }
  if (answers.jobLevel1 === "営業") {
    max +=
      MAX_SCORES.customerSize +
      MAX_SCORES.achievementRate +
      MAX_SCORES.rankInOrg +
      MAX_SCORES.salesProduct +
      MAX_SCORES.productPrice;
  }

  return max;
}

function computeScore(answers: QuizAnswers): number {
  let score = 0;
  for (const [key, value] of Object.entries(answers)) {
    score += SCORE_MAP[key]?.[value] ?? 0;
  }
  return score;
}

function getTier(potentialIncome: number): TierDef {
  if (potentialIncome >= 800) return TIERS[0];
  if (potentialIncome >= 650) return TIERS[1];
  if (potentialIncome >= 500) return TIERS[2];
  if (potentialIncome >= 400) return TIERS[3];
  return TIERS[4];
}

export function diagnose(answers: QuizAnswers): CharacterResult {
  const base = INCOME_BASE[answers.currentIncome] ?? 350;
  const score = computeScore(answers);
  const maxScore = computeMaxScore(answers);
  const normalizedScore = maxScore > 0 ? score / maxScore : 0;
  // Calibrated so observed answers (score=222, maxScore=329, base=520) → 705万
  const multiplier = 0.85 + normalizedScore * 0.749;
  const potentialIncome = Math.round((base * multiplier) / 5) * 5;
  const incomeGap = potentialIncome - base;
  const tier = getTier(potentialIncome);

  const shareText = `診断結果：「${tier.name}」\n市場価値ランク ${tier.rank} ｜ ${tier.growthType}\n\n"${tier.tagline}"\n\n#市場価値診断 #キャリア`;

  return {
    ...tier,
    potentialIncome,
    incomeGap,
    currentIncomeBase: base,
    shareText,
  };
}
