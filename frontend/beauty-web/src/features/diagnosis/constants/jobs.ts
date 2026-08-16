import type {
  AreaOption,
  Answers,
  CertOption,
  Estimate,
  ExperienceAnswer,
  Job,
  JobId,
  PositionOption,
  SalesOption,
  StrengthOption,
  StyleOption,
} from "@/features/diagnosis/types";

export const AREAS: AreaOption[] = [
  { v: "a1", label: "東京23区（渋谷・表参道 等）", mult: 1.2 },
  { v: "a2", label: "首都圏・大阪・名古屋 等の主要都市", mult: 1.08 },
  { v: "a3", label: "地方の中核都市", mult: 1.0 },
  { v: "a4", label: "郊外・地方エリア", mult: 0.92 },
];

const STYLE_QUESTION_META = {
  eyebrow: "働き方の希望は？",
  title: "希望する給与体系は？",
  sub: "給与体系によって想定年収の算出方法が変わります",
} as const;

const AREA_QUESTION_META = {
  eyebrow: "希望の勤務エリアは？",
  title: "転職先として希望するエリアは？",
  sub: "給与相場はエリアによって変動します",
} as const;

function pos(a: Answers): PositionOption {
  return a.position as PositionOption;
}
function years(a: Answers): number {
  return (a.experience as ExperienceAnswer).years;
}
function sales(a: Answers): SalesOption {
  return a.sales as SalesOption;
}
function area(a: Answers): AreaOption {
  return a.area as AreaOption;
}
function style(a: Answers): StyleOption {
  return a.style as StyleOption;
}
function cert(a: Answers): CertOption {
  return a.cert as CertOption;
}
function strengths(a: Answers): StrengthOption[] {
  return (a.strengths as StrengthOption[]) ?? [];
}

function withAreaAdjustment(subtotal: number, a: Answers, breakdown: { label: string; text: string }[]) {
  const ar = area(a);
  const adjusted = subtotal * ar.mult;
  const areaDelta = Math.round(adjusted - subtotal);
  breakdown.push({
    label: `エリア相場による調整（×${ar.mult.toFixed(2)}）`,
    text: `${areaDelta >= 0 ? "+" : ""}${areaDelta}万円`,
  });
  return adjusted;
}

function rangeFromCenter(center: number, volatile: boolean) {
  const low = Math.round((center * (volatile ? 0.8 : 0.92)) / 10) * 10;
  const high = Math.round((center * (volatile ? 1.25 : 1.1)) / 10) * 10;
  return { low, high };
}

