export type QuizAnswers = Record<string, string>;

export type CharacterResult = {
  id: string;
  name: string;
  rank: "S" | "A" | "B";
  growthType: string;
  tagline: string;
  description: string;
  emoji: string;
  potentialIncome: number;
  incomeGap: number;
  currentIncomeBase: number;
  suggestedJobs: { title: string; reason: string }[];
  shareText: string;
};

const INCOME_BASE: Record<string, number> = {
  "〜300万": 270,
  "300〜400万": 350,
  "400〜500万": 450,
  "500〜600万": 520,
  "600〜800万": 680,
  "800万〜": 850,
};

const SCORE_MAP: Record<string, Record<string, number>> = {
  birthYear: {
    "1990年以前": 10,
    "1991〜1995年": 12,
    "1996〜2000年": 10,
    "2001年以降": 5,
  },
  education: {
    "高校": 0,
    "専門学校": 3,
    "短大": 3,
    "大学": 8,
    "大学院": 12,
  },
  schoolTier: {
    "旧帝大・早慶": 15,
    "MARCH・関関同立": 10,
    "日東駒専・産近甲龍": 6,
    "その他の大学": 3,
  },
  graduationYear: {
    "2024年以降": 2,
    "2020〜2023年": 5,
    "2016〜2019年": 10,
    "2011〜2015年": 12,
    "2010年以前": 14,
  },
  companyType: {
    "外資系大手": 20,
    "国内大手上場企業": 15,
    "中堅・ベンチャー上場": 10,
    "非上場ベンチャー": 8,
    "中小企業・その他": 4,
  },
  employmentType: {
    "正社員": 12,
    "契約社員": 5,
    "派遣社員": 3,
    "フリーランス": 10,
    "その他": 2,
  },
  industryLevel1: {
    "IT/インターネット/通信": 15,
    "金融/保険": 12,
    "コンサルティング": 12,
    "メーカー/製造業": 8,
    "商社/卸売": 8,
    "その他": 4,
  },
  industryLevel3: {
    "SaaS/クラウドサービス": 15,
    "フィンテック/ブロックチェーン": 12,
    "AI/機械学習": 12,
    "ECプラットフォーム": 8,
    "ゲーム/エンタメ": 6,
    "その他IT": 5,
  },
  companySize: {
    "10人未満": 3,
    "10〜49人": 5,
    "50〜299人": 7,
    "300〜999人": 10,
    "1000〜2999人": 12,
    "3000人以上": 14,
  },
  position: {
    "代表/役員": 20,
    "部長/マネージャー": 15,
    "課長/チームリーダー": 10,
    "主任/リーダー": 7,
    "役職なし": 3,
  },
  currentIncome: {
    "〜300万": 0,
    "300〜400万": 5,
    "400〜500万": 10,
    "500〜600万": 15,
    "600〜800万": 18,
    "800万〜": 20,
  },
  jobLevel1: {
    "営業": 12,
    "マーケティング/企画": 10,
    "ITエンジニア": 15,
    "コンサルタント": 15,
    "管理部門": 8,
    "その他": 5,
  },
  jobLevel3: {
    "法人営業（大手向け）": 15,
    "法人営業（中小向け）": 10,
    "個人営業": 6,
    "代理店営業": 8,
    "インサイドセールス": 8,
    "その他営業": 4,
    "バックエンドエンジニア": 12,
    "フロントエンドエンジニア": 10,
    "インフラ/SRE": 14,
    "機械学習/AI": 15,
    "その他エンジニア": 8,
    "企画/戦略": 12,
    "マーケティング": 10,
    "経営管理/財務": 10,
    "コンサルティング": 14,
    "その他": 5,
  },
  yearsOfExperience: {
    "1年未満": 0,
    "1〜2年": 3,
    "2〜4年": 6,
    "4年以上": 10,
  },
  customerSize: {
    "個人・小規模（〜50名）": 3,
    "中小企業（51〜300名）": 6,
    "中堅企業（301〜1000名）": 10,
    "大企業（1001〜5000名）": 13,
    "エンタープライズ（5000名〜）": 16,
  },
  achievementRate: {
    "60%未満": 0,
    "60〜80%": 5,
    "80〜100%": 10,
    "100〜120%": 15,
    "120%以上": 20,
  },
  rankInOrg: {
    "下位（60%以下）": 0,
    "中位（40〜60%）": 5,
    "上位（20〜40%）": 10,
    "上位（10〜20%）": 14,
    "トップ（10%以内）": 18,
  },
  salesProduct: {
    "クラウド/SaaS": 15,
    "人材/採用サービス": 10,
    "広告/マーケティング": 8,
    "物流/インフラ": 6,
    "その他": 4,
  },
  productPrice: {
    "10万円未満": 0,
    "10〜100万": 5,
    "100万〜1000万": 12,
    "1000万〜1億": 18,
    "1億以上": 24,
  },
  managementYears: {
    "なし": 0,
    "1年未満": 3,
    "1〜2年": 6,
    "2年以上": 12,
  },
  englishLevel: {
    "なし/初級": 0,
    "日常会話レベル": 5,
    "ビジネス会話レベル": 10,
    "ネイティブ/流暢": 15,
  },
};

