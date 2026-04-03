type Props = {
  question: string;
  options: string[];
  currentStep: number;
  totalSteps: number;
  onAnswer: (answer: string) => void;
};

export default function QuizStep({ question, options, currentStep, totalSteps, onAnswer }: Props) {
  const progress = (currentStep / totalSteps) * 100;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="bg-white px-4 pt-4 pb-2">
        <div className="flex justify-between text-sm text-gray-500 mb-1">
          <span>STEP {currentStep} / {totalSteps}</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-500 h-2 rounded-full transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="flex-1 px-4 pt-8">
        <h2 className="text-xl font-bold text-gray-800 mb-8">{question}</h2>
        <div className="space-y-3">
          {options.map((opt) => (
            <button
              key={opt}
              onClick={() => onAnswer(opt)}
              className="w-full text-left px-5 py-4 bg-white border-2 border-gray-200 rounded-xl text-base font-medium text-gray-700 active:bg-blue-50 active:border-blue-400 transition-colors"
            >
              {opt}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
