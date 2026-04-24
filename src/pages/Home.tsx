import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { captureTrackingParams, getTracking } from "@/lib/tracking";

const TYPES = [
  { emoji: "⚡", name: "未覚醒の職人王", rank: "S" },
  { emoji: "🚀", name: "フリーランス覚醒前夜", rank: "S" },
  { emoji: "💥", name: "稼ぎ本能全開型", rank: "A" },
  { emoji: "🔧", name: "独立で化ける職人型", rank: "A" },
  { emoji: "💻", name: "技術の静かな積み人", rank: "B" },
  { emoji: "🌱", name: "堅実の隠れ強者", rank: "B" },
];

const RANK_BADGE: Record<string, string> = {
  S: "bg-amber-400/20 text-amber-300 border-amber-400/30",
  A: "bg-violet-400/20 text-violet-300 border-violet-400/30",
  B: "bg-blue-400/20 text-blue-300 border-blue-400/30",
};

export default function Home() {
  const navigate = useNavigate();

  useEffect(() => {
    captureTrackingParams();
  }, []);

  const handleStart = () => {
    window.gtag?.("event", "quiz_start", getTracking());
    navigate("/quiz");
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-900 via-purple-950 to-slate-900 px-5 pb-12 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute inset-0 pointer-events-none select-none overflow-hidden">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-600/8 rounded-full blur-3xl" />
        <span className="absolute top-20 left-6 text-3xl opacity-10 rotate-12">✨</span>
        <span className="absolute top-36 right-4 text-2xl opacity-10 -rotate-12">💫</span>
      </div>

      <div className="max-w-sm mx-auto relative z-10">
        {/* Hero */}
        <div className="pt-16 pb-8 text-center">
          <div className="text-7xl mb-5">🎯</div>
          <div className="inline-flex items-center gap-2 bg-white/8 border border-white/10 rounded-full px-4 py-1.5 mb-6">
            <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse shrink-0" />
            <span className="text-white/55 text-xs font-medium">今日 1,284人が診断中</span>
          </div>

          <h1 className="text-4xl font-extrabold text-white leading-tight mb-3 tracking-tight">
            あなたは<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-400">
              どのタイプ？
            </span>
          </h1>
          <p className="text-white/45 text-sm leading-relaxed mb-2">
            7問でわかる、あなたの市場価値タイプ診断
          </p>
          <p className="text-white/30 text-xs mb-8">
            全6タイプ × ランク S〜B
          </p>

          <button
            onClick={handleStart}
            className="w-full py-5 bg-gradient-to-r from-amber-400 to-orange-500 text-white text-xl font-bold rounded-2xl shadow-lg shadow-orange-500/25 active:scale-95 transition-transform mb-3"
          >
            診断スタート →
          </button>
          <p className="text-white/20 text-xs">登録不要・完全無料・1分で完了</p>
        </div>

        {/* Character type preview */}
        <div className="mb-8">
          <p className="text-white/35 text-xs text-center font-medium tracking-widest uppercase mb-4">
            全 6 タイプ
          </p>
          <div className="space-y-2">
            {TYPES.map((t) => (
              <div
                key={t.name}
                className="flex items-center gap-3 bg-white/4 border border-white/8 rounded-xl px-4 py-3"
              >
                <span className="text-xl shrink-0 select-none">{t.emoji}</span>
                <span className="text-white/70 text-sm font-medium flex-1">{t.name}</span>
                <span className={`text-xs font-black px-2 py-0.5 rounded border ${RANK_BADGE[t.rank]}`}>
                  {t.rank}
                </span>
              </div>
            ))}
          </div>
          <p className="text-white/25 text-xs text-center mt-3">
            あなたはどのタイプに当てはまる？
          </p>
        </div>

        {/* CTA repeat */}
        <button
          onClick={handleStart}
          className="w-full py-5 bg-gradient-to-r from-amber-400 to-orange-500 text-white text-xl font-bold rounded-2xl shadow-lg shadow-orange-500/25 active:scale-95 transition-transform"
        >
          今すぐ診断する →
        </button>
      </div>
    </main>
  );
}
