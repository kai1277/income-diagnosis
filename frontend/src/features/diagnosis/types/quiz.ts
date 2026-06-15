export type QuizOption = { label: string; emoji: string };

export type QuizQuestion = {
  key: string;
  highlight: string;
  subtitle?: string;
  category: number;
  options: QuizOption[] | ((answers: Record<string, string>) => QuizOption[]);
  showIf?: (answers: Record<string, string>) => boolean;
};
