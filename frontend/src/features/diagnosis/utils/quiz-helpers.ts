import { QUESTIONS, type QuizQuestion } from "@/features/diagnosis/lib/questions";
import type { Answers } from "@/features/diagnosis/types";

export function getVisibleQuestions(answers: Answers): QuizQuestion[] {
  return QUESTIONS.filter((q) => !q.showIf || q.showIf(answers));
}

export function resolveOptions(q: QuizQuestion, answers: Answers) {
  return typeof q.options === "function" ? q.options(answers) : q.options;
}
