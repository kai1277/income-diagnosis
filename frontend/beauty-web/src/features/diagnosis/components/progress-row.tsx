interface Props {
  step: number;
  totalQ: number;
}

export function ProgressRow({ step, totalQ }: Props) {
  const visible = step >= 1 && step <= totalQ;
  return (
    <div className="progress-row" style={{ opacity: visible ? 1 : 0 }}>
      {visible &&
        Array.from({ length: totalQ }, (_, i) => i + 1).map((i) => (
          <div key={i} className={`swatch ${i < step ? "done" : i === step ? "active" : ""}`}>
            <i></i>
          </div>
        ))}
    </div>
  );
}
