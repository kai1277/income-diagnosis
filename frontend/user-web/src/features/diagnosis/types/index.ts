export type QuizAnswers = Record<string, string>;
export type { QuizAnswers as Answers };

import type { QuizOption, QuizQuestion } from "./quiz";
export type { QuizOption, QuizQuestion };

export type QuizStepProps = {
  step: number;
  totalSteps: number;
  currentCategory: number;
  stepLabels: string[];
  highlight: string;
  subtitle?: string;
  options: QuizOption[];
  onAnswer: (answer: string) => void;
  onBack?: () => void;
};

export type SuggestedJob = { title: string; reason: string };

export type TierDef = {
  id: string;
  name: string;
  emoji: string;
  rank: "S" | "A" | "B";
  growthType: string;
  tagline: string;
  description: string;
  suggestedJobs: SuggestedJob[];
};

export type CharacterResult = {
  id: string;
  name: string;
  rank: "S" | "A" | "B";
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

export type ResultCardProps = {
  potentialIncome: number;
  incomeGap: number;
  suggestedJobs: SuggestedJob[];
};
