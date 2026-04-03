import { useSearchParams } from "react-router-dom";
import ResultCard from "@/components/ResultCard";
import JobLink from "@/components/JobLink";
import { diagnose, type QuizAnswers } from "@/lib/diagnosis";
import { JOB_LINKS } from "@/lib/jobLinks";

export default function Result() {
  const [params] = useSearchParams();

  const answers: QuizAnswers = {
    ageRange: params.get("ageRange") ?? "30代",
    jobCategory: params.get("jobCategory") ?? "その他",
    currentIncome: params.get("currentIncome") ?? "300〜400万",
    workStyle: params.get("workStyle") ?? "安定重視",
    manualWork: params.get("manualWork") ?? "少しある",
  };

  const result = diagnose(answers);
  const isBlueCollar =
    answers.manualWork === "全然ない" && answers.workStyle === "成果・稼ぎ重視";

  return (
    <div className="min-h-screen bg-gray-50 pb-40">
      <div className="px-4 pt-6 max-w-sm mx-auto space-y-2">
        <p className="text-xs text-gray-400 text-center mb-4">診断結果</p>
        <ResultCard
          potentialIncome={result.potentialIncome}
          incomeGap={result.incomeGap}
          suggestedJobs={result.suggestedJobs}
        />
      </div>

      {/* Sticky CTA */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-4 space-y-3 shadow-lg">
        <JobLink
          label="この条件の求人を見る"
          jobType={isBlueCollar ? "blue_collar" : "general"}
          url={isBlueCollar ? JOB_LINKS.blueCollar : JOB_LINKS.general}
          variant="primary"
        />
        <JobLink
          label={`年収${result.potentialIncome}万円以上の求人`}
          jobType="high_income"
          url={JOB_LINKS.highIncome}
          variant="secondary"
        />
      </div>
    </div>
  );
}
