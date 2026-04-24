import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import JobLink from "@/components/JobLink";
import { diagnose, type QuizAnswers } from "@/lib/diagnosis";
import { getJobUrl, JOB_LINKS } from "@/lib/jobLinks";
import { getTracking } from "@/lib/tracking";

const RANK_GRADIENT: Record<string, string> = {
  S: "from-amber-400 to-yellow-500",
  A: "from-violet-400 to-purple-600",
  B: "from-blue-400 to-cyan-600",
};

const RANK_BG: Record<string, string> = {
  S: "from-amber-950/40 via-slate-900 to-slate-900",
  A: "from-purple-950/40 via-slate-900 to-slate-900",
  B: "from-blue-950/40 via-slate-900 to-slate-900",
};

const RANK_GLOW: Record<string, string> = {
  S: "shadow-amber-500/30",
  A: "shadow-violet-500/30",
  B: "shadow-blue-500/30",
};

export default function Result() {
  const [searchParams] = useSearchParams();
  const detailRef = useRef<HTMLDivElement>(null);
  const [copyDone, setCopyDone] = useState(false);

  const answers: QuizAnswers = {
    ageRange: searchParams.get("ageRange") ?? "30代",
    jobCategory: searchParams.get("jobCategory") ?? "その他",
    currentIncome: searchParams.get("currentIncome") ?? "300〜400万",
    workStyle: searchParams.get("workStyle") ?? "安定重視",
    manualWork: searchParams.get("manualWork") ?? "少しある",
  };

  const result = diagnose(answers);
  const tracking = getTracking();

  useEffect(() => {
    window.gtag?.("event", "result_view", { ...tracking, result_card_id: result.id });
  }, []);

  const handleShare = async () => {
    window.gtag?.("event", "result_share", { result_card_id: result.id, ...tracking });
    if (navigator.share) {
      await navigator.share({ text: result.shareText, title: "市場価値タイプ診断" });
    } else {
      await navigator.clipboard.writeText(result.shareText);
      setCopyDone(true);
      setTimeout(() => setCopyDone(false), 2000);
    }
  };

  const gradient = RANK_GRADIENT[result.rank];
  const bg = RANK_BG[result.rank];
  const glow = RANK_GLOW[result.rank];

  return (
    <div className="min-h-screen bg-slate-900 pb-36">
      {/* ── PUBLIC CARD (シェア用) ── */}
      <div className={`min-h-screen flex flex-col bg-gradient-to-b ${bg} px-5 pt-10 pb-8`}>
        {/* Rank badge */}
        <div className="flex justify-center mb-6">
          <div
            className={`px-6 py-2 rounded-full bg-gradient-to-r ${gradient} text-white font-black text-sm tracking-[0.15em] shadow-lg ${glow}`}
          >
            市場価値ランク {result.rank}
          </div>
        </div>

        {/* Character emoji */}
        <div className="text-center text-8xl mb-3 select-none">{result.emoji}</div>

        {/* Character name */}
        <h1
          className={`text-center text-3xl font-black mb-3 text-transparent bg-clip-text bg-gradient-to-r ${gradient}`}
        >
          {result.name}
        </h1>

        {/* Growth type */}
        <div className="flex justify-center mb-6">
          <span className="bg-white/10 border border-white/15 text-white/70 text-xs font-semibold px-4 py-1.5 rounded-full tracking-wide">
            {result.growthType}
          </span>
        </div>

        {/* Tagline */}
        <p className="text-center text-white/60 text-sm italic px-6 leading-relaxed mb-10">
          &ldquo;{result.tagline}&rdquo;
        </p>

        {/* Actions */}
        <div className="mt-auto space-y-3">
          <button
            onClick={handleShare}
            className="w-full py-4 bg-white text-slate-900 font-bold text-base rounded-2xl active:scale-95 transition-transform shadow-md"
          >
            {copyDone ? "✓ コピーしました！" : "📤 結果をシェアする"}
          </button>
          <button
            onClick={() => detailRef.current?.scrollIntoView({ behavior: "smooth" })}
            className="w-full py-4 bg-white/10 border border-white/15 text-white/80 font-medium text-base rounded-2xl active:scale-95 transition-transform"
          >
            詳細を見る ↓
          </button>
        </div>
      </div>

      {/* ── DETAIL SECTION ── */}
      <div ref={detailRef} className="px-5 pt-8 space-y-4">
        {/* Potential income */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
          <p className="text-white/40 text-xs font-medium mb-1 tracking-wide uppercase">潜在年収（推定）</p>
          <p className="text-white text-4xl font-black">
            {result.potentialIncome}
            <span className="text-xl font-bold ml-1">万円</span>
          </p>
          <p className="text-amber-400 text-sm font-semibold mt-1.5">
            現在より +{result.incomeGap}万円の伸びしろ
          </p>
        </div>

        {/* Description */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
          <p className="text-white/40 text-xs font-medium mb-2 tracking-wide uppercase">タイプ分析</p>
          <p className="text-white/75 text-sm leading-relaxed">{result.description}</p>
        </div>

        {/* Suggested jobs */}
        <div>
          <p className="text-white/40 text-xs font-medium mb-3 px-1 tracking-wide uppercase">おすすめ職種</p>
          <div className="space-y-2">
            {result.suggestedJobs.map((job, i) => (
              <div
                key={job.title}
                className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 flex items-start gap-3"
              >
                <span className="text-white/25 font-black text-lg leading-none mt-0.5 shrink-0">
                  0{i + 1}
                </span>
                <div>
                  <p className="text-white font-bold text-sm">{job.title}</p>
                  <p className="text-white/45 text-xs mt-0.5">{job.reason}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── STICKY CTA ── */}
      <div className="fixed bottom-0 left-0 right-0 bg-slate-900/95 backdrop-blur-sm border-t border-white/10 px-4 py-4 space-y-2.5 shadow-2xl">
        <JobLink
          label="この条件の求人を見る"
          jobType={result.id}
          url={getJobUrl(result.id)}
          variant="primary"
          position={1}
          resultCardId={result.id}
        />
        <JobLink
          label={`年収${result.potentialIncome}万円以上の求人`}
          jobType="high_income"
          url={JOB_LINKS.highIncome}
          variant="secondary"
          position={2}
          resultCardId={result.id}
        />
      </div>
    </div>
  );
}
