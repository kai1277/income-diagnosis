import { useState } from "react";
import { useNavigate } from "react-router-dom";
import QuizStep from "@/components/QuizStep";
import { getTracking } from "@/lib/tracking";

const QUESTIONS = [
  {
    key: "ageRange",
    highlight: "年齢",
    options: [
      { label: "20代前半", emoji: "🌱" },
      { label: "20代後半", emoji: "🌿" },
      { label: "30代", emoji: "🌳" },
      { label: "40代以上", emoji: "🏔️" },
    ],
  },
  {
    key: "jobCategory",
    highlight: "現在の職種",
    options: [
      { label: "事務・営業", emoji: "📋" },
      { label: "製造・現場", emoji: "🔨" },
      { label: "IT", emoji: "💻" },
      { label: "その他", emoji: "✨" },
    ],
  },
  {
    key: "currentIncome",
    highlight: "現在の年収",
    options: [
      { label: "〜300万", emoji: "💴" },
      { label: "300〜400万", emoji: "💰" },
      { label: "400〜500万", emoji: "💎" },
      { label: "500万〜", emoji: "👑" },
    ],
  },
  {
    key: "workStyle",
    highlight: "働き方の志向",
    options: [
      { label: "安定重視", emoji: "🏠" },
      { label: "成果・稼ぎ重視", emoji: "🔥" },
    ],
  },
  {
    key: "manualWork",
    highlight: "体を使う仕事への抵抗",
    options: [
      { label: "全然ない", emoji: "👍" },
      { label: "少しある", emoji: "🤔" },
      { label: "抵抗がある", emoji: "😓" },
    ],
  },
] as const;

type Answers = Record<string, string>;

export default function Quiz() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});

  const current = QUESTIONS[step];

  const handleAnswer = (answer: string) => {
    const next = { ...answers, [current.key]: answer };
    setAnswers(next);

    if (step < QUESTIONS.length - 1) {
      setStep(step + 1);
    } else {
      window.gtag?.("event", "quiz_complete", getTracking());
      const params = new URLSearchParams(next);
      navigate(`/result?${params.toString()}`);
    }
  };

  return (
    <QuizStep
      step={step}
      totalSteps={QUESTIONS.length}
      highlight={current.highlight}
      options={[...current.options]}
      onAnswer={handleAnswer}
    />
  );
}
