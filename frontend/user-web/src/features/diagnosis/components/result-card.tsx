import type { ResultCardProps } from '@/features/diagnosis/types';

export default function ResultCard({ potentialIncome, incomeGap, suggestedJobs }: ResultCardProps) {
  return (
    <div className="space-y-6">
      <div className="bg-blue-600 text-white rounded-2xl p-6 text-center">
        <p className="text-sm font-medium opacity-80 mb-1">あなたの潜在年収</p>
        <p className="text-5xl font-bold mb-2">
          {potentialIncome}
          <span className="text-2xl ml-1">万円</span>
        </p>
        <p className="text-sm font-medium bg-yellow-400 text-yellow-900 rounded-full px-4 py-1 inline-block">
          現在より <span className="font-bold">+{incomeGap}万円</span> の可能性
        </p>
      </div>

      <div>
        <h3 className="text-base font-bold text-gray-700 mb-3">あなたに向いている職種</h3>
        <div className="space-y-3">
          {suggestedJobs.map((job) => (
            <div key={job.title} className="bg-white border border-gray-200 rounded-xl px-4 py-3">
              <p className="font-bold text-gray-800">{job.title}</p>
              <p className="text-sm text-gray-500 mt-0.5">{job.reason}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
