import { useEffect, useRef, useState } from "react";
import { ArrowRightIcon } from "@/features/diagnosis/components/icons";
import { buildTags } from "@/features/diagnosis/utils/build-tags";
import type { Answers, Estimate, Job } from "@/features/diagnosis/types";

interface Props {
  job: Job;
  estimate: Estimate;
  answers: Answers;
  onSearch: () => void;
  onRetry: () => void;
}

const GAUGE_R = 100;
const GAUGE_CX = 140;
const GAUGE_CY = 120;
const GAUGE_START_ANGLE = 200;
const GAUGE_END_ANGLE = -20;
const GAUGE_FULL_LEN = 315;

function toRad(d: number) {
  return (d * Math.PI) / 180;
}

function gaugePoint(angle: number, radius: number) {
  return {
    x: GAUGE_CX + radius * Math.cos(toRad(angle)),
    y: GAUGE_CY - radius * Math.sin(toRad(angle)),
  };
}

const GAUGE_P0 = gaugePoint(GAUGE_START_ANGLE, GAUGE_R);
const GAUGE_P1 = gaugePoint(GAUGE_END_ANGLE, GAUGE_R);
const GAUGE_ARC_D = `M ${GAUGE_P0.x} ${GAUGE_P0.y} A ${GAUGE_R} ${GAUGE_R} 0 0 1 ${GAUGE_P1.x} ${GAUGE_P1.y}`;

export function ResultPanel({ job, estimate, answers, onSearch, onRetry }: Props) {
  const fgRef = useRef<SVGPathElement>(null);
  const needleRef = useRef<SVGLineElement>(null);
  const [count, setCount] = useState(0);
  const [searching, setSearching] = useState(false);

  useEffect(() => {
    const fg = fgRef.current;
    const needle = needleRef.current;
    if (!fg || !needle) return;

    const enterFrame = requestAnimationFrame(() => {
      fg.style.transition = "stroke-dashoffset 1.4s cubic-bezier(.22,.9,.32,1)";
      fg.style.strokeDashoffset = String(GAUGE_FULL_LEN - GAUGE_FULL_LEN * estimate.pct);
    });

    const duration = 1400;
    const t0 = performance.now();
    let raf = 0;
    function frame(t: number) {
      const elapsed = Math.min((t - t0) / duration, 1);
      const eased = 1 - Math.pow(1 - elapsed, 3);
      const curPct = eased * estimate.pct;
      const ang = GAUGE_START_ANGLE + (GAUGE_END_ANGLE - GAUGE_START_ANGLE) * curPct;
      const point = gaugePoint(ang, GAUGE_R - 14);
      needle?.setAttribute("x2", String(point.x));
      needle?.setAttribute("y2", String(point.y));
      setCount(Math.round(eased * estimate.center));
      if (elapsed < 1) {
        raf = requestAnimationFrame(frame);
      } else {
        setCount(estimate.center);
      }
    }
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(enterFrame);
      cancelAnimationFrame(raf);
    };
  }, [estimate]);

  const tags = buildTags(job, answers);

  const handleSearch = () => {
    setSearching(true);
    onSearch();
  };

  return (
    <>
      <div className="result-eyebrow">YOUR ESTIMATED SALARY — {job.label.toUpperCase()}</div>
      <div className="result-name">{job.resultName}</div>
      <div className="gauge-wrap">
        <svg viewBox="0 0 280 150">
          <defs>
            <linearGradient id="gaugeGrad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#8A5346" />
              <stop offset="50%" stopColor="#E38B72" />
              <stop offset="100%" stopColor="#E4C388" />
            </linearGradient>
          </defs>
          <path d={GAUGE_ARC_D} stroke="rgba(255,255,255,0.08)" strokeWidth="14" fill="none" strokeLinecap="round" />
          <path
            ref={fgRef}
            d={GAUGE_ARC_D}
            stroke="url(#gaugeGrad)"
            strokeWidth="14"
            fill="none"
            strokeLinecap="round"
            strokeDasharray={GAUGE_FULL_LEN}
            strokeDashoffset={GAUGE_FULL_LEN}
          />
          <circle cx={GAUGE_CX} cy={GAUGE_CY} r="5" fill="#E4C388" />
          <line
            ref={needleRef}
            x1={GAUGE_CX}
            y1={GAUGE_CY}
            x2={GAUGE_P0.x}
            y2={GAUGE_P0.y}
            stroke="#F6EFE4"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
        </svg>
        <div className="gauge-number">
          <div className="yen">想定年収</div>
          <div className="amt">
            <span>{count}</span>
            <small>万円</small>
          </div>
          <div className="range">
            レンジ　{estimate.low}万円 〜 {estimate.high}万円
          </div>
        </div>
      </div>

      <div className="card-cert">
        <div className="cert-title">
          <span>診断カルテ</span>
          <span>MIRROR CHECK / {job.label}</span>
        </div>
        <div className="tag-row">
          {tags.map((t, i) => (
            <div className="tag" key={`${t}-${i}`}>
              {t}
            </div>
          ))}
        </div>
        <div className="breakdown-list">
          {estimate.breakdown.map((row, i) => (
            <div className="b-row" key={i}>
              <span className="b-label">{row.label}</span>
              <span className="b-dots"></span>
              <span className="b-val">{row.text}</span>
            </div>
          ))}
          <div className="b-row total">
            <span className="b-label">想定年収 合計</span>
            <span className="b-dots"></span>
            <span className="b-val">{estimate.center}万円</span>
          </div>
        </div>
      </div>

      <div className="cta-block">
        <button className="btn-primary" onClick={handleSearch} style={searching ? { opacity: 0.75 } : undefined}>
          {searching ? "求人を検索しています…" : "この条件で求人を探す"}
          {!searching && <ArrowRightIcon />}
        </button>
        <button className="btn-ghost" onClick={onRetry}>
          別の職種でもう一度診断する
        </button>
      </div>
      <div className="fine">※本診断はモックであり、実際の年収を保証するものではありません。歩合率・給与水準は求人ごとに異なります。</div>
    </>
  );
}