export const JOBS: Record<JobId, Job> = {
  /* ============ 美容師 ============ */
  hair: {
    id: "hair",
    label: "美容師",
    tagline: "カット・カラー担当",
    resultName: "あなたの想定年収診断結果",
    questions: [
      {
        key: "position",
        type: "single",
        tickShape: "circle",
        eyebrow: "あなたのポジションは？",
        title: "現在の役職を教えてください",
        sub: "最も近いものを選んでください",
        options: [
          { v: "assistant", label: "アシスタント", desc: "シャンプー・アシスタント業務中心", base: 260 },
          { v: "stylist", label: "スタイリスト", desc: "カット・カラーを担当", base: 320 },
          { v: "top", label: "トップスタイリスト", desc: "指名売上を牽引する立場", base: 400 },
          { v: "manager", label: "副店長・店長", desc: "店舗運営も担当", base: 480 },
          { v: "owner", label: "エリアマネージャー／独立オーナー", desc: "複数店舗・経営に関与", base: 580 },
        ],
      },
      {
        key: "experience",
        type: "slider",
        eyebrow: "キャリアの長さは？",
        title: "美容師としての経験年数は？",
        sub: "アシスタント期間も含めてお答えください",
        min: 0,
        max: 20,
        def: 3,
        maxLabel: "20年以上",
      },
      {
        key: "sales",
        type: "single",
        tickShape: "circle",
        eyebrow: "売上の状況は？",
        title: "現在の月間施術売上高は？",
        sub: "カット・カラー等、あなたの技術売上の合計目安",
        options: [
          { v: "s1", label: "〜80万円", desc: "新規のお客様が中心", mid: 60 },
          { v: "s2", label: "80万〜150万円", desc: "固定客が育ってきた", mid: 115 },
          { v: "s3", label: "150万〜250万円", desc: "安定した指名客がいる", mid: 200 },
          { v: "s4", label: "250万〜400万円", desc: "店舗トップクラスの売上", mid: 325 },
          { v: "s5", label: "400万円〜", desc: "予約の取れない人気スタイリスト", mid: 480 },
        ],
      },
      { key: "area", type: "single", tickShape: "circle", ...AREA_QUESTION_META, options: AREAS },
      {
        key: "style",
        type: "single",
        tickShape: "circle",
        ...STYLE_QUESTION_META,
        options: [
          { v: "fixed", label: "固定給メイン", desc: "安定重視で働きたい", mode: "fixed" },
          { v: "hybrid", label: "固定給＋歩合", desc: "バランス型で働きたい", mode: "hybrid", rate: 0.1 },
          { v: "commission", label: "歩合中心・業務委託", desc: "実力に見合った報酬がほしい", mode: "commission", rate: 0.48 },
        ],
      },
      {
        key: "strengths",
        type: "multi",
        tickShape: "square",
        max: 3,
        eyebrow: "得意分野・強み（任意）",
        title: "あなたの強みを教えてください",
        sub: "当てはまるものを最大3つまで選択できます（未選択でもOK）",
        options: [
          { v: "sns", label: "SNS発信・集客力", desc: "Instagram等で新規集客できる", bonus: 8 },
          { v: "color", label: "色彩・トレンドカラー技術", desc: "デザインカラーが得意", bonus: 6 },
          { v: "mgmt", label: "後輩育成・マネジメント経験", desc: "アシスタント指導や店舗運営", bonus: 10 },
          { v: "award", label: "コンテスト受賞・雑誌掲載歴", desc: "", bonus: 12 },
          { v: "updo", label: "着付け・ヘアアレンジ対応力", desc: "ブライダル・着付け対応可", bonus: 5 },
        ],
      },
    ],
    calc(a): Estimate {
      const position = pos(a);
      const y = years(a);
      const s = sales(a);
      const st = style(a);
      const str = strengths(a);
      const expAdj = Math.min(y, 20) * 4;
      const annualSales = s.mid * 12;
      const breakdown: { label: string; text: string }[] = [];
      let subtotal = 0;
      let incentive = 0;
      if (st.mode === "fixed") {
        subtotal = position.base + expAdj;
        breakdown.push({ label: "役職ベース給与", text: `${position.base}万円` });
        breakdown.push({ label: "経験年数による加算", text: `+${expAdj}万円` });
        breakdown.push({ label: "歩合インセンティブ", text: `±0万円` });
      } else if (st.mode === "hybrid") {
        incentive = Math.round(annualSales * (st.rate ?? 0));
        subtotal = position.base + expAdj + incentive;
        breakdown.push({ label: "役職ベース給与", text: `${position.base}万円` });
        breakdown.push({ label: "経験年数による加算", text: `+${expAdj}万円` });
        breakdown.push({ label: "歩合インセンティブ試算", text: `+${incentive}万円` });
      } else {
        const retainer = 60;
        const skillAdj = Math.round(position.base * 0.25);
        incentive = Math.round(annualSales * (st.rate ?? 0));
        subtotal = retainer + skillAdj + incentive;
        breakdown.push({ label: "契約ベース（業務委託）", text: `${retainer}万円` });
        breakdown.push({ label: "技術力加算（役職相当）", text: `+${skillAdj}万円` });
        breakdown.push({ label: "歩合インセンティブ試算", text: `+${incentive}万円` });
      }
      const adjusted = withAreaAdjustment(subtotal, a, breakdown);
      const strengthBonus = str.reduce((sum, x) => sum + x.bonus, 0);
      breakdown.push({
        label: str.length > 0 ? "強みによる加点" : "強みによる加点（未選択）",
        text: `+${strengthBonus}万円`,
      });
      const center = Math.round(adjusted + strengthBonus);
      const volatile = st.mode === "commission";
      const { low, high } = rangeFromCenter(center, volatile);
      const pct = Math.max(0, Math.min(1, (center - 250) / (950 - 250)));
      return { center, low, high, pct, breakdown };
    },
  },

  /* ============ ネイリスト ============ */
  nail: {
    id: "nail",
    label: "ネイリスト",
    tagline: "ジェル・アート施術",
    resultName: "あなたの想定年収診断結果",
    questions: [
      {
        key: "position",
        type: "single",
        tickShape: "circle",
        eyebrow: "あなたのポジションは？",
        title: "現在の役職を教えてください",
        sub: "最も近いものを選んでください",
        options: [
          { v: "assistant", label: "見習い・アシスタント", desc: "施術補助が中心", base: 230 },
          { v: "nailist", label: "ネイリスト", desc: "一通りの施術を担当", base: 280 },
          { v: "top", label: "トップネイリスト", desc: "指名売上を牽引する立場", base: 340 },
          { v: "manager", label: "店長", desc: "店舗運営も担当", base: 400 },
          { v: "owner", label: "独立オーナー", desc: "自身のサロンを経営", base: 500 },
        ],
      },
      {
        key: "experience",
        type: "slider",
        eyebrow: "キャリアの長さは？",
        title: "ネイリストとしての経験年数は？",
        sub: "見習い期間も含めてお答えください",
        min: 0,
        max: 20,
        def: 3,
        maxLabel: "20年以上",
      },
      {
        key: "cert",
        type: "single",
        tickShape: "circle",
        eyebrow: "資格・技術レベルは？",
        title: "保有資格を教えてください",
        sub: "ネイル業界は資格の等級が給与に直結しやすい業界です",
        options: [
          { v: "c1", label: "資格なし（実務経験のみ）", desc: "", bonus: 0 },
          { v: "c2", label: "JNECネイリスト技能検定 3級", desc: "", bonus: 15 },
          { v: "c3", label: "JNECネイリスト技能検定 2級", desc: "", bonus: 30 },
          { v: "c4", label: "JNEC1級／ジェル検定上級 等", desc: "デザイン・アートも高難度対応", bonus: 50 },
        ],
      },
      {
        key: "sales",
        type: "single",
        tickShape: "circle",
        eyebrow: "売上の状況は？",
        title: "現在の月間施術売上高は？",
        sub: "ジェル・アート等、技術売上の合計目安",
        options: [
          { v: "s1", label: "〜40万円", desc: "新規のお客様が中心", mid: 30 },
          { v: "s2", label: "40万〜70万円", desc: "固定客が育ってきた", mid: 55 },
          { v: "s3", label: "70万〜120万円", desc: "安定した指名客がいる", mid: 95 },
          { v: "s4", label: "120万〜180万円", desc: "店舗トップクラスの売上", mid: 150 },
          { v: "s5", label: "180万円〜", desc: "予約の取れない人気ネイリスト", mid: 220 },
        ],
      },
      { key: "area", type: "single", tickShape: "circle", ...AREA_QUESTION_META, options: AREAS },
      {
        key: "style",
        type: "single",
        tickShape: "circle",
        ...STYLE_QUESTION_META,
        options: [
          { v: "fixed", label: "固定給メイン", desc: "安定重視で働きたい", mode: "fixed" },
          { v: "hybrid", label: "固定給＋歩合", desc: "バランス型で働きたい", mode: "hybrid", rate: 0.12 },
          { v: "commission", label: "歩合中心・業務委託", desc: "実力に見合った報酬がほしい", mode: "commission", rate: 0.5 },
        ],
      },
    ],
    calc(a): Estimate {
      const position = pos(a);
      const y = years(a);
      const c = cert(a);
      const s = sales(a);
      const st = style(a);
      const expAdj = Math.min(y, 20) * 3;
      const annualSales = s.mid * 12;
      const breakdown: { label: string; text: string }[] = [];
      let subtotal = 0;
      let incentive = 0;
      if (st.mode === "fixed") {
        subtotal = position.base + expAdj + c.bonus;
        breakdown.push({ label: "役職ベース給与", text: `${position.base}万円` });
        breakdown.push({ label: "経験年数による加算", text: `+${expAdj}万円` });
        breakdown.push({ label: "資格・技術レベルによる加点", text: `+${c.bonus}万円` });
        breakdown.push({ label: "歩合インセンティブ", text: `±0万円` });
      } else if (st.mode === "hybrid") {
        incentive = Math.round(annualSales * (st.rate ?? 0));
        subtotal = position.base + expAdj + c.bonus + incentive;
        breakdown.push({ label: "役職ベース給与", text: `${position.base}万円` });
        breakdown.push({ label: "経験年数による加算", text: `+${expAdj}万円` });
        breakdown.push({ label: "資格・技術レベルによる加点", text: `+${c.bonus}万円` });
        breakdown.push({ label: "歩合インセンティブ試算", text: `+${incentive}万円` });
      } else {
        const retainer = 50;
        const skillAdj = Math.round(position.base * 0.2);
        incentive = Math.round(annualSales * (st.rate ?? 0));
        subtotal = retainer + skillAdj + c.bonus + incentive;
        breakdown.push({ label: "契約ベース（業務委託）", text: `${retainer}万円` });
        breakdown.push({ label: "技術力加算（役職相当）", text: `+${skillAdj}万円` });
        breakdown.push({ label: "資格・技術レベルによる加点", text: `+${c.bonus}万円` });
        breakdown.push({ label: "歩合インセンティブ試算", text: `+${incentive}万円` });
      }
      const adjusted = withAreaAdjustment(subtotal, a, breakdown);
      const center = Math.round(adjusted);
      const volatile = st.mode === "commission";
      const { low, high } = rangeFromCenter(center, volatile);
      const pct = Math.max(0, Math.min(1, (center - 220) / (750 - 220)));
      return { center, low, high, pct, breakdown };
    },
  },

  /* ============ アイリスト（アイブロウ含む） ============ */
  lash: {
    id: "lash",
    label: "アイリスト",
    tagline: "まつげ・眉施術（アイブロウ含む）",
    resultName: "あなたの想定年収診断結果",
    questions: [
      {
        key: "position",
        type: "single",
        tickShape: "circle",
        eyebrow: "あなたのポジションは？",
        title: "現在の役職を教えてください",
        sub: "最も近いものを選んでください",
        options: [
          { v: "assistant", label: "アシスタント", desc: "施術補助が中心", base: 240 },
          { v: "lashist", label: "アイリスト", desc: "一通りの施術を担当", base: 290 },
          { v: "top", label: "トップアイリスト", desc: "指名売上を牽引する立場", base: 350 },
          { v: "manager", label: "店長", desc: "店舗運営も担当", base: 420 },
          { v: "owner", label: "独立オーナー", desc: "自身のサロンを経営", base: 520 },
        ],
      },
      {
        key: "experience",
        type: "slider",
        eyebrow: "キャリアの長さは？",
        title: "アイリストとしての経験年数は？",
        sub: "アシスタント期間も含めてお答えください",
        min: 0,
        max: 20,
        def: 3,
        maxLabel: "20年以上",
      },
      {
        key: "cert",
        type: "single",
        tickShape: "circle",
        eyebrow: "資格・技術レベルは？",
        title: "保有資格を教えてください",
        sub: "アイラッシュ／アイブロウの技術資格の有無で選んでください",
        options: [
          { v: "c1", label: "資格なし（実務経験のみ）", desc: "", bonus: 0 },
          { v: "c2", label: "アイラッシュ技能検定 準3級・3級相当", desc: "", bonus: 12 },
          { v: "c3", label: "アイラッシュ技能検定 2級相当", desc: "", bonus: 25 },
          { v: "c4", label: "1級相当／アイブロウ資格も保有", desc: "デザイン・矯正等も対応可", bonus: 40 },
        ],
      },
      {
        key: "sales",
        type: "single",
        tickShape: "circle",
        eyebrow: "売上の状況は？",
        title: "現在の月間施術売上高は？",
        sub: "まつげ・眉施術等、技術売上の合計目安",
        options: [
          { v: "s1", label: "〜50万円", desc: "新規のお客様が中心", mid: 40 },
          { v: "s2", label: "50万〜90万円", desc: "固定客が育ってきた", mid: 70 },
          { v: "s3", label: "90万〜150万円", desc: "安定した指名客がいる", mid: 120 },
          { v: "s4", label: "150万〜220万円", desc: "店舗トップクラスの売上", mid: 185 },
          { v: "s5", label: "220万円〜", desc: "予約の取れない人気アイリスト", mid: 260 },
        ],
      },
      { key: "area", type: "single", tickShape: "circle", ...AREA_QUESTION_META, options: AREAS },
      {
        key: "style",
        type: "single",
        tickShape: "circle",
        ...STYLE_QUESTION_META,
        options: [
          { v: "fixed", label: "固定給メイン", desc: "安定重視で働きたい", mode: "fixed" },
          { v: "hybrid", label: "固定給＋歩合", desc: "バランス型で働きたい", mode: "hybrid", rate: 0.11 },
          { v: "commission", label: "歩合中心・業務委託", desc: "実力に見合った報酬がほしい", mode: "commission", rate: 0.46 },
        ],
      },
    ],
    calc(a): Estimate {
      const position = pos(a);
      const y = years(a);
      const c = cert(a);
      const s = sales(a);
      const st = style(a);
      const expAdj = Math.min(y, 20) * 3;
      const annualSales = s.mid * 12;
      const breakdown: { label: string; text: string }[] = [];
      let subtotal = 0;
      let incentive = 0;
      if (st.mode === "fixed") {
        subtotal = position.base + expAdj + c.bonus;
        breakdown.push({ label: "役職ベース給与", text: `${position.base}万円` });
        breakdown.push({ label: "経験年数による加算", text: `+${expAdj}万円` });
        breakdown.push({ label: "資格・技術レベルによる加点", text: `+${c.bonus}万円` });
        breakdown.push({ label: "歩合インセンティブ", text: `±0万円` });
      } else if (st.mode === "hybrid") {
        incentive = Math.round(annualSales * (st.rate ?? 0));
        subtotal = position.base + expAdj + c.bonus + incentive;
        breakdown.push({ label: "役職ベース給与", text: `${position.base}万円` });
        breakdown.push({ label: "経験年数による加算", text: `+${expAdj}万円` });
        breakdown.push({ label: "資格・技術レベルによる加点", text: `+${c.bonus}万円` });
        breakdown.push({ label: "歩合インセンティブ試算", text: `+${incentive}万円` });
      } else {
        const retainer = 48;
        const skillAdj = Math.round(position.base * 0.2);
        incentive = Math.round(annualSales * (st.rate ?? 0));
        subtotal = retainer + skillAdj + c.bonus + incentive;
        breakdown.push({ label: "契約ベース（業務委託）", text: `${retainer}万円` });
        breakdown.push({ label: "技術力加算（役職相当）", text: `+${skillAdj}万円` });
        breakdown.push({ label: "資格・技術レベルによる加点", text: `+${c.bonus}万円` });
        breakdown.push({ label: "歩合インセンティブ試算", text: `+${incentive}万円` });
      }
      const adjusted = withAreaAdjustment(subtotal, a, breakdown);
      const center = Math.round(adjusted);
      const volatile = st.mode === "commission";
      const { low, high } = rangeFromCenter(center, volatile);
      const pct = Math.max(0, Math.min(1, (center - 230) / (780 - 230)));
      return { center, low, high, pct, breakdown };
    },
  },

  /* ============ エステティシャン・セラピスト ============ */
  esthe: {
    id: "esthe",
    label: "エステ・セラピスト",
    tagline: "エステ／リラクゼーション施術",
    resultName: "あなたの想定年収診断結果",
    questions: [
      {
        key: "position",
        type: "single",
        tickShape: "circle",
        eyebrow: "あなたのポジションは？",
        title: "現在の役職を教えてください",
        sub: "最も近いものを選んでください",
        options: [
          { v: "assistant", label: "アシスタント", desc: "施術補助・カウンセリング補助", base: 250 },
          { v: "esthetician", label: "エステティシャン・セラピスト", desc: "一通りの施術を担当", base: 300 },
          { v: "top", label: "トップエステティシャン", desc: "指名・契約実績を牽引する立場", base: 370 },
          { v: "manager", label: "店長", desc: "店舗運営も担当", base: 440 },
          { v: "owner", label: "エリアマネージャー／独立オーナー", desc: "複数店舗・経営に関与", base: 540 },
        ],
      },
      {
        key: "experience",
        type: "slider",
        eyebrow: "キャリアの長さは？",
        title: "この職種としての経験年数は？",
        sub: "アシスタント期間も含めてお答えください",
        min: 0,
        max: 20,
        def: 3,
        maxLabel: "20年以上",
      },
      {
        key: "cert",
        type: "single",
        tickShape: "circle",
        eyebrow: "資格の有無は？",
        title: "保有資格を教えてください",
        sub: "アロマ・エステ関連の資格で選んでください",
        options: [
          { v: "c1", label: "資格なし（実務経験のみ）", desc: "", bonus: 0 },
          { v: "c2", label: "認定エステティシャン資格 等", desc: "", bonus: 15 },
          { v: "c3", label: "AEA上級・国際ライセンス 等", desc: "専門性の高い資格を保有", bonus: 35 },
        ],
      },
      {
        key: "sales",
        type: "single",
        tickShape: "circle",
        eyebrow: "売上・契約の状況は？",
        title: "月間の合計売上高は？",
        sub: "技術売上に加え、物販・コース契約金額も含めた合計目安",
        options: [
          { v: "s1", label: "〜60万円", desc: "新規のお客様が中心", mid: 45 },
          { v: "s2", label: "60万〜110万円", desc: "固定客とリピート契約が育ってきた", mid: 85 },
          { v: "s3", label: "110万〜180万円", desc: "コース契約・物販の成約が安定", mid: 145 },
          { v: "s4", label: "180万〜280万円", desc: "店舗トップクラスの実績", mid: 230 },
          { v: "s5", label: "280万円〜", desc: "指名・契約とも圧倒的な実績", mid: 340 },
        ],
      },
      { key: "area", type: "single", tickShape: "circle", ...AREA_QUESTION_META, options: AREAS },
      {
        key: "style",
        type: "single",
        tickShape: "circle",
        ...STYLE_QUESTION_META,
        options: [
          { v: "fixed", label: "固定給メイン", desc: "安定重視で働きたい", mode: "fixed" },
          { v: "hybrid", label: "固定給＋歩合", desc: "バランス型で働きたい", mode: "hybrid", rate: 0.13 },
          {
            v: "commission",
            label: "歩合中心・業務委託／フリーランス",
            desc: "実力に見合った報酬がほしい",
            mode: "commission",
            rate: 0.45,
          },
        ],
      },
    ],
    calc(a): Estimate {
      const position = pos(a);
      const y = years(a);
      const c = cert(a);
      const s = sales(a);
      const st = style(a);
      const expAdj = Math.min(y, 20) * 3.5;
      const annualSales = s.mid * 12;
      const breakdown: { label: string; text: string }[] = [];
      let subtotal = 0;
      let incentive = 0;
      if (st.mode === "fixed") {
        subtotal = position.base + expAdj + c.bonus;
        breakdown.push({ label: "役職ベース給与", text: `${position.base}万円` });
        breakdown.push({ label: "経験年数による加算", text: `+${Math.round(expAdj)}万円` });
        breakdown.push({ label: "資格による加点", text: `+${c.bonus}万円` });
        breakdown.push({ label: "歩合インセンティブ", text: `±0万円` });
      } else if (st.mode === "hybrid") {
        incentive = Math.round(annualSales * (st.rate ?? 0));
        subtotal = position.base + expAdj + c.bonus + incentive;
        breakdown.push({ label: "役職ベース給与", text: `${position.base}万円` });
        breakdown.push({ label: "経験年数による加算", text: `+${Math.round(expAdj)}万円` });
        breakdown.push({ label: "資格による加点", text: `+${c.bonus}万円` });
        breakdown.push({ label: "物販・コース歩合インセンティブ試算", text: `+${incentive}万円` });
      } else {
        const retainer = 55;
        const skillAdj = Math.round(position.base * 0.22);
        incentive = Math.round(annualSales * (st.rate ?? 0));
        subtotal = retainer + skillAdj + c.bonus + incentive;
        breakdown.push({ label: "契約ベース（業務委託）", text: `${retainer}万円` });
        breakdown.push({ label: "技術力加算（役職相当）", text: `+${skillAdj}万円` });
        breakdown.push({ label: "資格による加点", text: `+${c.bonus}万円` });
        breakdown.push({ label: "物販・コース歩合インセンティブ試算", text: `+${incentive}万円` });
      }
      const adjusted = withAreaAdjustment(subtotal, a, breakdown);
      const center = Math.round(adjusted);
      const volatile = st.mode === "commission";
      const { low, high } = rangeFromCenter(center, volatile);
      const pct = Math.max(0, Math.min(1, (center - 240) / (900 - 240)));
      return { center, low, high, pct, breakdown };
    },
  },
};

export const JOB_ORDER: JobId[] = ["hair", "nail", "lash", "esthe"];

export const LOADING_LINES = [
  "入力データを集計しています",
  "役職・経験年数を評価",
  "歩合・インセンティブを試算",
  "エリア相場を加味",
  "資格・強みによる加点を計算",
];
