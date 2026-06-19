import { useNavigate } from "react-router-dom";
import JobCard from "@/features/jobs/components/job-card";
import { MOCK_JOBS } from "@/features/jobs/lib/mock-jobs";

export default function Jobs() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#f0f2f5" }}>
      <div className="px-4 py-5 space-y-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="text-gray-500 text-sm"
          >
            ← 戻る
          </button>
          <p className="text-sm font-bold text-gray-700">おすすめ求人</p>
        </div>

        <p className="text-xs text-gray-400">{MOCK_JOBS.length}件の求人が見つかりました</p>

        <div className="space-y-4">
          {MOCK_JOBS.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>
      </div>
    </div>
  );
}
