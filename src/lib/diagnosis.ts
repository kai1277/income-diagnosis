export type QuizAnswers = {
  mondayFeeling: string;
  ageRange: string;
  jobCategory: string;
  currentIncome: string;
  workStyle: string;
  manualWork: string;
  futureGoal: string;
};

export type CharacterResult = {
  id: string;
  name: string;
  rank: "S" | "A" | "B";
  rankColor: string;
  growthType: string;
  catchphrase: string;
  description: string;
  badgeLines: string[];
  emoji: string;
  potentialIncome: number;
  incomeGap: number;
  currentIncomeBase: number;
  suggestedJobs: { title: string; reason: string }[];
  shareText: string;
};

const INCOME_BASE: Record<string, number> = {
  "〜300万（ちょっと厳しい）": 280,
  "300〜400万（まあまあ）": 350,
  "400〜500万（それなりに）": 450,
  "500万〜（がんばってる方）": 550,
};

// Personalized opening line based on monday feeling
const OPENING: Record<string, string> = {
  "よし、稼いでやるか": "エンジンは始動しています。あとは正しい方向に走るだけ。",
  "まあ、いつも通り": "「まあまあ」の裏側に、眠ったままの可能性がたまっています。",
  "あと5回くらい寝たい": "月曜が憂鬱なのは、今の環境とのミスマッチのサインかもしれません。",
  "もう限界かも": "その感覚、あながち間違っていません。動くなら早い方がいい。",
};

// Additional closing line based on future goal
const CLOSING: Record<string, string> = {
  "年収アップ": "求人を見るなら、年収条件を最優先フィルターに。",
  "ワークライフバランス": "リモート・フレックス対応の求人は今かなり増えています。",
  "成長できる環境": "スタートアップや成長企業への転職が向いているタイプです。",
  "人間関係・雰囲気": "転職会議やOpenWorkで社員口コミを必ず確認してください。",
};

type BaseCharacter = Omit<CharacterResult, "potentialIncome" | "incomeGap" | "currentIncomeBase" | "shareText" | "description"> & {
  multiplier: number;
  baseDescription: string;
};

