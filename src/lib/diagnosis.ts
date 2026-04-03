export type QuizAnswers = {
  ageRange: string;
  jobCategory: string;
  currentIncome: string;
  workStyle: string;
  manualWork: string;
};

type DiagnosisResult = {
  potentialIncome: number;
  currentIncomeBase: number;
  suggestedJobs: { title: string; reason: string }[];
  incomeGap: number;
};

const INCOME_BASE: Record<string, number> = {
  "〜300万": 280,
  "300〜400万": 350,
  "400〜500万": 450,
  "500万〜": 520,
};

export function diagnose(answers: QuizAnswers): DiagnosisResult {
  const base = INCOME_BASE[answers.currentIncome] ?? 350;

  const isBlueCollar =
    answers.manualWork === "全然ない" && answers.workStyle === "成果・稼ぎ重視";

  let multiplier: number;
  let suggestedJobs: { title: string; reason: string }[];

  if (isBlueCollar) {
    multiplier = 1.4 + Math.random() * 0.1;
    suggestedJobs = [
      { title: "配管工・設備施工", reason: "職人技が高単価につながる専門職" },
      { title: "建設系現場監督", reason: "経験が直接収入に反映される成果型" },
      { title: "ラーメン店独立経営", reason: "成果報酬型で上限なし・努力直結" },
    ];
  } else if (answers.workStyle === "成果・稼ぎ重視") {
    multiplier = 1.25 + Math.random() * 0.1;
    suggestedJobs = [
      { title: "法人営業（IT・SaaS）", reason: "インセンティブで年収が大きく伸びる" },
      { title: "フリーランスエンジニア", reason: "スキル次第で単価2〜3倍も可能" },
      { title: "不動産営業", reason: "成果報酬型・高還元率の業界" },
    ];
  } else {
    multiplier = 1.1 + Math.random() * 0.1;
    suggestedJobs = [
      { title: "公務員・準公務員", reason: "安定した昇給体系で長期的に安心" },
      { title: "大手事務職（正社員）", reason: "福利厚生含めた実質年収が高い" },
      { title: "医療事務・調剤薬局", reason: "資格取得で安定収入アップが見込める" },
    ];
  }

  if (answers.ageRange === "20代前半") multiplier += 0.05;
  if (answers.ageRange === "30代") multiplier -= 0.03;

  const potentialIncome = Math.round((base * multiplier) / 10) * 10;
  const incomeGap = potentialIncome - base;

  return { potentialIncome, currentIncomeBase: base, suggestedJobs, incomeGap };
}
