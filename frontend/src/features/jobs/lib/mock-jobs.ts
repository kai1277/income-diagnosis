export type MockJob = {
  id: string;
  imageUrl: string;
  imageBadge: string;
  title: string;
  monthlyIncome: number;
  monthlySalary: string;
  location: string;
  jobTypes: string[];
  jobId: string;
  detailUrl: string;
};

export const MOCK_JOBS: MockJob[] = [
  {
    id: "job-1",
    imageUrl: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=600&q=80",
    imageBadge: "7月入社募集中",
    title: "【東京勤務】メーカー正社員登用率80%!!/月収例36万円以上/土日休み/未経験OK/寮費無料/駅チカ",
    monthlyIncome: 361637,
    monthlySalary: "255,000円〜",
    location: "東京都羽村市",
    jobTypes: ["検査", "組立・組付け", "加工", "マシンオペレーター", "ライン作業"],
    jobId: "45500-00",
    detailUrl: "#",
  },
  {
    id: "job-2",
    imageUrl: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=600&q=80",
    imageBadge: "急募",
    title: "【神奈川・川崎】配管工/経験者優遇/日給2.5万円〜/社保完備/寮あり",
    monthlyIncome: 420000,
    monthlySalary: "300,000円〜",
    location: "神奈川県川崎市",
    jobTypes: ["配管工", "設備工事", "施工管理補助"],
    jobId: "38200-01",
    detailUrl: "#",
  },
  {
    id: "job-3",
    imageUrl: "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=600&q=80",
    imageBadge: "週払いOK",
    title: "【大阪】フォークリフトオペレーター/月収40万円可/残業少なめ/未経験歓迎",
    monthlyIncome: 385000,
    monthlySalary: "270,000円〜",
    location: "大阪府堺市",
    jobTypes: ["フォークリフト", "倉庫管理", "仕分け"],
    jobId: "51100-03",
    detailUrl: "#",
  },
];
