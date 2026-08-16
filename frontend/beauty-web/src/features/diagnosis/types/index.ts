export type JobId = "hair" | "nail" | "lash" | "esthe";

export interface Option {
  v: string;
  label: string;
  desc?: string;
}

interface QuestionBase {
  key: string;
  eyebrow: string;
  title: string;
  sub: string;
}

export interface SingleQuestion extends QuestionBase {
  type: "single";
  tickShape: "circle" | "square";
  options: Option[];
}

export interface SliderQuestion extends QuestionBase {
  type: "slider";
  min: number;
  max: number;
  def: number;
  maxLabel: string;
}

export interface MultiQuestion extends QuestionBase {
  type: "multi";
  tickShape: "circle" | "square";
  max: number;
  options: Option[];
}

export type Question = SingleQuestion | SliderQuestion | MultiQuestion;

export interface ExperienceAnswer {
  years: number;
}

export type AnswerValue = Option | Option[] | ExperienceAnswer;

export type Answers = Record<string, AnswerValue | undefined>;

export interface BreakdownRow {
  label: string;
  text: string;
}

export interface Estimate {
  center: number;
  low: number;
  high: number;
  pct: number;
  breakdown: BreakdownRow[];
}

export interface Job {
  id: JobId;
  label: string;
  tagline: string;
  resultName: string;
  questions: Question[];
}
