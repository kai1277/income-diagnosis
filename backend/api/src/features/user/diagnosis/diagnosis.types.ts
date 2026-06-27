export type QuizAnswers = Record<string, string>;

export type SuggestedJob = { code: string; title: string; reason: string };

export type TierDef = {
  id: string;
  name: string;
  emoji: string;
  rank: 'S' | 'A' | 'B';
  growthType: string;
  tagline: string;
  description: string;
  suggestedJobs?: SuggestedJob[];
};

export type DiagnosisResult = {
  id: string;
  name: string;
  rank: 'S' | 'A' | 'B';
  growthType: string;
  tagline: string;
  description: string;
  emoji: string;
  potentialIncome: number;
  incomeGap: number;
  currentIncomeBase: number;
  suggestedJobs: SuggestedJob[];
  shareText: string;
};
