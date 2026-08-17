import { useRef, useState } from "react";
import type { BeautyJob } from "@/features/jobs/lib/beauty-jobs";
import type { JobId } from "@/features/diagnosis/types";
import { trackEvent } from "@/lib/analytics";

const SWIPE_THRESHOLD = 80;
const EXIT_X = 500;

type Props = {
  job: BeautyJob;
  jobId: JobId;
  current: number;
  total: number;
  onKeep: () => void;
  onReject: () => void;
};

function trackAffiliateClick(clickType: "image" | "detail_button", job: BeautyJob, jobId: JobId) {
  trackEvent("affiliate_click", {
    job_id: job.id,
    occupation_type: jobId,
    result_type: job.jobTypes[0] ?? "",
    click_type: clickType,
  });
}

export function JobMatchCard({ job, jobId, current, total, onKeep, onReject }: Props) {
  const [dragX, setDragX] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const startX = useRef(0);
  const startY = useRef(0);
  const dragging = useRef(false);
  const horizontalLocked = useRef(false);

  const exit = (direction: "keep" | "reject") => {
    setIsAnimating(true);
    setDragX(direction === "keep" ? EXIT_X : -EXIT_X);
    setTimeout(() => {
      if (direction === "keep") onKeep();
      else onReject();
    }, 250);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (isAnimating) return;
    startX.current = e.touches[0].clientX;
    startY.current = e.touches[0].clientY;
    dragging.current = true;
    horizontalLocked.current = false;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!dragging.current || isAnimating) return;
    const deltaX = e.touches[0].clientX - startX.current;
    const deltaY = e.touches[0].clientY - startY.current;

    if (!horizontalLocked.current) {
      if (Math.abs(deltaX) > Math.abs(deltaY) + 5) {
        horizontalLocked.current = true;
      } else if (Math.abs(deltaY) > Math.abs(deltaX) + 5) {
        dragging.current = false;
        return;
      } else {
        return;
      }
    }

    e.preventDefault();
    setDragX(deltaX);
  };

  const handleTouchEnd = () => {
    if (!dragging.current) return;
    dragging.current = false;
    if (dragX > SWIPE_THRESHOLD) {
      exit("keep");
    } else if (dragX < -SWIPE_THRESHOLD) {
      exit("reject");
    } else {
      setDragX(0);
    }
  };

  const rotation = dragX * 0.04;
  const keepOpacity = Math.min(Math.max(dragX / SWIPE_THRESHOLD, 0), 1);
  const rejectOpacity = Math.min(Math.max(-dragX / SWIPE_THRESHOLD, 0), 1);

  return (
    <div
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      className="match-card"
      style={{
        transform: `translateX(${dragX}px) rotate(${rotation}deg)`,
        transition: dragging.current ? "none" : "transform 0.25s ease",
      }}
    >
      <div className="match-stamp keep" style={{ opacity: keepOpacity }}>
        気になる ★
      </div>
      <div className="match-stamp skip" style={{ opacity: rejectOpacity }}>
        スキップ
      </div>

      <div className="match-media">
        {job.imageUrl ? (
          <a href={job.affiliateUrl} target="_blank" rel="nofollow noopener noreferrer" onClick={() => trackAffiliateClick("image", job, jobId)}>
            <img src={job.imageUrl} alt={job.title} draggable={false} />
          </a>
        ) : (
          <div className="match-media-fallback">キレキャリ</div>
        )}
        {job.imageBadge && <span className="match-badge">{job.imageBadge}</span>}
        <span className="match-counter">
          {current} / {total}
        </span>
      </div>

      <div className="match-body">
        <p className="match-title">{job.title}</p>
        <p className="match-income">{job.incomeRange}</p>

        <div className="match-meta">
          {job.location && (
            <div className="match-meta-row">
              <span>エリア</span>
              <span>{job.location}</span>
            </div>
          )}
          {job.jobTypes.length > 0 && (
            <div className="match-meta-row">
              <span>特徴</span>
              <span>{job.jobTypes.join("、")}</span>
            </div>
          )}
        </div>

        <a
          href={job.affiliateUrl}
          target="_blank"
          rel="nofollow noopener noreferrer"
          onClick={() => trackAffiliateClick("detail_button", job, jobId)}
          className="match-detail-link"
        >
          詳細を見る →
        </a>

        <div className="match-actions">
          <button onClick={() => exit("reject")} className="match-btn reject" aria-label="スキップ">
            ✕
          </button>
          <button onClick={() => exit("keep")} className="match-btn keep">
            気になる ★
          </button>
        </div>
      </div>

      {job.impressionPixelUrl && (
        <img src={job.impressionPixelUrl} width={1} height={1} alt="" className="match-pixel" />
      )}
    </div>
  );
}
