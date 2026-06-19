import { useState } from "react";
import { useNavigate } from "react-router-dom";
import JobCard from "@/features/jobs/components/job-card";
import { MOCK_JOBS } from "@/features/jobs/lib/mock-jobs";

export default function Jobs() {
  const navigate = useNavigate();
  const [index, setIndex] = useState(0);
  const [kept, setKept] = useState<string[]>([]);

  const total = MOCK_JOBS.length;
  const isDone = index >= total;

  const handleKeep = () => {
    setKept((prev) => [...prev, MOCK_JOBS[index].id]);
    setIndex((i) => i + 1);
  };

  const handleReject = () => {
    setIndex((i) => i + 1);
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#f0f2f5" }}>
      <div className="px-4 py-5 space-y-4">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="text-gray-500 text-sm">
            ← 戻る
          </button>
          <p className="text-sm font-bold text-gray-700">おすすめ求人</p>
        </div>

        {isDone ? (
          <div className="flex flex-col items-center justify-center gap-4 pt-16 text-center">
            <p className="text-4xl">🎉</p>
            <p className="text-gray-700 font-bold">全ての求人を確認しました</p>
            <p className="text-gray-400 text-sm">
              キープした求人：{kept.length}件
            </p>
            <button
              onClick={() => navigate(-1)}
              className="mt-4 px-6 py-3 rounded-xl text-white text-sm font-bold"
              style={{ backgroundColor: "#4dd0e1" }}
            >
              診断結果に戻る
            </button>
          </div>
        ) : (
          <JobCard
            job={MOCK_JOBS[index]}
            current={index + 1}
            total={total}
            onKeep={handleKeep}
            onReject={handleReject}
          />
        )}
      </div>
    </div>
  );
}
