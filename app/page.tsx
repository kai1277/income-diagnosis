"use client";

import { useRouter } from "next/navigation";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

export default function Home() {
  const router = useRouter();

  const handleStart = () => {
    if (typeof window !== "undefined" && window.gtag) {
      window.gtag("event", "quiz_start");
    }
    router.push("/quiz");
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-5 bg-gradient-to-b from-blue-600 to-blue-800">
      <div className="w-full max-w-sm text-center text-white">
        <p className="text-sm font-semibold tracking-widest uppercase opacity-70 mb-4">Income Diagnosis</p>
        <h1 className="text-3xl font-extrabold leading-tight mb-4">
          あなたの潜在年収、<br />診断します
        </h1>
        <p className="text-base opacity-80 mb-10">
          今の仕事より稼げる可能性を<br />3分で無料チェック
        </p>
        <button
          onClick={handleStart}
          className="w-full py-5 bg-orange-500 active:bg-orange-600 text-white text-xl font-bold rounded-2xl shadow-lg transition-colors"
        >
          無料で診断する
        </button>
        <p className="text-xs opacity-50 mt-4">登録不要・完全無料</p>
      </div>
    </main>
  );
}
