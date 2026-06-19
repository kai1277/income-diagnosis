import type { MockJob } from "@/features/jobs/lib/mock-jobs";

type Props = {
  job: MockJob;
};

export default function JobCard({ job }: Props) {
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

        <div className="flex gap-2 pt-1">
          <button className="flex-1 py-2.5 rounded-lg border border-gray-200 text-gray-600 text-sm font-medium active:bg-gray-50">
            ☆ キープする
          </button>
          <a
            href={job.detailUrl}
            className="flex-1 py-2.5 rounded-lg border text-center text-sm font-medium active:opacity-80"
            style={{ borderColor: "#0288d1", color: "#0288d1" }}
          >
            詳細を見る
          </a>
        </div>
      </div>
    </div>
  );
}
