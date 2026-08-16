import { useState } from "react";
import { ArrowRightIcon, CheckIcon } from "@/features/diagnosis/components/icons";
import type {
  AnswerValue,
  Answers,
  ExperienceAnswer,
  MultiQuestion,
  Option,
  Question,
  SingleQuestion,
  SliderQuestion,
} from "@/features/diagnosis/types";

interface Props {
  question: Question;
  index: number;
  totalQ: number;
  answers: Answers;
  onAnswer: (key: string, value: AnswerValue) => void;
  onNext: () => void;
}

function QuestionHeader({ index, totalQ, question }: { index: number; totalQ: number; question: Question }) {
  return (
    <>
      <div className="q-eyebrow">
        <span className="num">Q{index + 1}</span>
        <span>
          / 0{totalQ}　{question.eyebrow}
        </span>
      </div>
      <div className="q-title">{question.title}</div>
      <div className="q-sub">{question.sub}</div>
    </>
  );
}

function SingleQuestionPanel({ question, index, totalQ, answers, onAnswer, onNext }: Props & { question: SingleQuestion }) {
  const selected = answers[question.key] as Option | undefined;

  const handleSelect = (opt: Option) => {
    if (selected?.v === opt.v) return;
    onAnswer(question.key, opt);
    setTimeout(onNext, 320);
  };

  return (
    <>
      <QuestionHeader index={index} totalQ={totalQ} question={question} />
      <div className="options">
        {question.options.map((o) => (
          <div
            key={o.v}
            className={`option ${question.tickShape === "square" ? "tick-sq" : ""} ${selected?.v === o.v ? "selected" : ""}`}
            onClick={() => handleSelect(o)}
          >
            <div className="tick">
              <CheckIcon />
            </div>
            <div>
              <div className="label">{o.label}</div>
              {o.desc ? <div className="desc">{o.desc}</div> : null}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

function SliderQuestionPanel({ question, index, totalQ, answers, onAnswer, onNext }: Props & { question: SliderQuestion }) {
  const initial = (answers[question.key] as ExperienceAnswer | undefined)?.years ?? question.def;
  const [value, setValue] = useState(initial);
  const display = value >= question.max ? `${question.max}+` : value;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = Number(e.target.value);
    setValue(v);
    onAnswer(question.key, { years: v });
  };

  const handleNext = () => {
    onAnswer(question.key, { years: value });
    onNext();
  };

  return (
    <>
      <QuestionHeader index={index} totalQ={totalQ} question={question} />
      <div className="slider-card">
        <div className="slider-value">
          <span>{display}</span>
          <small>年</small>
        </div>
        <input
          type="range"
          className="range-input"
          min={question.min}
          max={question.max}
          step={1}
          value={value}
          onChange={handleChange}
        />
        <div className="slider-labels">
          <span>0年</span>
          <span>{question.maxLabel}</span>
        </div>
      </div>
      <div className="hint-box">
        <div className="hi">
          <b>POINT</b>　経験年数はスキル習熟度の目安として、基本給に反映されます。
        </div>
      </div>
      <div className="spacer"></div>
      <button className="btn-primary" onClick={handleNext}>
        次へ
        <ArrowRightIcon />
      </button>
    </>
  );
}

function MultiQuestionPanel({ question, index, totalQ, answers, onAnswer, onNext }: Props & { question: MultiQuestion }) {
  const selected = (answers[question.key] as Option[] | undefined) ?? [];
  const selectedVs = new Set(selected.map((o) => o.v));

  const toggle = (opt: Option) => {
    const isSelected = selectedVs.has(opt.v);
    if (!isSelected && selected.length >= question.max) return;
    const next = isSelected ? selected.filter((o) => o.v !== opt.v) : [...selected, opt];
    onAnswer(question.key, next);
  };

  return (
    <>
      <QuestionHeader index={index} totalQ={totalQ} question={question} />
      <div className="options">
        {question.options.map((o) => (
          <div key={o.v} className={`option tick-sq ${selectedVs.has(o.v) ? "selected" : ""}`} onClick={() => toggle(o)}>
            <div className="tick">
              <CheckIcon />
            </div>
            <div>
              <div className="label">{o.label}</div>
              {o.desc ? <div className="desc">{o.desc}</div> : null}
            </div>
          </div>
        ))}
      </div>
      <div className="spacer"></div>
      <button className="btn-primary" onClick={onNext}>
        次へ
        <ArrowRightIcon />
      </button>
    </>
  );
}

export function QuestionPanel(props: Props) {
  if (props.question.type === "single") return <SingleQuestionPanel {...props} question={props.question} />;
  if (props.question.type === "slider") return <SliderQuestionPanel {...props} question={props.question} />;
  return <MultiQuestionPanel {...props} question={props.question} />;
}