const MAX_SCORES: Record<string, number> = {
  birthYear: 12,
  education: 12,
  schoolTier: 15,
  graduationYear: 14,
  companyType: 20,
  employmentType: 12,
  industryLevel1: 15,
  industryLevel3: 15,
  companySize: 14,
  position: 20,
  currentIncome: 20,
  jobLevel1: 15,
  jobLevel3: 15,
  yearsOfExperience: 10,
  customerSize: 16,
  achievementRate: 20,
  rankInOrg: 18,
  salesProduct: 15,
  productPrice: 24,
  managementYears: 12,
  englishLevel: 15,
};

type TierDef = {
  id: string;
  name: string;
  emoji: string;
  rank: "S" | "A" | "B";
  growthType: string;
  tagline: string;
  description: string;
  suggestedJobs: { title: string; reason: string }[];
};

const TIERS: TierDef[] = [
  {
    id: "high_potential",
    name: "ハイポテンシャル層",
    emoji: "🚀",
    rank: "S",
    growthType: "市場トップクラス型",
    tagline: "あなたの経験は、市場の上位数%が持つ希少価値です",
    description:
      "IT/SaaS・大手企業・エンタープライズ営業・高単価商材などの組み合わせが市場価値を大きく高めています。今の年収は実力の7〜8割しか反映されていない可能性があります。",
    suggestedJobs: [
      { title: "SaaS系営業マネージャー", reason: "インセンティブ+チームマネジメントで年収1000万超が現実的" },
      { title: "外資系セールス", reason: "OTEベースで高収入。経験が直接評価される" },
      { title: "M&Aアドバイザー", reason: "1件の成果で数百万のインセンティブも" },
    ],
  },
  {
    id: "mid_senior",
    name: "即戦力ミドル層",
    emoji: "💼",
    rank: "A",
    growthType: "30代ジャンプ型",
    tagline: "今の経験を正しく評価してくれる会社に移るだけで、年収は変わります",
    description:
      "現職での実績・業界知識・商材経験が市場で評価される水準に達しています。職場環境や評価制度を変えることで、年収が一段階上がる可能性が高いです。",
    suggestedJobs: [
      { title: "IT系法人営業", reason: "インセンティブ制度が整っており、成果に直結" },
      { title: "SaaS系カスタマーサクセス", reason: "顧客折衝経験が即戦力として評価される" },
      { title: "ベンチャー営業リーダー", reason: "マネジメント経験を活かして早期昇格が狙える" },
    ],
  },
  {
    id: "standard",
    name: "標準的キャリア層",
    emoji: "📈",
    rank: "B",
    growthType: "着実成長型",
    tagline: "スキルの掛け合わせ次第で、次の水準へ上がれます",
    description:
      "現年収と近い水準で安定していますが、特定のスキルや業界知識を深めることで上振れ余地があります。転職よりもスキルアップが先の可能性もあります。",
    suggestedJobs: [
      { title: "業界特化型営業・コンサル", reason: "専門性を深めることで市場価値が上がる" },
      { title: "マーケター/事業企画", reason: "営業経験×マーケの組み合わせで需要が高い" },
      { title: "中堅IT企業の法人営業", reason: "業界知識を活かした転職で年収アップ" },
    ],
  },
  {
    id: "growth",
    name: "成長余地あり層",
    emoji: "🌱",
    rank: "B",
    growthType: "経験積み上げ型",
    tagline: "今は仕込み時期。3年後のあなたは全然違います",
    description:
      "経験年数や成果指標はまだ途中段階ですが、伸びしろが大きい時期です。スキル習得・業界変更・成果実績の積み上げで、年収が大きく変わってきます。",
    suggestedJobs: [
      { title: "SaaS系インサイドセールス", reason: "未経験でも採用している企業が多く、成長できる環境" },
      { title: "成長産業の若手営業", reason: "年功序列より成果評価の会社でスタート" },
      { title: "IT業界の法人営業", reason: "業界知識を身につけながら年収アップを狙える" },
    ],
  },
  {
    id: "redesign",
    name: "キャリア再設計層",
    emoji: "🔄",
    rank: "B",
    growthType: "方向転換型",
    tagline: "今の方向性を少し変えるだけで、大きく変わる可能性があります",
    description:
      "職種・業界・雇用形態の組み合わせを見直すことで、収入アップのルートが開けます。現状の延長線よりも、一度立ち止まってキャリアを整理することが先決です。",
    suggestedJobs: [
      { title: "未経験OKの法人営業", reason: "まず業界を変えることで年収の底上げを狙う" },
      { title: "資格取得系専門職", reason: "国家資格取得で収入が安定的に上がるパスがある" },
      { title: "フリーランス・副業", reason: "副収入を積み上げてキャリアの幅を広げる" },
    ],
  },
];

