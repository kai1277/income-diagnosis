import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { BackIcon, BrandIcon } from "@/features/diagnosis/components/icons";
import { JobSelectPanel } from "@/features/diagnosis/components/job-select-panel";
import { LoadingError } from "@/features/diagnosis/components/loading-error";
import { LoadingPanel } from "@/features/diagnosis/components/loading-panel";
import { ProgressRow } from "@/features/diagnosis/components/progress-row";
import { QuestionPanel } from "@/features/diagnosis/components/question-panel";
import { ResultPanel } from "@/features/diagnosis/components/result-panel";
import { JOBS } from "@/features/diagnosis/constants/jobs";
import type { AnswerValue, Answers, Estimate, JobId } from "@/features/diagnosis/types";
import { fetchDiagnosis } from "@/features/diagnosis/utils/diagnose";
import { trackEvent } from "@/lib/analytics";

const TRANSITION_MS = 420;
const MIN_LOADING_MS = 2650;

const RESULT_KEY = "beauty_diagnosis_result";
const ANSWERS_KEY = "beauty_diagnosis_answers";

export default function DiagnosisFlow() {
  const navigate = useNavigate();
  const [jobId, setJobId] = useState<JobId | null>(null);
  const [answers, setAnswers] = useState<Answers>({});
  const [estimate, setEstimate] = useState<Estimate | null>(null);
  const [diagnosisError, setDiagnosisError] = useState(false);
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
    setEstimate(null);
    trackEvent("quiz_start", { job_type: id });
    goTo(1);
  };

  const handleAnswer = (key: string, value: AnswerValue) => {
    setAnswers((prev) => ({ ...prev, [key]: value }));
  };

  const handleRetry = () => {
    setJobId(null);
    setAnswers({});
    setEstimate(null);
    setDiagnosisError(false);
    goTo(0);
  };

  const runDiagnosis = useCallback(() => {
    if (!jobId) return;
    setDiagnosisError(false);
    const minDelay = new Promise<void>((resolve) => setTimeout(resolve, MIN_LOADING_MS));
    Promise.all([fetchDiagnosis(jobId, answers), minDelay])
      .then(([result]) => {
        setEstimate(result);
        localStorage.setItem(RESULT_KEY, JSON.stringify({ jobId, estimate: result }));
        localStorage.setItem(ANSWERS_KEY, JSON.stringify(answers));
        trackEvent("quiz_complete", { job_type: jobId });
        goTo(totalQ + 2);
      })
      .catch(() => setDiagnosisError(true));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [jobId, answers]);

  useEffect(() => {
    if (jobId && step === totalQ + 1) runDiagnosis();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step, jobId]);

  const handleSearch = () => {
    if (!jobId) return;
    trackEvent("job_link_click", { job_type: jobId });
    navigate(`/jobs?jobId=${jobId}`);
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
    if (s === totalQ + 1) {
      return diagnosisError ? <LoadingError onRetry={runDiagnosis} /> : <LoadingPanel />;
    }
    if (s === totalQ + 2 && estimate) {
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
          キレキャリ
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
