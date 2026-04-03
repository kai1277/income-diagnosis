"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import QuizStep from "@/components/QuizStep";

const QUESTIONS = [
  {
    key: "ageRange",
    question: "Q1. あなたの年齢を教えてください",
    options: ["20代前半", "20代後半", "30代", "40代以上"],
  },
  {
    key: "jobCategory",
    question: "Q2. 現在の職種は？",
    options: ["事務・営業", "製造・現場", "IT", "その他"],
  },
  {
    key: "currentIncome",
    question: "Q3. 現在の年収はどのくらいですか？",
    options: ["〜300万", "300〜400万", "400〜500万", "500万〜"],
  },
  {
    key: "workStyle",
    question: "Q4. 働き方の志向は？",
    options: ["安定重視", "成果・稼ぎ重視"],
  },
  {
    key: "manualWork",
    question: "Q5. 手を動かす仕事への抵抗はありますか？",
    options: ["全然ない", "少しある", "抵抗がある"],
  },
] as const;

type Answers = Record<string, string>;

export default function QuizPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});

  const current = QUESTIONS[step];

  const handleAnswer = (answer: string) => {
    const next = { ...answers, [current.key]: answer };
    setAnswers(next);

    if (step < QUESTIONS.length - 1) {
      setStep(step + 1);
    } else {
      const params = new URLSearchParams(next);
      if (typeof window !== "undefined" && window.gtag) {
        window.gtag("event", "quiz_complete");
      }
      router.push(`/result?${params.toString()}`);
    }
  };

  return (
    <QuizStep
      question={current.question}
      options={[...current.options]}
      currentStep={step + 1}
      totalSteps={QUESTIONS.length}
      onAnswer={handleAnswer}
    />
  );
}
