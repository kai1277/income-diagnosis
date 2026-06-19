import { useState, useRef } from "react";
import type { MockJob } from "@/features/jobs/lib/mock-jobs";
import { getTracking } from "@/lib/tracking";

const SWIPE_THRESHOLD = 80;
const EXIT_X = 500;

type Props = {
  job: MockJob;
  current: number;
  total: number;
  onKeep: () => void;
  onReject: () => void;
};

function trackJobLinkClick(clickType: "image" | "detail_button", job: MockJob) {
  window.gtag?.("event", "job_link_click", {
    click_type: clickType,
    job_id: job.jobId,
    destination_url: job.affiliateUrl,
    ...getTracking(),
  });
}

export default function JobCard({
  job,
  current,
  total,
  onKeep,
  onReject,
}: Props) {
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
      style={{
        transform: `translateX(${dragX}px) rotate(${rotation}deg)`,
        transition: dragging.current ? "none" : "transform 0.25s ease",
        touchAction: "pan-y",
        userSelect: "none",
      }}
      className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden relative"
    >
      {/* Keep overlay */}
      <div
        className="absolute inset-0 z-10 flex items-center justify-center rounded-xl pointer-events-none"
        style={{
          backgroundColor: `rgba(77, 208, 225, ${keepOpacity * 0.25})`,
          opacity: keepOpacity,
        }}
      >
        <span
          className="text-4xl font-black border-4 rounded-xl px-4 py-2 rotate-[-20deg]"
          style={{ color: "#4dd0e1", borderColor: "#4dd0e1" }}
        >
          キープ ★
        </span>
      </div>

      {/* Reject overlay */}
      <div
        className="absolute inset-0 z-10 flex items-center justify-center rounded-xl pointer-events-none"
        style={{
          backgroundColor: `rgba(239, 68, 68, ${rejectOpacity * 0.25})`,
          opacity: rejectOpacity,
        }}
      >
        <span
          className="text-4xl font-black border-4 rounded-xl px-4 py-2 rotate-[20deg]"
          style={{ color: "#ef4444", borderColor: "#ef4444" }}
        >
          スキップ ❌
        </span>
      </div>

      {/* Image section — affiliateUrl があればタップで遷移 */}
      <div className="relative">
        {job.affiliateUrl ? (
          <a
            href={job.affiliateUrl}
            target="_blank"
            rel="nofollow noopener noreferrer"
            onClick={() => trackJobLinkClick("image", job)}
          >
            <img
              src={job.imageUrl}
              alt={job.title}
              className="w-full h-40 object-contain bg-gray-100"
              draggable={false}
            />
          </a>
        ) : (
          <img
            src={job.imageUrl}
            alt={job.title}
            className="w-full h-40 object-contain bg-gray-100"
            draggable={false}
          />
        )}
        <span className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
          {job.imageBadge}
        </span>
        <span className="absolute top-3 right-3 bg-black/40 text-white text-xs px-2 py-1 rounded-full">
          {current} / {total}
        </span>
      </div>

      {/* Info section */}
      <div className="p-4 space-y-3">
        <p className="text-sm font-medium text-gray-800 leading-snug">
          {job.title}
        </p>

        <p className="text-xl font-black" style={{ color: "#0288d1" }}>
          {job.incomeRange}
        </p>

        <div className="space-y-1.5 text-xs text-gray-500">
          <div className="flex items-center gap-2">
            <span>📍</span>
            <span>{job.location}</span>
          </div>
          <div className="flex items-center gap-2">
            <span>🔧</span>
            <span>{job.jobTypes.join("、")}</span>
          </div>
        </div>

        {/* 詳細リンク — affiliateUrl がある求人のみ表示 */}
        {job.affiliateUrl && (
          <a
            href={job.affiliateUrl}
            target="_blank"
            rel="nofollow noopener noreferrer"
            onClick={() => trackJobLinkClick("detail_button", job)}
            className="block w-full py-2.5 text-center text-sm font-medium rounded-xl border"
            style={{ color: "#0288d1", borderColor: "#0288d1" }}
          >
            詳細を見る →
          </a>
        )}

        <div className="flex gap-3 pt-1">
          <button
            onClick={() => exit("reject")}
            className="flex-1 py-3 rounded-xl border-2 border-gray-200 text-gray-400 text-xl font-bold active:bg-gray-50 transition-colors"
          >
            ❌
          </button>
          <button
            onClick={() => exit("keep")}
            className="flex-1 py-3 rounded-xl text-white text-sm font-bold active:opacity-80 transition-opacity"
            style={{ backgroundColor: "#4dd0e1" }}
          >
            キープ ★
          </button>
        </div>
      </div>

      {/* A8.net インプレッション計測ピクセル */}
      {job.impressionPixelUrl && (
        <img
          src={job.impressionPixelUrl}
          width={1}
          height={1}
          alt=""
          style={{
            position: "absolute",
            bottom: 0,
            right: 0,
            opacity: 0,
            pointerEvents: "none",
          }}
        />
      )}
    </div>
  );
}
