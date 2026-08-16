export type JobId = "hair" | "nail" | "lash" | "esthe";

export interface AreaOption {
  v: string;
  label: string;
  desc?: string;
  mult: number;
}

export interface PositionOption {
  v: string;
  label: string;
  desc: string;
  base: number;
}

export interface SalesOption {
  v: string;
  label: string;
  desc: string;
  mid: number;
}

export interface CertOption {
  v: string;
  label: string;
  desc: string;
  bonus: number;
}

export interface StyleOption {
  v: string;
  label: string;
  desc: string;
  mode: "fixed" | "hybrid" | "commission";
  rate?: number;
}

export interface StrengthOption {
  v: string;
  label: string;
  desc: string;
  bonus: number;
}

export type SingleOptionValue = AreaOption | PositionOption | SalesOption | CertOption | StyleOption;

interface QuestionBase {
  key: string;
  eyebrow: string;
  title: string;
  sub: string;
}

export interface SingleQuestion extends QuestionBase {
  type: "single";
  tickShape: "circle" | "square";
  options: SingleOptionValue[];
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
  options: StrengthOption[];
}

export type Question = SingleQuestion | SliderQuestion | MultiQuestion;

export interface ExperienceAnswer {
  years: number;
}

export type AnswerValue = SingleOptionValue | StrengthOption[] | ExperienceAnswer;

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
  calc: (answers: Answers) => Estimate;
}
