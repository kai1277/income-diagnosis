type Option = { label: string; emoji: string };

type Props = {
  step: number;
  totalSteps: number;
  currentCategory: number;
  stepLabels: string[];
  highlight: string;
  subtitle?: string;
  options: Option[];
  onAnswer: (answer: string) => void;
  onBack?: () => void;
};

export default function QuizStep({
  step,
  totalSteps,
  currentCategory,
  stepLabels,
  highlight,
  subtitle,
  options,
  onAnswer,
  onBack,
}: Props) {
  const total = stepLabels.length;

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: "#f0f2f5" }}>
      {/* Stats bar */}
      <div style={{ backgroundColor: "#8fa3b1" }} className="text-white px-4 py-3">
        <div className="flex divide-x divide-white/20 text-center">
          <div className="flex-1 px-2">
            <p className="text-xs text-white/70 mb-0.5">今日の診断者数</p>
            <p className="text-sm font-bold">1,284人</p>
          </div>
          <div className="flex-1 px-2">
            <p className="text-xs text-white/70 mb-0.5">あなたの潜在年収（推定）</p>
            <p className="text-sm font-bold">——万円</p>
          </div>
          <div className="flex-1 px-2">
            <p className="text-xs text-white/70 mb-0.5">提携求人件数</p>
            <p className="text-sm font-bold">2.3万件</p>
          </div>
        </div>
      </div>

      {/* Breadcrumb steps */}
      <div className="flex" style={{ backgroundColor: "#e0e5ea" }}>
        {stepLabels.map((label, i) => {
          const isActive = i === currentCategory;
          const isDone = i < currentCategory;
          const isFirst = i === 0;
          const isLast = i === total - 1;

          const bg = isActive ? "#4dd0e1" : isDone ? "#b2ebf2" : "#e0e5ea";
          const textColor = isActive ? "#fff" : isDone ? "#0097a7" : "#9ca3af";

          const clipPath = isFirst
            ? "polygon(0 0, calc(100% - 8px) 0, 100% 50%, calc(100% - 8px) 100%, 0 100%)"
            : isLast
            ? "polygon(8px 0, 100% 0, 100% 100%, 8px 100%, 0 50%)"
            : "polygon(8px 0, calc(100% - 8px) 0, 100% 50%, calc(100% - 8px) 100%, 8px 100%, 0 50%)";

          return (
            <div
              key={i}
              className="flex-1 flex items-center justify-center py-3 text-xs font-medium"
              style={{
                backgroundColor: bg,
                color: textColor,
                clipPath,
                zIndex: total - i,
                position: "relative",
                marginLeft: i > 0 ? "-8px" : undefined,
              }}
            >
              {label}
            </div>
          );
        })}
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col px-5 pt-6 pb-8">
        {/* Progress and back */}
        <div className="flex items-center justify-between mb-6">
          {onBack ? (
            <button
              onClick={onBack}
              className="text-gray-400 text-base flex items-center gap-1 active:text-gray-600 transition-colors py-2 pr-4"
            >
              ← 戻る
            </button>
          ) : (
            <div />
          )}
          <p className="text-sm text-gray-400">
            {step + 1} / {totalSteps}
          </p>
        </div>

        <h2 className={`text-2xl font-bold text-gray-800 text-center ${subtitle ? "mb-2" : "mb-10"}`}>
          <span style={{ color: "#4dd0e1" }}>{highlight}</span>
          を教えてください
        </h2>
        {subtitle && (
          <p className="text-sm text-gray-400 mb-8 text-center">{subtitle}</p>
        )}

        <div className="grid grid-cols-2 gap-3">
          {options.map((opt) => (
            <button
              key={opt.label}
              onClick={() => onAnswer(opt.label)}
              className="bg-white rounded-xl shadow-sm border border-gray-200 py-6 px-3 flex flex-col items-center gap-3 text-gray-700 font-medium active:bg-cyan-50 active:border-cyan-300 transition-all"
            >
              <span className="text-4xl select-none">{opt.emoji}</span>
              <span className="text-center leading-snug text-sm">{opt.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
