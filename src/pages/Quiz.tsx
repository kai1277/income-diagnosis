import { useState } from "react";
import { useNavigate } from "react-router-dom";
import QuizStep from "@/components/QuizStep";
import { getTracking } from "@/lib/tracking";

const QUESTIONS = [
  {
    key: "mondayFeeling",
    question: "月曜の朝、正直な気持ちは？",
    bg: "from-indigo-950 via-slate-900 to-slate-900",
    accent: "border-indigo-500/50",
    options: [
      { label: "よし、稼いでやるか", emoji: "🔥" },
      { label: "まあ、いつも通り", emoji: "😶" },
      { label: "あと5回くらい寝たい", emoji: "😮‍💨" },
      { label: "もう限界かも", emoji: "💀" },
    ],
  },
  {
    key: "ageRange",
    question: "いま何歳ですか？",
    bg: "from-violet-950 via-slate-900 to-slate-900",
    accent: "border-violet-500/50",
    options: [
      { label: "20代前半", emoji: "🌱" },
      { label: "20代後半", emoji: "✨" },
      { label: "30代", emoji: "💪" },
      { label: "40代以上", emoji: "🏔️" },
    ],
  },
  {
    key: "jobCategory",
    question: "今の仕事ジャンルは？",
    bg: "from-blue-950 via-slate-900 to-slate-900",
    accent: "border-blue-500/50",
    options: [
      { label: "事務・営業系", emoji: "📊" },
      { label: "製造・現場系", emoji: "🔨" },
      { label: "IT・テック系", emoji: "💻" },
      { label: "なんとも言えない", emoji: "🤷" },
    ],
  },
  {
    key: "currentIncome",
    question: "今の年収、正直どのくらい？",
    bg: "from-cyan-950 via-slate-900 to-slate-900",
    accent: "border-cyan-500/50",
    options: [
      { label: "〜300万（ちょっと厳しい）", emoji: "😅" },
      { label: "300〜400万（まあまあ）", emoji: "🙂" },
      { label: "400〜500万（それなりに）", emoji: "😊" },
      { label: "500万〜（がんばってる方）", emoji: "😎" },
    ],
  },
  {
    key: "workStyle",
    question: "お金に対するスタンスは？",
    bg: "from-purple-950 via-slate-900 to-slate-900",
    accent: "border-purple-500/50",
    options: [
      { label: "死ぬほど稼ぎたい", emoji: "💰" },
      { label: "安定さえあればいい", emoji: "🏡" },
      { label: "稼ぎつつ自由も欲しい", emoji: "🔥" },
      { label: "正直あまり考えてない", emoji: "😴" },
    ],
  },
  {
    key: "manualWork",
    question: "体を動かす仕事、どう思う？",
    bg: "from-emerald-950 via-slate-900 to-slate-900",
    accent: "border-emerald-500/50",
    options: [
      { label: "好きだし苦じゃない", emoji: "💪" },
      { label: "まあやればできる", emoji: "🤔" },
      { label: "ちょっと不安", emoji: "😅" },
      { label: "やっぱり難しそう", emoji: "🙅" },
    ],
  },
  {
    key: "futureGoal",
    question: "転職するなら何を一番重視する？",
    bg: "from-amber-950 via-slate-900 to-slate-900",
    accent: "border-amber-500/50",
    options: [
      { label: "年収アップ", emoji: "💴" },
      { label: "ワークライフバランス", emoji: "🌿" },
      { label: "成長できる環境", emoji: "🚀" },
      { label: "人間関係・雰囲気", emoji: "🤝" },
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
      question={current.question}
      options={[...current.options]}
      bg={current.bg}
      accent={current.accent}
      onAnswer={handleAnswer}
    />
  );
}
