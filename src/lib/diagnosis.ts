export type QuizAnswers = {
  ageRange: string;
  jobCategory: string;
  currentIncome: string;
  workStyle: string;
  manualWork: string;
};

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
  "〜300万": 280,
  "300〜400万": 350,
  "400〜500万": 450,
  "500万〜": 550,
};

type CharacterDef = Omit<CharacterResult, "potentialIncome" | "incomeGap" | "currentIncomeBase" | "shareText"> & {
  multiplier: number;
};

const CHARACTERS: Record<string, CharacterDef> = {
  craft_ace_young: {
    id: "craft_ace_young",
    name: "未覚醒の職人エース",
    rank: "S",
    growthType: "20代仕込み・30代爆発型",
    tagline: "今仕込んでいる、10年後の自分がヤバい",
    description:
      "手を動かすことをいとわず、成果にこだわるあなた。今は磨き段階ですが、職人技を身につけた先には年収1000万超えのルートが普通に見えています。若さと向上心が最大の武器。",
    emoji: "⚡",
    multiplier: 1.5,
    suggestedJobs: [
      { title: "配管工・設備施工", reason: "資格取得で単価が急上昇する職人職" },
      { title: "電気工事士", reason: "需要>供給で慢性的に高単価が続く" },
      { title: "建設現場監督", reason: "経験値が収入に直結するキャリアパス" },
    ],
  },
  craft_ace: {
    id: "craft_ace",
    name: "職人型フリーエージェント",
    rank: "A",
    growthType: "独立で化ける型",
    tagline: "手を動かすほど、あなたの市場価値は跳ね上がる",
    description:
      "現場系の適性と稼ぎへの意欲が重なるレアタイプ。独立・フリーランス化で年収が一気に1.5〜2倍になるルートが現実的。今の給与は実力の半分しか反映されていません。",
    emoji: "🔧",
    multiplier: 1.4,
    suggestedJobs: [
      { title: "配管工・設備施工（独立）", reason: "職人技が高単価に直結する専門職" },
      { title: "建設系現場監督", reason: "経験が収入に直接反映される成果型" },
      { title: "リフォーム職人（フリー）", reason: "独立後の案件単価が大きく跳ね上がる" },
    ],
  },
  tech_free_agent: {
    id: "tech_free_agent",
    name: "スキル型フリーエージェント",
    rank: "S",
    growthType: "スキルで3倍化ける型",
    tagline: "あなたのスキルは、会社の外でこそ輝く",
    description:
      "IT×成果志向の組み合わせは、フリーランス市場で最も需要が高いタイプ。今の会社の給与を基準にしてはいけません。市場単価はあなたの想像をはるかに超えています。",
    emoji: "🚀",
    multiplier: 1.45,
    suggestedJobs: [
      { title: "フリーランスエンジニア", reason: "スキル次第で月単価100万超も現実的" },
      { title: "スタートアップ技術顧問", reason: "副業・複業で年収を積み上げる選択肢" },
      { title: "SaaSセールスエンジニア", reason: "技術+営業の組み合わせでインセンティブ大" },
    ],
  },
  hunter: {
    id: "hunter",
    name: "成果型ハンター",
    rank: "A",
    growthType: "30代ジャンプ型",
    tagline: "ノルマのためじゃなく、報酬のために動く人間",
    description:
      "稼ぎへの意欲が高く、成果報酬型の環境で本領発揮するタイプ。業界・職種を変えることで収入が一気に跳ね上がる可能性を持っています。今の環境が実力を封じているかもしれません。",
    emoji: "💥",
    multiplier: 1.3,
    suggestedJobs: [
      { title: "法人営業（IT・SaaS）", reason: "インセンティブで年収が大きく伸びる" },
      { title: "不動産仲介・投資営業", reason: "成果報酬率が高く努力が収入に直結" },
      { title: "M&Aアドバイザー", reason: "1件の成果で数百万のインセンティブも" },
    ],
  },
  digital_craftsman: {
    id: "digital_craftsman",
    name: "着実デジタル職人",
    rank: "B",
    growthType: "スキル積み上げ型",
    tagline: "3年後、あなたの専門性はもっと希少になる",
    description:
      "安定を重視しながら技術を磨くタイプ。IT市場の需要は今後も拡大が見込まれ、専門性を深めることで着実に年収水準が上がっていきます。焦らず深く掘るのが正解。",
    emoji: "💻",
    multiplier: 1.2,
    suggestedJobs: [
      { title: "SREエンジニア", reason: "インフラ×開発の専門職で需要急増中" },
      { title: "データアナリスト", reason: "データ活用の専門家として市場価値が高い" },
      { title: "クラウドアーキテクト", reason: "資格+経験で年収800万台も現実的" },
    ],
  },
  steady_base: {
    id: "steady_base",
    name: "信頼の縁の下タイプ",
    rank: "B",
    growthType: "堅実成長型",
    tagline: "継続力と信頼感は、実は希少なスキルです",
    description:
      "安定志向で堅実に積み上げるタイプ。長期的な信頼と継続で実質的な安心収入を築けます。今の環境を少し変えるだけで収入アップが見込めるケースも多いです。",
    emoji: "🌱",
    multiplier: 1.1,
    suggestedJobs: [
      { title: "大手事務職（正社員）", reason: "福利厚生込みの実質年収が意外と高い" },
      { title: "公務員・準公務員", reason: "安定した昇給体系で長期的に安心" },
      { title: "医療事務・調剤薬局", reason: "資格取得で安定した収入アップが見込める" },
    ],
  },
};

export function diagnose(answers: QuizAnswers): CharacterResult {
  const base = INCOME_BASE[answers.currentIncome] ?? 350;
  const isManual = answers.manualWork === "全然ない";
  const isEarningFocused = answers.workStyle === "成果・稼ぎ重視";
  const isIT = answers.jobCategory === "IT";
  const isYoung = answers.ageRange === "20代前半" || answers.ageRange === "20代後半";

  let charKey: string;
  if (isManual && isEarningFocused && isYoung) {
    charKey = "craft_ace_young";
  } else if (isManual && isEarningFocused) {
    charKey = "craft_ace";
  } else if (isEarningFocused && isIT) {
    charKey = "tech_free_agent";
  } else if (isEarningFocused) {
    charKey = "hunter";
  } else if (isIT) {
    charKey = "digital_craftsman";
  } else {
    charKey = "steady_base";
  }

  const char = CHARACTERS[charKey];
  let multiplier = char.multiplier + Math.random() * 0.08;
  if (answers.ageRange === "20代前半") multiplier += 0.05;
  if (answers.ageRange === "40代以上") multiplier -= 0.05;

  const potentialIncome = Math.round((base * multiplier) / 10) * 10;
  const incomeGap = potentialIncome - base;

  const shareText = `診断結果：「${char.name}」\n市場価値ランク ${char.rank} ｜ ${char.growthType}\n\n"${char.tagline}"\n\n#市場価値診断 #キャリア`;

  return {
    ...char,
    potentialIncome,
    incomeGap,
    currentIncomeBase: base,
    shareText,
  };
}
