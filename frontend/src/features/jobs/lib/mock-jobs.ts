export type MockJob = {
  id: string;
  imageUrl: string;
  imageBadge: string;
  title: string;
  incomeExample: string;
  incomeRange: string;
  location: string;
  jobTypes: string[];
  jobId: string;
  /** A8.netクリック計測URL。未設定の場合は画像・詳細リンクを非表示 */
  affiliateUrl?: string;
  /** A8.netインプレッション計測ピクセルURL（0.gif）。カード表示時に読み込む */
  impressionPixelUrl?: string;
};

export const MOCK_JOBS: MockJob[] = [
  {
    id: "job-1",
    // A8.net 商品リンク imu から取得
    imageUrl: "https://koujoukyujin.world/userdata/images/00795265.webp",
    imageBadge: "7月入社募集中",
    title:
      "7月入社【東京勤務】メーカー正社員登用率80%!!/月収例36万円以上/土日休み/未経験OK/寮費無料/駅チカ",
    incomeExample: "【月給】361,637円",
    incomeRange: "【月給】255,000円〜",
    location: "東京都羽村市",
    jobTypes: [
      "検査",
      "組立・組付け",
      "加工",
      "マシンオペレーター",
      "ライン作業",
    ],
    jobId: "45500-00",
    affiliateUrl:
      "https://px.a8.net/svt/ejp?a8mat=4B5WGC+7O95GY+5S9S+BW8O2&a8ejpredirect=https%3A%2F%2Fkoujoukyujin.world%2Ftopic%2Fdetail%2F45500-00%2F",
    impressionPixelUrl:
      "https://www13.a8.net/0.gif?a8mat=4B5WGC+7O95GY+5S9S+BW8O2",
  },
  {
    id: "job-2",
    imageUrl:
      "https://www22.a8.net/svt/bgt?aid=260615821321&wid=001&eno=01&mid=s00000026324001008000&mc=1",
    imageBadge: "在宅可！",
    title: "ノンアダルトチャットレディー大募集！すぐにお仕事紹介！！",
    incomeExample: "【月収】30万",
    incomeRange: "【時給】7,500円〜",
    location: "在宅/全国各地",
    jobTypes: ["チャットレディー"],
    jobId: "38200-01",
    affiliateUrl: "https://px.a8.net/svt/ejp?a8mat=4B5WGD+5B45YQ+5N48+601S1",
    impressionPixelUrl:
      "https://www12.a8.net/0.gif?a8mat=4B5WGD+5B45YQ+5N48+601S1",
  },
  {
    id: "job-3",
    imageUrl:
      "https://job-ticket.jp/wp-content/uploads/2026/06/%E5%90%8D%E7%A7%B0%E6%9C%AA%E8%A8%AD%E5%AE%9A%E3%81%AE%E3%83%87%E3%82%B6%E3%82%A4%E3%83%B3-2026-06-19T104035.291.png",
    imageBadge: "住み込み",
    title: "【高時給】小涌谷駅から徒歩13分　リゾートマンションの施設管理",
    incomeExample: "【時給】1500円",
    incomeRange: "【時給】1500円",
    location: "神奈川県箱根町",
    jobTypes: ["裏方", "施設管理"],
    jobId: "100126",
    affiliateUrl:
      "https://px.a8.net/svt/ejp?a8mat=4B5WGC+DRCO36+5OUQ+BW8O2&a8ejpredirect=https%3A%2F%2Fjob-ticket.jp%2Fjobs%2F100126%2F",
    impressionPixelUrl:
      "https://www15.a8.net/0.gif?a8mat=4B5WGC+DRCO36+5OUQ+BW8O2",
  },
  {
    id: "job-4",
    imageUrl:
      "https://job-ticket.jp/wp-content/uploads/2026/06/%E5%90%8D%E7%A7%B0%E6%9C%AA%E8%A8%AD%E5%AE%9A%E3%81%AE%E3%83%87%E3%82%B6%E3%82%A4%E3%83%B3-2026-06-19T104035.291.png",
    imageBadge: "住み込み",
    title: "【高時給】小涌谷駅から徒歩13分　リゾートマンションの施設管理",
    incomeExample: "【時給】1500円",
    incomeRange: "【時給】1500円",
    location: "神奈川県箱根町",
    jobTypes: ["裏方", "施設管理"],
    jobId: "100126",
    affiliateUrl:
      "https://px.a8.net/svt/ejp?a8mat=4B5WGC+DRCO36+5OUQ+BW8O2&a8ejpredirect=https%3A%2F%2Fjob-ticket.jp%2Fjobs%2F100126%2F",
    impressionPixelUrl:
      "https://www15.a8.net/0.gif?a8mat=4B5WGC+DRCO36+5OUQ+BW8O2",
  },
];
