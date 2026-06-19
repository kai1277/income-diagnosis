import type { MockJob } from "@/features/jobs/lib/mock-jobs";

type Props = {
  job: MockJob;
  current: number;
  total: number;
  onKeep: () => void;
  onReject: () => void;
};

export default function JobCard({ job, current, total, onKeep, onReject }: Props) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      {/* Image section */}
      <div className="relative">
        <img
          src={job.imageUrl}
          alt={job.title}
          className="w-full h-40 object-cover"
        />
        <span className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
          {job.imageBadge}
        </span>
        <span className="absolute top-3 right-3 bg-black/40 text-white text-xs px-2 py-1 rounded-full">
          {current} / {total}
        </span>
      </div>

      {/* Info section */}
      <div className="p-4 space-y-3">
        <p className="text-sm font-medium text-gray-800 leading-snug">{job.title}</p>

        <div>
          <p className="text-xs text-gray-400 mb-0.5">月収例</p>
          <p className="text-xl font-black" style={{ color: "#0288d1" }}>
            {job.monthlyIncome.toLocaleString()}
            <span className="text-base font-bold ml-1">円</span>
          </p>
        </div>

        <div className="space-y-1.5 text-xs text-gray-500">
          <div className="flex items-center gap-2">
            <span>¥</span>
            <span>【月給】{job.monthlySalary}</span>
          </div>
          <div className="flex items-center gap-2">
            <span>📍</span>
            <span>{job.location}</span>
          </div>
          <div className="flex items-center gap-2">
            <span>🔧</span>
            <span>{job.jobTypes.join("、")}</span>
          </div>
          <div className="flex items-center gap-2">
            <span>📋</span>
            <span>{job.jobId}</span>
          </div>
        </div>

        <div className="flex gap-3 pt-1">
          <button
            onClick={onReject}
            className="flex-1 py-3 rounded-xl border-2 border-gray-200 text-gray-400 text-xl font-bold active:bg-gray-50 transition-colors"
          >
            ❌
          </button>
          <button
            onClick={onKeep}
            className="flex-1 py-3 rounded-xl text-white text-sm font-bold active:opacity-80 transition-opacity"
            style={{ backgroundColor: "#4dd0e1" }}
          >
            キープ ★
          </button>
        </div>
      </div>
    </div>
  );
}
