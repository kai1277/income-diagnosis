import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import JobLink from "@/components/JobLink";
import { diagnose, type QuizAnswers } from "@/lib/diagnosis";
import { getJobUrl, JOB_LINKS } from "@/lib/jobLinks";
import { getTracking } from "@/lib/tracking";

const STEP_LABELS = ["年齢", "職種", "年収", "志向", "適性"];

export default function Result() {
  const [searchParams] = useSearchParams();
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
  const total = STEP_LABELS.length;

  useEffect(() => {
    window.gtag?.("event", "result_view", { ...tracking, result_card_id: result.id });
  }, []);

  const handleShare = async () => {
    window.gtag?.("event", "result_share", { result_card_id: result.id, ...tracking });
    if (navigator.share) {
      await navigator.share({ text: result.shareText, title: "潜在年収診断" });
    } else {
      await navigator.clipboard.writeText(result.shareText);
      setCopyDone(true);
      setTimeout(() => setCopyDone(false), 2000);
    }
  };

  return (
    <div className="min-h-screen pb-36" style={{ backgroundColor: "#f0f2f5" }}>
      {/* Stats bar */}
      <div style={{ backgroundColor: "#8fa3b1" }} className="text-white px-4 py-2.5">
        <div className="flex divide-x divide-white/20 text-center">
          <div className="flex-1 px-2">
            <p className="text-[10px] text-white/70 mb-0.5">今日の診断者数</p>
            <p className="text-sm font-bold">1,284人</p>
          </div>
          <div className="flex-1 px-2">
            <p className="text-[10px] text-white/70 mb-0.5">あなたの潜在年収（推定）</p>
            <p className="text-sm font-bold">{result.potentialIncome}万円</p>
          </div>
          <div className="flex-1 px-2">
            <p className="text-[10px] text-white/70 mb-0.5">提携求人件数</p>
            <p className="text-sm font-bold">2.3万件</p>
          </div>
        </div>
      </div>

      {/* All steps complete */}
      <div className="flex" style={{ backgroundColor: "#e0e5ea" }}>
        {STEP_LABELS.map((label, i) => {
          const isFirst = i === 0;
          const isLast = i === total - 1;

          const clipPath = isFirst
            ? "polygon(0 0, calc(100% - 8px) 0, 100% 50%, calc(100% - 8px) 100%, 0 100%)"
            : isLast
            ? "polygon(8px 0, 100% 0, 100% 100%, 8px 100%, 0 50%)"
            : "polygon(8px 0, calc(100% - 8px) 0, 100% 50%, calc(100% - 8px) 100%, 8px 100%, 0 50%)";

          return (
            <div
              key={i}
              className="flex-1 flex items-center justify-center py-3 text-xs font-medium"
              style={{
                backgroundColor: "#b2ebf2",
                color: "#0097a7",
                clipPath,
                zIndex: total - i,
                position: "relative",
                marginLeft: i > 0 ? "-8px" : undefined,
              }}
            >
              {label}
            </div>
          );
        })}
      </div>

      {/* Content */}
      <div className="px-5 pt-6 space-y-4">
        {/* Potential income */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
          <p className="text-xs text-gray-400 font-medium mb-2">あなたの潜在年収（推定）</p>
          <p className="text-4xl font-black text-gray-800">
            {result.potentialIncome}
            <span className="text-2xl font-bold ml-1 text-gray-600">万円</span>
          </p>
          <p className="text-orange-500 text-sm font-semibold mt-2">
            現在より +{result.incomeGap}万円の可能性
          </p>
        </div>

        {/* Type card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
          <div className="flex items-center gap-3 mb-3">
            <span className="text-4xl select-none">{result.emoji}</span>
            <div>
              <p className="text-xs text-gray-400 mb-0.5">{result.growthType}</p>
              <p className="text-lg font-bold text-gray-800">{result.name}</p>
            </div>
          </div>
          <p className="text-gray-500 text-sm leading-relaxed">{result.description}</p>
        </div>

        {/* Suggested jobs */}
        <div>
          <p className="text-xs text-gray-400 font-medium mb-3 px-1">おすすめ職種</p>
          <div className="space-y-2">
            {result.suggestedJobs.map((job, i) => (
              <div
                key={job.title}
                className="bg-white rounded-xl shadow-sm border border-gray-100 px-4 py-3 flex items-start gap-3"
              >
                <span
                  className="font-black text-lg leading-none mt-0.5 shrink-0"
                  style={{ color: "#4dd0e1" }}
                >
                  0{i + 1}
                </span>
                <div>
                  <p className="text-gray-800 font-bold text-sm">{job.title}</p>
                  <p className="text-gray-400 text-xs mt-0.5">{job.reason}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Share */}
        <button
          onClick={handleShare}
          className="w-full py-3 rounded-xl border border-gray-200 bg-white text-gray-600 text-sm font-medium shadow-sm active:bg-gray-50 transition-colors"
        >
          {copyDone ? "✓ コピーしました！" : "結果をシェアする"}
        </button>
      </div>

      {/* Sticky CTA */}
      <div
        className="fixed bottom-0 left-0 right-0 px-4 py-4 space-y-2.5"
        style={{ backgroundColor: "rgba(240, 242, 245, 0.97)", borderTop: "1px solid #dde3ea" }}
      >
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
