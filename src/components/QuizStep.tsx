type Option = { label: string; emoji: string };

type Props = {
  step: number;
  totalSteps: number;
  question: string;
  options: Option[];
  bg: string;
  accent: string;
  onAnswer: (answer: string) => void;
};

export default function QuizStep({ step, totalSteps, question, options, bg, accent, onAnswer }: Props) {
  return (
    <div className={`min-h-screen flex flex-col bg-gradient-to-b ${bg} px-5`}>
      {/* Progress */}
      <div className="pt-12 pb-8">
        <div className="flex justify-center gap-1.5 mb-4">
          {Array.from({ length: totalSteps }).map((_, i) => (
            <div
              key={i}
              className={`h-1 rounded-full transition-all duration-300 ${
                i < step
                  ? "w-6 bg-white/70"
                  : i === step
                    ? "w-10 bg-white"
                    : "w-4 bg-white/15"
              }`}
            />
          ))}
        </div>
        <p className="text-white/35 text-xs text-center font-medium tracking-[0.2em] uppercase">
          {step + 1} / {totalSteps}
        </p>
      </div>

      {/* Question */}
      <div className="flex-1 flex flex-col">
        <h2 className="text-[1.6rem] font-extrabold text-white mb-8 leading-snug tracking-tight">
          {question}
        </h2>

        {/* Options */}
        <div className="space-y-3">
          {options.map((opt) => (
            <button
              key={opt.label}
              onClick={() => onAnswer(opt.label)}
              className={`w-full flex items-center gap-4 px-5 py-4 bg-white/5 border ${accent} rounded-2xl text-left active:bg-white/15 active:scale-[0.98] transition-all`}
            >
              <span className="text-2xl shrink-0 select-none">{opt.emoji}</span>
              <span className="text-white font-semibold text-base leading-snug">{opt.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
