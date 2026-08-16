export type JobId = 'hair' | 'nail' | 'lash' | 'esthe';

export interface BeautyDiagnosisAnswers {
  position: string;
  experience: number;
  sales: string;
  area: string;
  style: string;
  cert?: string;
  strengths?: string[];
}

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