const CHARACTERS: Record<string, BaseCharacter> = {
  craft_ace_young: {
    id: "craft_ace_young",
    name: "未覚醒の職人王",
    rank: "S",
    rankColor: "from-amber-400 to-yellow-500",
    growthType: "20代仕込み・30代爆発型",
    catchphrase: "その手先の才能、まだ誰も気づいてない",
    baseDescription:
      "手を動かすことに抵抗がなく、稼ぎへの欲も本物のあなた。この組み合わせ、正直かなりレアです。同世代の9割が「とりあえず事務系」を選ぶ中で、あなたには職人×稼ぎというニッチがあります。そして今の日本、現場系は人手不足で単価が爆上がり中。5年後、同期との年収差が100万を超えても不思議じゃありません。",
    badgeLines: ["職人×稼ぎ志向の希少タイプ", "若さが最大の武器"],
    emoji: "⚡",
    multiplier: 1.5,
    suggestedJobs: [
      { title: "配管工・設備施工", reason: "資格×技術で単価が急上昇。独立すれば青天井" },
      { title: "電気工事士", reason: "国家資格で守られた需要。手に職の代表格" },
      { title: "建設現場監督", reason: "20代から始めれば10年後は管理職年収も視野" },
    ],
  },
  craft_ace: {
    id: "craft_ace",
    name: "独立で化ける職人型",
    rank: "A",
    rankColor: "from-violet-400 to-purple-600",
    growthType: "独立×フリーで年収2倍型",
    catchphrase: "正社員の給与は、あなたの実力の半分です",
    baseDescription:
      "現場仕事への抵抗がなく、稼ぎへの意欲も本物。そのスペックで正社員に縛られているのはもったいない。職人系フリーランスの案件単価は、同業の会社員の1.5〜2倍が相場です。腕一本で仕事を取れる環境に移ったとき、あなたの収入は一気に変わります。",
    badgeLines: ["フリーランス移行で年収2倍ルート", "独立適性あり"],
    emoji: "🔧",
    multiplier: 1.4,
    suggestedJobs: [
      { title: "配管工・設備（独立）", reason: "フリー化で案件単価が会社員の1.5〜2倍に" },
      { title: "建設系現場監督", reason: "経験が収入に直結。年功より実力が効く" },
      { title: "リフォーム職人（独立）", reason: "顧客を持てば収入の天井がなくなる" },
    ],
  },
  tech_free_agent: {
    id: "tech_free_agent",
    name: "フリーランス覚醒前夜",
    rank: "S",
    rankColor: "from-cyan-400 to-blue-600",
    growthType: "スキルで市場価値3倍型",
    catchphrase: "転職市場でのあなたの値段、知ってますか？",
    baseDescription:
      "正直に言います。今の給与は市場価値の6〜7割程度です。ITエンジニアのフリーランス単価は会社員の1.5〜2倍が当たり前。稼ぎへの意欲もあるなら「なぜまだ会社員なのか」という話になってきます。会社の論理に縛られている間に、同期は市場で自由に値段をつけています。",
    badgeLines: ["フリーランス市場で引く手あまた", "今の給与は実力の6〜7割"],
    emoji: "🚀",
    multiplier: 1.45,
    suggestedJobs: [
      { title: "フリーランスエンジニア", reason: "月単価60〜100万は現実的。スキル次第で青天井" },
      { title: "スタートアップCTO候補", reason: "技術責任者として高待遇で迎えられるポジション" },
      { title: "SaaSセールスエンジニア", reason: "技術×営業の組み合わせでインセンティブが大きい" },
    ],
  },
  hunter: {
    id: "hunter",
    name: "稼ぎ本能全開型",
    rank: "A",
    rankColor: "from-orange-400 to-red-600",
    growthType: "環境を変えれば30代で爆発型",
    catchphrase: "今の環境は、あなたの半分しか引き出せてない",
    baseDescription:
      "稼ぎへの本気度は本物です。問題は今の環境がそれを活かせていないこと。成果報酬型の業界に移るだけで年収が1.3〜1.5倍になるケースは珍しくありません。会議室で「なんでこんな給料なんだろ」と思ったことがあるなら、それは正しい直感です。",
    badgeLines: ["成果報酬型で本領発揮するタイプ", "環境次第で年収+100万は現実的"],
    emoji: "💥",
    multiplier: 1.3,
    suggestedJobs: [
      { title: "法人営業（IT・SaaS）", reason: "インセンティブ制度が整っており努力が収入に直結" },
      { title: "不動産仲介・投資営業", reason: "成果報酬率が高く、稼ぎ本能が活きる業界" },
      { title: "M&Aアドバイザー", reason: "1件の成果で数百万のインセンティブも普通にある" },
    ],
  },
  digital_craftsman: {
    id: "digital_craftsman",
    name: "技術の静かな積み人",
    rank: "B",
    rankColor: "from-teal-400 to-green-600",
    growthType: "3年後に希少スキルで勝つ型",
    catchphrase: "焦らず深く掘るタイプが、最終的に強い",
    baseDescription:
      "地道にスキルを積み上げるタイプ。派手ではないけれど、実はこれが一番長期で強い。IT系の専門知識は今後も希少性が増すばかりで、3〜5年後のあなたの市場価値は今よりずっと高くなります。転職しなくても、市場価値を把握しておくだけで社内での交渉力が変わります。",
    badgeLines: ["専門性が年収に変わるタイプ", "転職しなくても市場価値は上がる"],
    emoji: "💻",
    multiplier: 1.2,
    suggestedJobs: [
      { title: "SREエンジニア", reason: "インフラ×開発の専門職。需要が急増中で単価も上昇" },
      { title: "データアナリスト", reason: "データドリブン経営の波に乗れる希少人材" },
      { title: "クラウドアーキテクト", reason: "AWS/GCP資格+経験で年収800万台も現実的" },
    ],
  },
  steady_base: {
    id: "steady_base",
    name: "堅実の隠れ強者",
    rank: "B",
    rankColor: "from-slate-400 to-zinc-600",
    growthType: "継続力で着実に積み上げる型",
    catchphrase: "安定を選ぶのは弱さじゃない、戦略だ",
    baseDescription:
      "安定を選ぶ判断力は、実はかなりの強みです。継続力と信頼感は、企業が最も手放したくないスキルセット。派手な転職より確実に積み上がる収入構造を選ぶあなたは、長期では賢い選択をしています。ただし、今の職場があなたの価値を適切に評価しているかは、一度確認する価値があります。",
    badgeLines: ["継続力×信頼感は希少スキル", "環境を変えるだけで収入アップも"],
    emoji: "🌱",
    multiplier: 1.1,
    suggestedJobs: [
      { title: "大手事務職（正社員）", reason: "福利厚生込みの実質年収は想像より高い" },
      { title: "公務員・準公務員", reason: "安定した昇給体系。30〜40年で見ると強い選択肢" },
      { title: "医療事務・調剤薬局", reason: "資格取得で安定した収入アップが確実に見込める" },
    ],
  },
};

export function diagnose(answers: QuizAnswers): CharacterResult {
  const base = INCOME_BASE[answers.currentIncome] ?? 350;

  // Normalize answers from new fun format
  const isEarningFocused =
    answers.workStyle === "死ぬほど稼ぎたい" ||
    answers.workStyle === "稼ぎつつ自由も欲しい" ||
    answers.workStyle === "成果・稼ぎ重視";

  const isManual =
    answers.manualWork === "好きだし苦じゃない" ||
    answers.manualWork === "全然ない";

  const isIT =
    answers.jobCategory === "IT・テック系" ||
    answers.jobCategory === "IT";

  const isYoung =
    answers.ageRange === "20代前半" ||
    answers.ageRange === "20代後半";

  // Character selection
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

  const opening = OPENING[answers.mondayFeeling] ?? "";
  const closing = CLOSING[answers.futureGoal] ?? "";
  const description = [opening, char.baseDescription, closing].filter(Boolean).join(" ");

  const shareText = [
    `【診断結果】「${char.name}」${char.emoji}`,
    `市場価値ランク ${char.rank} ｜ ${char.growthType}`,
    "",
    `"${char.catchphrase}"`,
    "",
    `潜在年収：+${incomeGap}万円の伸びしろあり`,
    "",
    "あなたも診断してみて👇",
    "#市場価値診断 #キャリア",
  ].join("\n");

  return {
    ...char,
    description,
    potentialIncome,
    incomeGap,
    currentIncomeBase: base,
    shareText,
  };
}