function computeMaxScore(answers: QuizAnswers): number {
  let max =
    MAX_SCORES.birthYear +
    MAX_SCORES.education +
    MAX_SCORES.graduationYear +
    MAX_SCORES.companyType +
    MAX_SCORES.employmentType +
    MAX_SCORES.industryLevel1 +
    MAX_SCORES.companySize +
    MAX_SCORES.position +
    MAX_SCORES.currentIncome +
    MAX_SCORES.jobLevel1 +
    MAX_SCORES.jobLevel3 +
    MAX_SCORES.yearsOfExperience +
    MAX_SCORES.managementYears +
    MAX_SCORES.englishLevel;

  if (answers.education === "大学" || answers.education === "大学院") {
    max += MAX_SCORES.schoolTier;
  }
  if (answers.industryLevel1 === "IT/インターネット/通信") {
    max += MAX_SCORES.industryLevel3;
  }
  if (answers.jobLevel1 === "営業") {
    max +=
      MAX_SCORES.customerSize +
      MAX_SCORES.achievementRate +
      MAX_SCORES.rankInOrg +
      MAX_SCORES.salesProduct +
      MAX_SCORES.productPrice;
  }

  return max;
}

function computeScore(answers: QuizAnswers): number {
  let score = 0;
  for (const [key, value] of Object.entries(answers)) {
    score += SCORE_MAP[key]?.[value] ?? 0;
  }
  return score;
}

function getTier(potentialIncome: number): TierDef {
  if (potentialIncome >= 800) return TIERS[0];
  if (potentialIncome >= 650) return TIERS[1];
  if (potentialIncome >= 500) return TIERS[2];
  if (potentialIncome >= 400) return TIERS[3];
  return TIERS[4];
}

export function diagnose(answers: QuizAnswers): CharacterResult {
  const base = INCOME_BASE[answers.currentIncome] ?? 350;
  const score = computeScore(answers);
  const maxScore = computeMaxScore(answers);
  const normalizedScore = maxScore > 0 ? score / maxScore : 0;
  // Calibrated so observed answers (score=222, maxScore=329, base=520) → 705万
  const multiplier = 0.85 + normalizedScore * 0.749;
  const potentialIncome = Math.round((base * multiplier) / 5) * 5;
  const incomeGap = potentialIncome - base;
  const tier = getTier(potentialIncome);

  const shareText = `診断結果：「${tier.name}」\n市場価値ランク ${tier.rank} ｜ ${tier.growthType}\n\n"${tier.tagline}"\n\n#市場価値診断 #キャリア`;

  return {
    ...tier,
    potentialIncome,
    incomeGap,
    currentIncomeBase: base,
    shareText,
  };
}
