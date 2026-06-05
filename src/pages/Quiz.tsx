import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import QuizStep from "@/components/QuizStep";
import { getTracking } from "@/lib/tracking";
import { QUESTIONS, STEP_CATEGORIES, type QuizQuestion } from "@/lib/questions";

type Answers = Record<string, string>;

function getVisibleQuestions(answers: Answers): QuizQuestion[] {
  return QUESTIONS.filter((q) => !q.showIf || q.showIf(answers));
}

function resolveOptions(q: QuizQuestion, answers: Answers) {
  return typeof q.options === "function" ? q.options(answers) : q.options;
}

export default function Quiz() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});

  const visibleQuestions = useMemo(() => getVisibleQuestions(answers), [answers]);
  const current = visibleQuestions[step];
  const options = current ? resolveOptions(current, answers) : [];

  const handleAnswer = (answer: string) => {
    const next = { ...answers, [current.key]: answer };
    setAnswers(next);

    const nextVisible = getVisibleQuestions(next);
    if (step < nextVisible.length - 1) {
      setStep(step + 1);
    } else {
      window.gtag?.("event", "quiz_complete", getTracking());
      const params = new URLSearchParams(next);
      navigate(`/result?${params.toString()}`);
    }
  };

  const handleBack = () => {
    if (step > 0) setStep(step - 1);
  };

  if (!current) return null;

  return (
    <QuizStep
      step={step}
      totalSteps={visibleQuestions.length}
      currentCategory={current.category}
      stepLabels={STEP_CATEGORIES}
      highlight={current.highlight}
      subtitle={current.subtitle}
      options={options}
      onAnswer={handleAnswer}
      onBack={step > 0 ? handleBack : undefined}
    />
  );
}
