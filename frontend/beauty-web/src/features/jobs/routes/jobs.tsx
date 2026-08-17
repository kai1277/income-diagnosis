import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { BackIcon, BrandIcon } from "@/features/diagnosis/components/icons";
import { JobMatchCard } from "@/features/jobs/components/job-match-card";
import { fetchBeautyJobs, type BeautyJob } from "@/features/jobs/lib/beauty-jobs";
import type { JobId } from "@/features/diagnosis/types";
import { JOBS } from "@/features/diagnosis/constants/jobs";

const KEPT_JOBS_KEY = "beauty_kept_jobs";

const JOB_IDS: JobId[] = ["hair", "nail", "lash", "esthe"];

function parseJobId(value: string | null): JobId | null {
  if (value && (JOB_IDS as string[]).includes(value)) return value as JobId;
  return null;
}

type Status = "loading" | "ready" | "error";

export default function Jobs() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const jobId = parseJobId(searchParams.get("jobId"));

  const [status, setStatus] = useState<Status>("loading");
  const [jobs, setJobs] = useState<BeautyJob[]>([]);
  const [index, setIndex] = useState(0);
  const [kept, setKept] = useState<string[]>([]);

  useEffect(() => {
    if (!jobId) {
      setStatus("error");
      return;
    }
    setStatus("loading");
    fetchBeautyJobs(jobId)
      .then((data) => {
        setJobs(data);
        setStatus("ready");
      })
      .catch(() => setStatus("error"));
  }, [jobId]);

  const handleKeep = () => {
    if (!jobs[index]) return;
    const next = [...kept, jobs[index].id];
    setKept(next);
    localStorage.setItem(KEPT_JOBS_KEY, JSON.stringify(next));
    setIndex((i) => i + 1);
  };

  const handleReject = () => {
    setIndex((i) => i + 1);
  };

  const total = jobs.length;
  const isDone = status === "ready" && total > 0 && index >= total;

  useEffect(() => {
    if (!isDone) return;
    const timer = setTimeout(() => navigate("/user-my-page"), 1500);
    return () => clearTimeout(timer);
  }, [isDone, navigate]);

  return (
    <div className="screen">
      <div className="topbar">
        <div className="backbtn" onClick={() => navigate(-1)}>
          <BackIcon />
        </div>
        <div className="brand">
          <BrandIcon />
          キレキャリ
        </div>
        <div style={{ width: 34 }}></div>
      </div>

      <div className="jobs-shell">
        <div className="jobs-eyebrow">RECOMMENDED JOBS</div>
        <div className="jobs-title">{jobId ? `${JOBS[jobId].label}の求人を探す` : "求人検索"}</div>

        {status === "loading" && (
          <div className="jobs-empty">
            <p>求人を読み込んでいます…</p>
          </div>
        )}

        {status === "error" && (
          <div className="jobs-empty">
            <p>求人情報の取得に失敗しました。</p>
            <button className="btn-primary" onClick={() => navigate("/")}>
              診断結果に戻る
            </button>
          </div>
        )}

        {status === "ready" && total === 0 && (
          <div className="jobs-empty">
            <p>現在、この職種に合う求人が見つかりませんでした。</p>
            <button className="btn-primary" onClick={() => navigate("/")}>
              診断結果に戻る
            </button>
          </div>
        )}

        {status === "ready" && total > 0 && !isDone && jobId && (
          <JobMatchCard
            key={jobs[index].id}
            job={jobs[index]}
            jobId={jobId}
            current={index + 1}
            total={total}
            onKeep={handleKeep}
            onReject={handleReject}
          />
        )}

        {isDone && (
          <div className="jobs-done">
            <div className="done-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <div className="done-title">すべての求人を確認しました</div>
            <p>気になる求人：{kept.length}件</p>
            <button className="btn-primary" onClick={() => navigate("/user-my-page")}>
              マイページで確認する
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
