import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import JobCard from '@/features/jobs/components/job-card';
import { MOCK_JOBS, type MockJob } from '@/features/jobs/lib/mock-jobs';

const API_BASE = import.meta.env.VITE_API_URL ?? '';

async function fetchJobsByCodes(codes: string[]): Promise<MockJob[]> {
  const res = await fetch(`${API_BASE}/api/user/jobs?codes=${codes.join(',')}`);
  if (!res.ok) throw new Error();
  return res.json();
}

export default function Jobs() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [jobs, setJobs] = useState<MockJob[]>([]);
  const [index, setIndex] = useState(0);
  const [kept, setKept] = useState<string[]>([]);

  useEffect(() => {
    const codes = searchParams.get('codes');
    if (!codes) {
      setJobs(MOCK_JOBS);
      return;
    }
    const codeList = codes.split(',').filter(Boolean);
    fetchJobsByCodes(codeList)
      .then((data) => setJobs(data.length ? data : MOCK_JOBS))
      .catch(() => setJobs(MOCK_JOBS));
  }, [searchParams]);

  const total = jobs.length;
  const isDone = index >= total;

  useEffect(() => {
    if (!isDone || total === 0) return;
    const timer = setTimeout(() => navigate('/user-my-page'), 1500);
    return () => clearTimeout(timer);
  }, [isDone, total, navigate]);

  const handleKeep = () => {
    const next = [...kept, jobs[index].id];
    setKept(next);
    localStorage.setItem('income_kept_jobs', JSON.stringify(next));
    setIndex((i) => i + 1);
  };

  const handleReject = () => {
    setIndex((i) => i + 1);
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#f0f2f5' }}>
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
            <p className="text-gray-400 text-sm">キープした求人：{kept.length}件</p>
            <button
              onClick={() => navigate(-1)}
              className="mt-4 px-6 py-3 rounded-xl text-white text-sm font-bold"
              style={{ backgroundColor: '#4dd0e1' }}
            >
              診断結果に戻る
            </button>
          </div>
        ) : total === 0 ? (
          <div className="flex flex-col items-center justify-center gap-4 pt-16 text-center">
            <p className="text-gray-500 text-sm">求人を読み込み中...</p>
          </div>
        ) : (
          <JobCard
            key={jobs[index].id}
            job={jobs[index]}
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
