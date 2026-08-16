import { useEffect, useRef, useState } from "react";
import { BackIcon, BrandIcon } from "@/features/diagnosis/components/icons";
import { JobSelectPanel } from "@/features/diagnosis/components/job-select-panel";
import { LoadingPanel } from "@/features/diagnosis/components/loading-panel";
import { ProgressRow } from "@/features/diagnosis/components/progress-row";
import { QuestionPanel } from "@/features/diagnosis/components/question-panel";
import { ResultPanel } from "@/features/diagnosis/components/result-panel";
import { JOBS } from "@/features/diagnosis/constants/jobs";
import type { AnswerValue, Answers, JobId } from "@/features/diagnosis/types";
import { trackEvent } from "@/lib/analytics";

const TRANSITION_MS = 420;

export default function DiagnosisFlow() {
  const [jobId, setJobId] = useState<JobId | null>(null);
  const [answers, setAnswers] = useState<Answers>({});
  const [step, setStep] = useState(0);
  const [outgoingStep, setOutgoingStep] = useState<number | null>(null);
  const [entered, setEntered] = useState(true);
  const outgoingTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

  const totalQ = jobId ? JOBS[jobId].questions.length : 0;

  const goTo = (next: number) => {
    setOutgoingStep(step);
    setEntered(false);
    setStep(next);
    if (outgoingTimer.current) clearTimeout(outgoingTimer.current);
    outgoingTimer.current = setTimeout(() => setOutgoingStep(null), TRANSITION_MS);
  };

  useEffect(() => {
    const raf = requestAnimationFrame(() => setEntered(true));
    return () => cancelAnimationFrame(raf);
  }, [step]);

  useEffect(
    () => () => {
      if (outgoingTimer.current) clearTimeout(outgoingTimer.current);
    },
    [],
  );

  const handleSelectJob = (id: JobId) => {
    setJobId(id);
    setAnswers({});
    trackEvent("quiz_start", { job_type: id });
    goTo(1);
  };

  const handleAnswer = (key: string, value: AnswerValue) => {
    setAnswers((prev) => ({ ...prev, [key]: value }));
  };

  const handleRetry = () => {
    setJobId(null);
    setAnswers({});
    goTo(0);
  };

  const handleLoadingComplete = () => {
    trackEvent("quiz_complete", { job_type: jobId });
    goTo(totalQ + 2);
  };

  const handleSearch = () => {
    trackEvent("job_link_click", { job_type: jobId });
  };

  const panelExtraClass = (s: number) => {
    if (s === 0) return "intro";
    if (jobId && s === totalQ + 1) return "loading";
    if (jobId && s === totalQ + 2) return "result";
    return "";
  };

  const renderStep = (s: number) => {
    if (s === 0) return <JobSelectPanel onSelect={handleSelectJob} />;
    if (!jobId) return null;
    const job = JOBS[jobId];
    if (s >= 1 && s <= totalQ) {
      const question = job.questions[s - 1];
      return (
        <QuestionPanel
          question={question}
          index={s - 1}
          totalQ={totalQ}
          answers={answers}
          onAnswer={handleAnswer}
          onNext={() => goTo(s + 1)}
        />
      );
    }
    if (s === totalQ + 1) return <LoadingPanel onComplete={handleLoadingComplete} />;
    if (s === totalQ + 2) {
      const estimate = job.calc(answers);
      return <ResultPanel job={job} estimate={estimate} answers={answers} onSearch={handleSearch} onRetry={handleRetry} />;
    }
    return null;
  };

  const canGoBack = step > 0 && step <= totalQ;

  return (
    <div className="screen">
      <div className="topbar">
        <div className={`backbtn ${canGoBack ? "" : "hidden"}`} onClick={() => canGoBack && goTo(step - 1)}>
          <BackIcon />
        </div>
        <div className="brand">
          <BrandIcon />
          MIRROR
        </div>
        <div style={{ width: 34 }}></div>
      </div>
      <ProgressRow step={step} totalQ={totalQ} />
      <div className="panels">
        {outgoingStep !== null && (
          <div className={`panel leaving ${panelExtraClass(outgoingStep)}`}>{renderStep(outgoingStep)}</div>
        )}
        <div className={`panel ${entered ? "active" : ""} ${panelExtraClass(step)}`}>{renderStep(step)}</div>
      </div>
    </div>
  );
}
