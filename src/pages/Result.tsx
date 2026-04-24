import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import JobLink from "@/components/JobLink";
import { diagnose, type QuizAnswers } from "@/lib/diagnosis";
import { getJobUrl, JOB_LINKS } from "@/lib/jobLinks";
import { getTracking } from "@/lib/tracking";

// ── Loading screen ──────────────────────────────────────────────
function LoadingScreen() {
  const [lineIndex, setLineIndex] = useState(0);
  const lines = [
    "回答データを解析中...",
    "市場データと照合中...",
    "キャリアタイプを判定中...",
    "結果を生成しています...",
  ];

  useEffect(() => {
    const id = setInterval(() => {
      setLineIndex((i) => Math.min(i + 1, lines.length - 1));
    }, 550);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center px-8">
      <div className="text-6xl mb-8 animate-pulse">🔍</div>
      <p className="text-white/80 text-lg font-bold mb-8">診断中...</p>
      <div className="w-full max-w-xs space-y-3">
        {lines.map((line, i) => (
          <div key={line} className="flex items-center gap-3">
            <span className={`shrink-0 text-sm ${i <= lineIndex ? "text-amber-400" : "text-white/20"}`}>
              {i < lineIndex ? "✓" : i === lineIndex ? "▶" : "○"}
            </span>
            <span className={`text-sm transition-colors duration-500 ${i <= lineIndex ? "text-white/70" : "text-white/20"}`}>
              {line}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Result page ─────────────────────────────────────────────────
export default function Result() {
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [copyDone, setCopyDone] = useState(false);
  const detailRef = useRef<HTMLDivElement>(null);

  const answers: QuizAnswers = {
    mondayFeeling: searchParams.get("mondayFeeling") ?? "まあ、いつも通り",
    ageRange: searchParams.get("ageRange") ?? "30代",
    jobCategory: searchParams.get("jobCategory") ?? "なんとも言えない",
    currentIncome: searchParams.get("currentIncome") ?? "300〜400万（まあまあ）",
    workStyle: searchParams.get("workStyle") ?? "安定さえあればいい",
    manualWork: searchParams.get("manualWork") ?? "まあやればできる",
    futureGoal: searchParams.get("futureGoal") ?? "年収アップ",
  };

  const result = diagnose(answers);
  const tracking = getTracking();

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
      window.gtag?.("event", "result_view", { ...tracking, result_card_id: result.id });
    }, 2400);
    return () => clearTimeout(timer);
  }, []);

  const handleShare = async () => {
    window.gtag?.("event", "result_share", { result_card_id: result.id, ...tracking });
    if (navigator.share) {
      await navigator.share({ text: result.shareText, title: "市場価値タイプ診断" }).catch(() => {});
    } else {
      await navigator.clipboard.writeText(result.shareText);
      setCopyDone(true);
      setTimeout(() => setCopyDone(false), 2200);
    }
  };

  if (loading) return <LoadingScreen />;

  return (
    <div className="min-h-screen bg-slate-900 pb-36">
      {/* ── PUBLIC CARD ── */}
      <div className="relative overflow-hidden">
        {/* Rank-colored glow background */}
        <div className={`absolute inset-0 bg-gradient-to-b ${
          result.rank === "S"
            ? "from-amber-950/60 via-slate-900"
            : result.rank === "A"
              ? "from-violet-950/60 via-slate-900"
              : "from-blue-950/50 via-slate-900"
        } to-slate-900`} />

        <div className="relative z-10 min-h-[100svh] flex flex-col px-5 pt-10 pb-8">
          {/* Rank badge */}
          <div className="flex justify-center mb-5">
            <div className={`px-6 py-2 rounded-full font-black text-sm tracking-[0.2em] shadow-lg ${
              result.rank === "S"
                ? "bg-gradient-to-r from-amber-400 to-yellow-500 text-amber-950 shadow-amber-500/40"
                : result.rank === "A"
                  ? "bg-gradient-to-r from-violet-400 to-purple-600 text-white shadow-violet-500/40"
                  : "bg-gradient-to-r from-blue-400 to-cyan-600 text-white shadow-blue-500/40"
            }`}>
              市場価値ランク {result.rank}
            </div>
          </div>

          {/* Character emoji */}
          <div className="text-center text-8xl mb-3 select-none">{result.emoji}</div>

          {/* Character name */}
          <h1 className={`text-center font-black mb-1 text-transparent bg-clip-text bg-gradient-to-r ${result.rankColor} ${
            result.name.length > 8 ? "text-2xl" : "text-3xl"
          }`}>
            {result.name}
          </h1>

          {/* Growth type */}
          <div className="flex justify-center mb-5">
            <span className="bg-white/8 border border-white/12 text-white/60 text-xs font-semibold px-4 py-1.5 rounded-full tracking-wide">
              {result.growthType}
            </span>
          </div>

          {/* Badge lines */}
          <div className="flex flex-wrap justify-center gap-2 mb-6">
            {result.badgeLines.map((line) => (
              <span key={line} className="bg-white/5 border border-white/10 text-white/50 text-xs px-3 py-1 rounded-full">
                {line}
              </span>
            ))}
          </div>

          {/* Catchphrase */}
          <div className="bg-white/4 border border-white/10 rounded-2xl px-5 py-4 mb-8 mx-1">
            <p className="text-center text-white/75 text-base font-semibold leading-relaxed">
              &ldquo;{result.catchphrase}&rdquo;
            </p>
          </div>

          {/* Actions */}
          <div className="mt-auto space-y-3">
            <button
              onClick={handleShare}
              className="w-full py-4 bg-white text-slate-900 font-bold text-base rounded-2xl active:scale-95 transition-transform shadow-md"
            >
              {copyDone ? "✓ コピーしました！" : "📤 この結果をシェアする"}
            </button>
            <button
              onClick={() => detailRef.current?.scrollIntoView({ behavior: "smooth" })}
              className="w-full py-4 bg-white/8 border border-white/12 text-white/70 font-medium text-base rounded-2xl active:scale-95 transition-transform"
            >
              詳細レポートを見る ↓
            </button>
          </div>
        </div>
      </div>

      {/* ── DETAIL SECTION ── */}
      <div ref={detailRef} className="px-5 pt-8 space-y-4">
        {/* Potential income */}
        <div className="bg-white/4 border border-white/10 rounded-2xl p-5">
          <p className="text-white/35 text-[10px] font-bold tracking-[0.2em] uppercase mb-1">潜在年収（推定）</p>
          <div className="flex items-end gap-2">
            <p className="text-white text-4xl font-black">{result.potentialIncome}</p>
            <p className="text-white/60 text-xl font-bold mb-0.5">万円</p>
          </div>
          <p className="text-amber-400 text-sm font-bold mt-1">
            現在より +{result.incomeGap}万円の伸びしろ
          </p>
        </div>

        {/* Personalized description */}
        <div className="bg-white/4 border border-white/10 rounded-2xl p-5">
          <p className="text-white/35 text-[10px] font-bold tracking-[0.2em] uppercase mb-3">あなたへのメッセージ</p>
          <p className="text-white/75 text-sm leading-relaxed">{result.description}</p>
        </div>

        {/* Suggested jobs */}
        <div>
          <p className="text-white/35 text-[10px] font-bold tracking-[0.2em] uppercase mb-3 px-1">
            おすすめ職種 TOP 3
          </p>
          <div className="space-y-2">
            {result.suggestedJobs.map((job, i) => (
              <div
                key={job.title}
                className="bg-white/4 border border-white/10 rounded-xl px-4 py-3.5 flex items-start gap-3"
              >
                <span className={`shrink-0 font-black text-base leading-none mt-0.5 ${
                  i === 0 ? "text-amber-400" : i === 1 ? "text-white/40" : "text-white/25"
                }`}>
                  0{i + 1}
                </span>
                <div>
                  <p className="text-white font-bold text-sm">{job.title}</p>
                  <p className="text-white/40 text-xs mt-0.5 leading-relaxed">{job.reason}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Share reminder */}
        <div className="bg-white/3 border border-white/8 rounded-2xl p-4 text-center">
          <p className="text-white/45 text-xs leading-relaxed">
            この結果、シェアして友達と比べてみよう 🎯<br />
            タイプが違うと反応が面白いかも
          </p>
          <button
            onClick={handleShare}
            className="mt-3 px-6 py-2.5 bg-white/10 border border-white/15 text-white/70 text-sm font-semibold rounded-xl active:scale-95 transition-transform"
          >
            📤 シェアする
          </button>
        </div>
      </div>

      {/* ── STICKY CTA ── */}
      <div className="fixed bottom-0 left-0 right-0 bg-slate-900/96 backdrop-blur-sm border-t border-white/8 px-4 py-4 space-y-2 shadow-2xl">
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
