import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { captureTrackingParams, getTracking } from "@/lib/tracking";

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
    <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-slate-900 via-purple-950 to-slate-900 px-5 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none select-none">
        <span className="absolute top-16 left-8 text-4xl opacity-10 rotate-12">✨</span>
        <span className="absolute top-28 right-6 text-3xl opacity-10 -rotate-12">💫</span>
        <span className="absolute bottom-48 left-4 text-3xl opacity-10 rotate-6">⭐</span>
        <span className="absolute bottom-36 right-8 text-2xl opacity-10 -rotate-6">✨</span>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-sm text-center relative z-10">
        {/* Character icon */}
        <div className="mb-6">
          <div className="text-7xl mb-4">🎯</div>
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/15 rounded-full px-4 py-1.5">
            <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
            <span className="text-white/60 text-xs font-medium">今日 1,284人が診断中</span>
          </div>
        </div>

        {/* Headline */}
        <h1 className="text-4xl font-extrabold text-white leading-tight mb-3">
          あなたの
          <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-400">
            市場価値タイプ
          </span>
          <br />
          診断します
        </h1>
        <p className="text-white/50 text-sm mb-8 leading-relaxed">
          5問でわかる、あなたのキャリアの本当の価値
        </p>

        {/* Feature pills */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {["診断1分", "登録不要・無料", "結果をシェア可"].map((f) => (
            <span
              key={f}
              className="bg-white/8 text-white/60 text-xs font-medium px-3 py-1.5 rounded-full border border-white/10"
            >
              {f}
            </span>
          ))}
        </div>

        {/* CTA */}
        <button
          onClick={handleStart}
          className="w-full py-5 bg-gradient-to-r from-amber-400 to-orange-500 text-white text-xl font-bold rounded-2xl shadow-lg shadow-orange-500/25 active:scale-95 transition-transform"
        >
          診断スタート →
        </button>
        <p className="text-white/25 text-xs mt-4">ログイン不要・完全無料</p>
      </div>
    </main>
  );
}
