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
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: "#f0f2f5" }}>
      {/* Stats bar */}
      <div style={{ backgroundColor: "#8fa3b1" }} className="text-white px-4 py-3">
        <div className="flex divide-x divide-white/20 text-center">
          <div className="flex-1 px-2">
            <p className="text-xs text-white/70 mb-0.5">今日の診断者数</p>
            <p className="text-sm font-bold">1,284人</p>
          </div>
          <div className="flex-1 px-2">
            <p className="text-xs text-white/70 mb-0.5">あなたの潜在年収（推定）</p>
            <p className="text-sm font-bold">診断してみよう</p>
          </div>
          <div className="flex-1 px-2">
            <p className="text-xs text-white/70 mb-0.5">提携求人件数</p>
            <p className="text-sm font-bold">2.3万件</p>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col items-center justify-center px-5 py-10 text-center">
        <div className="text-7xl mb-8 select-none">💰</div>

        <h1 className="text-3xl font-bold text-gray-800 leading-tight mb-4">
          あなたの<span style={{ color: "#4dd0e1" }}>潜在年収</span>、
          <br />
          診断します
        </h1>
        <p className="text-gray-500 text-base mb-8 leading-relaxed">
          今の仕事より稼げる可能性を
          <br />
          5問で診断します
        </p>

        <div className="flex gap-2 flex-wrap justify-center mb-10">
          {["5問・1分で完了", "登録不要", "完全無料"].map((f) => (
            <span
              key={f}
              className="bg-white text-gray-500 text-sm px-4 py-2 rounded-full border border-gray-200 shadow-sm"
            >
              {f}
            </span>
          ))}
        </div>

        <button
          onClick={handleStart}
          className="w-full py-5 rounded-xl text-white font-bold text-xl shadow-md active:scale-95 transition-transform"
          style={{ backgroundColor: "#4dd0e1" }}
        >
          無料で診断する
        </button>
        <p className="text-gray-400 text-sm mt-3">ログイン不要・メールアドレス不要</p>
      </div>
    </div>
  );
}
