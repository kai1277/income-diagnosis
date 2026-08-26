import { QUESTIONS } from '@/features/diagnosis/constants/questions';
import type { QuizQuestion } from '@/features/diagnosis/types/quiz';
import type { Answers } from '@/features/diagnosis/types';

export function getVisibleQuestions(answers: Answers): QuizQuestion[] {
  return QUESTIONS.filter((q) => !q.showIf || q.showIf(answers));
}

export function resolveOptions(q: QuizQuestion, answers: Answers) {
  return typeof q.options === 'function' ? q.options(answers) : q.options;
}
