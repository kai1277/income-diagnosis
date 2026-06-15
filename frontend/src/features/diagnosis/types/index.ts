export type QuizAnswers = Record<string, string>;
export type { QuizAnswers as Answers };

export type QuizOption = { label: string; emoji: string };

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

export type ResultCardProps = {
  potentialIncome: number;
  incomeGap: number;
  suggestedJobs: SuggestedJob[];
};
