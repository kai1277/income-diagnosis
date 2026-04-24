type Option = { label: string; emoji: string };

type Props = {
  step: number;
  totalSteps: number;
  question: string;
  options: Option[];
  onAnswer: (answer: string) => void;
};

export default function QuizStep({ step, totalSteps, question, options, onAnswer }: Props) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 flex flex-col px-5">
      {/* Progress header */}
      <div className="pt-12 pb-8">
        <div className="flex justify-center gap-2 mb-4">
          {Array.from({ length: totalSteps }).map((_, i) => (
            <div
              key={i}
              className={`h-1 rounded-full transition-all duration-300 ${
                i < step
                  ? "w-8 bg-amber-400"
                  : i === step
                    ? "w-8 bg-white"
                    : "w-4 bg-white/20"
              }`}
            />
          ))}
        </div>
        <p className="text-white/40 text-xs text-center font-medium tracking-widest uppercase">
          STEP {step + 1} / {totalSteps}
        </p>
      </div>

      {/* Question + options */}
      <div className="flex-1 flex flex-col">
        <h2 className="text-2xl font-bold text-white mb-8 leading-snug">{question}</h2>
        <div className="space-y-3">
          {options.map((opt) => (
            <button
              key={opt.label}
              onClick={() => onAnswer(opt.label)}
              className="w-full flex items-center gap-4 px-5 py-4 bg-white/5 border border-white/10 rounded-2xl text-left active:bg-white/15 active:border-amber-400/50 transition-all"
            >
              <span className="text-2xl shrink-0">{opt.emoji}</span>
              <span className="text-white font-medium text-base">{opt.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
