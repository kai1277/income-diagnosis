import { useEffect, useState } from "react";
import { LOADING_LINES } from "@/features/diagnosis/constants/jobs";

export function LoadingPanel() {
  const [onFlags, setOnFlags] = useState<boolean[]>(() => LOADING_LINES.map(() => false));

  useEffect(() => {
    const lineTimers = LOADING_LINES.map((_, i) =>
      setTimeout(
        () => {
          setOnFlags((prev) => {
            const next = [...prev];
            next[i] = true;
            return next;
          });
        },
        260 + i * 430,
      ),
    );
    return () => {
      lineTimers.forEach(clearTimeout);
    };
  }, []);

  return (
    <>
      <div className="loading-ring">
        <svg viewBox="0 0 120 120">
          <defs>
            <linearGradient id="loadGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#E38B72" />
              <stop offset="100%" stopColor="#E4C388" />
            </linearGradient>
          </defs>
          <circle className="bg" cx="60" cy="60" r="52"></circle>
          <circle className="fg" cx="60" cy="60" r="52"></circle>
        </svg>
        <div className="icon">
          <svg width="34" height="34" viewBox="0 0 24 24" fill="none">
            <path d="M12 2v20M6 6l6 6-6 6M18 6l-6 6 6 6" stroke="#E4C388" strokeWidth="1.3" strokeLinecap="round" />
          </svg>
        </div>
      </div>
      <h3>診断結果を作成中</h3>
      <p>
        入力内容をもとに想定年収を
        <br />
        計算しています
      </p>
      <div className="loading-lines">
        {LOADING_LINES.map((text, i) => (
          <div key={text} className={`lline ${onFlags[i] ? "on" : ""}`}>
            <div className="dot"></div>
            <span>{text}</span>
          </div>
        ))}
      </div>
    </>
  );
}
