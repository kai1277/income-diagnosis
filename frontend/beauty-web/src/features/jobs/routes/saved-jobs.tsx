import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { BackIcon, BrandIcon } from "@/features/diagnosis/components/icons";
import { SavedJobCard } from "@/features/jobs/components/saved-job-card";
import { fetchBeautyJobs, type BeautyJob } from "@/features/jobs/lib/beauty-jobs";
import type { JobId } from "@/features/diagnosis/types";
import { JOBS } from "@/features/diagnosis/constants/jobs";
import { SiteFooter } from "@/components/site-footer";

const KEPT_JOBS_KEY = "beauty_kept_jobs";

const JOB_IDS: JobId[] = ["hair", "nail", "lash", "esthe"];

function parseJobId(value: string | null): JobId | null {
  if (value && (JOB_IDS as string[]).includes(value)) return value as JobId;
  return null;
}

function readKeptIds(): string[] {
  try {
    const stored = localStorage.getItem(KEPT_JOBS_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

type Status = "loading" | "ready" | "error";

export default function SavedJobs() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const jobId = parseJobId(searchParams.get("jobId"));

  const [status, setStatus] = useState<Status>("loading");
  const [jobs, setJobs] = useState<BeautyJob[]>([]);

  useEffect(() => {
    if (!jobId) {
      setStatus("error");
      return;
    }
    setStatus("loading");
    const keptIds = readKeptIds();
    fetchBeautyJobs(jobId)
      .then((data) => {
        setJobs(data.filter((job) => keptIds.includes(job.id)));
        setStatus("ready");
      })
      .catch(() => setStatus("error"));
  }, [jobId]);

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
        <div className="jobs-eyebrow">SAVED JOBS</div>
        <div className="jobs-title">{jobId ? `気になる${JOBS[jobId].label}求人` : "気になる求人"}</div>

        {status === "loading" && (
          <div className="jobs-empty">
            <p>求人を読み込んでいます…</p>
          </div>
        )}

        {status === "error" && (
          <div className="jobs-empty">
            <p>求人情報の取得に失敗しました。</p>
            <button className="btn-primary" onClick={() => navigate("/user-my-page")}>
              マイページに戻る
            </button>
          </div>
        )}

        {status === "ready" && jobs.length === 0 && (
          <div className="jobs-empty">
            <p>まだ気になる求人はありません。</p>
            <button className="btn-primary" onClick={() => jobId && navigate(`/jobs?jobId=${jobId}`)}>
              求人を探す
            </button>
          </div>
        )}

        {status === "ready" && jobs.length > 0 && jobId && (
          <div className="saved-jobs-list">
            {jobs.map((job) => (
              <SavedJobCard key={job.id} job={job} jobId={jobId} />
            ))}
          </div>
        )}

        <SiteFooter />
      </div>
    </div>
  );
}
