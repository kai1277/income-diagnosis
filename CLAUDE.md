# CLAUDE.md — 推定年収診断モック

## ⚡ このプロジェクトの本質

**「プロダクト」ではなく「検証装置」**

目的は以下3つの仮説を検証すること：

- 仮説①：年収診断はクリックされるか
- 仮説②：結果画面から求人クリックされるか
- 仮説③：ブルーカラー職種提示でもユーザーに拒否されないか

> 作り込み・AI実装・UXこだわりは**禁止**。今は「刺さるか・クリックされるか・金になるか」だけを検証する。

---

## 🗂 プロジェクト構成

```
/
├── frontend/
│   ├── user-web/                      # Viteプロジェクトルート（ユーザー向け）
│   │   ├── src/
│   │   │   ├── main.tsx                   # エントリーポイント（GA4初期化）
│   │   │   ├── vite-env.d.ts              # 型定義（gtag, import.meta.env）
│   │   │   ├── index.css                  # グローバルCSS（Tailwind）
│   │   │   ├── app/
│   │   │   │   └── App.tsx                # ルーティング定義（/, /quiz, /result）
│   │   │   ├── features/
│   │   │   │   ├── home/
│   │   │   │   │   └── routes/home.tsx        # トップLP（診断開始）
│   │   │   │   ├── diagnosis/
│   │   │   │   │   ├── routes/
│   │   │   │   │   │   ├── quiz.tsx           # 診断画面（ステップ形式）
│   │   │   │   │   │   └── result.tsx         # 結果画面（求人CTA）
│   │   │   │   │   ├── components/
│   │   │   │   │   │   ├── quiz-step.tsx      # 1問ずつ表示するUI
│   │   │   │   │   │   └── result-card.tsx    # 年収・職種表示
│   │   │   │   │   ├── constants/
│   │   │   │   │   │   ├── questions.ts       # 質問一覧
│   │   │   │   │   │   ├── diagnosis-rules.ts # 診断ロジック（ルールベース）
│   │   │   │   │   │   └── step-categories.ts
│   │   │   │   │   ├── utils/
│   │   │   │   │   │   ├── diagnose.ts        # 診断結果算出
│   │   │   │   │   │   └── quiz-helpers.ts
│   │   │   │   │   └── types/
│   │   │   │   └── jobs/
│   │   │   │       ├── components/job-link.tsx   # 求人リンク（クリック計測付き）
│   │   │   │       └── lib/job-links.ts           # 求人URL集約
│   │   │   └── lib/
│   │   │       └── tracking.ts            # GA4イベント送信ヘルパー
│   │   ├── index.html
│   │   ├── vite.config.ts
│   │   └── .env.local                     # VITE_GA_ID
│   └── admin-web/                     # 管理画面用（今後実装）
├── backend/
│   ├── api/                           # APIエンドポイント
│   │   └── src/
│   │       ├── main.ts                # エントリーポイント
│   │       ├── app/                   # アプリケーション設定
│   │       ├── config/                # 環境変数・設定管理
│   │       ├── db/                    # DB接続・マイグレーション
│   │       ├── features/              # 機能ごとのモジュール
│   │       │   ├── admin/             # 管理者向け機能
│   │       │   └── user/              # ユーザー向け機能
│   │       ├── lib/                   # 共通ライブラリ
│   │       ├── middleware/            # ミドルウェア
│   │       ├── repositories/          # DBアクセス層
│   │       └── shared/                # 複数機能で共有するコード
│   ├── batch/                         # バッチ処理
│   ├── scripts/                       # 手動で実行するスクリプト
│   └── worker/                        # 重い処理や非同期通信を裏でやる
├── docs/
│   └── diagnosis-tree/                # 診断ロジックの設計ドキュメント
└── CLAUDE.md
```

**技術スタック**

- ビルドツール: **Vite**
- フレームワーク: **React + React Router v7**
- スタイリング: **Tailwind CSS v4**（`@tailwindcss/vite` プラグイン）
- デプロイ: **Cloudflare Pages**（本番環境）／モック検証はローカルホストで完結
- 計測: **Google Analytics 4**（gtag.js）

---

## 📱 画面要件

### 1. トップLP（`/`）

- スマホファーストで実装（最重要）
- 3秒で意図が伝わること
- 必須要素:
  - キャッチ: 「あなたの潜在年収、診断します」
  - サブ: 「今の仕事より稼げる可能性」
  - CTA: 「無料で診断する」ボタン（大きく・目立つ）

### 2. 診断画面（`/quiz`）

- 1問ずつ表示（ステップ形式、全5問）
- **入力フォームは使わない**（選択肢のみ）
- 質問一覧:
  1. 年齢レンジ（例：20代前半 / 20代後半 / 30代 / 40代以上）
  2. 現在の職種（例：事務・営業 / 製造・現場 / IT / その他）
  3. 現在の年収レンジ（例：〜300万 / 300〜400万 / 400〜500万 / 500万〜）
  4. 働き方の志向（安定重視 / 成果・稼ぎ重視）
  5. 手を動かすことへの抵抗（全然ない / 少しある / 抵抗がある）
- プログレスバー表示（離脱抑制）

### 3. 結果画面（`/result`）【最重要】

- 必須要素（この順で表示）:
  1. **潜在年収表示**：「あなたの潜在年収：○○万円」
  2. **ギャップ提示**：「現在より+○○万円の可能性」
  3. **職種提案**（2〜3件）：例）配管工 / 建設系 / ラーメン店経営
  4. **理由付け**：「手を動かす仕事に適性あり」「成果報酬型で伸びやすい」など
  5. **求人CTAボタン**（2つ）：
     - 「この条件の求人を見る」
     - 「年収○○万円以上の求人」
- CTAボタンは**画面下部に固定**（sticky）

---

## 🧠 診断ロジック（`features/diagnosis/constants/diagnosis-rules.ts`）

シンプルなルールベース。正確性より**納得感**を優先。

```typescript
// 大まかな方針
if (手を動かすことへの抵抗 === "全然ない" && 働き方志向 === "成果・稼ぎ重視") {
  → ブルーカラー高単価系（配管工・建設・etc）
  → 潜在年収: 現在年収 × 1.3〜1.5（仮係数）
}

if (働き方志向 === "安定重視") {
  → 一般職・安定系
  → 潜在年収: 現在年収 × 1.1〜1.2
}

// 年収の表示はレンジではなく「単一数値」で表示（例：680万円）
// 仮数値でOK。ユーザーの納得感が重要
```

職種候補テーブルは `features/diagnosis/constants/diagnosis-rules.ts` にハードコードで定義する。DB不要。

---

## 📊 計測実装（必須）

Google Analytics 4 を使い、以下のカスタムイベントを計測する：

| イベント名       | 発火タイミング                     |
| ---------------- | ---------------------------------- |
| `quiz_start`     | 「無料で診断する」ボタンクリック時 |
| `quiz_complete`  | 全問回答完了・結果画面表示時       |
| `job_link_click` | 求人CTAボタンクリック時            |

```typescript
// features/jobs/components/job-link.tsx での計測例
const handleClick = () => {
  window.gtag?.("event", "job_link_click", {
    job_type: jobType,
    destination_url: url,
  });
  window.open(url, "_blank");
};
```

GA4の測定IDは `.env.local` に `VITE_GA_ID=G-XXXXXXXXXX` として管理。コード内では `import.meta.env.VITE_GA_ID` で参照。

---

## 🔗 求人リンク

現時点ではダミーURLで実装する。後から差し替えられるよう `features/jobs/lib/job-links.ts` に集約すること。

```typescript
// features/jobs/lib/job-links.ts
export const JOB_LINKS = {
  blueCollar: "https://www.indeed.com/jobs?q=...", // 後で差し替え
  general: "https://www.indeed.com/jobs?q=...",
};
```

---

## 🚫 やらないこと（絶対禁止）

- ログイン・認証機能
- AIによる診断ロジック
- マイページ・履歴保存
- アニメーション・演出の作り込み
- レスポンシブの細かい調整（スマホが動けばOK）

---

## 🚀 デプロイ方針

- **モック検証フェーズ**：`npm run dev`（Vite）によるローカルホストで動作確認・KPI計測を行う
- **本番公開フェーズ**：Cloudflare Pagesにデプロイ
  - `npm run build` で `dist/` に静的ファイルを出力（Viteはデフォルト静的エクスポート）
  - GAの測定IDは Cloudflare Pages の環境変数（`VITE_GA_ID`）で管理

> ⚠️ Vercelは使わない

---

## ✅ KPI目標（判断基準）

| 指標                             | 目標値      |
| -------------------------------- | ----------- |
| 診断完了率（start→complete）     | **50%以上** |
| 求人クリック率（complete→click） | **20%以上** |

- クリック率20%未満 → 即ピボット
- 診断完了率50%未満 → 質問数・選択肢を見直す

---

## 🗓 開発スケジュール

| Day     | タスク                           |
| ------- | -------------------------------- |
| Day 1-2 | LP・診断UIの実装                 |
| Day 3-4 | 結果ロジック実装・求人リンク設置 |
| Day 5   | GA4計測設定・動作確認            |
| Day 6-7 | SNS流入テスト・KPI計測開始       |

---

## 💡 開発時の判断基準

迷ったときはこの順で判断する：

1. **これはKPI計測に必要か？** → 必要なら作る
2. **スマホで3秒で理解できるか？** → できなければシンプルにする
3. **求人CTAクリックに近づくか？** → 近づかなければ作らない

---

# Supabase / Database 開発ルール

このプロジェクトでは、Database として Supabase PostgreSQL を使用する。

## 現在の Supabase Security 設定

Supabase の Security 設定は以下とする。

```text
Enable Data API: OFF
Automatically expose new tables: OFF
Enable automatic RLS: ON
```

## 重要なアーキテクチャ方針

フロントエンドから Supabase に直接アクセスしてはいけない。

DBアクセスは必ず以下の経路で行う。

```text
frontend/user-web
frontend/admin-web
↓
backend/api
↓
Supabase PostgreSQL
```

## フロントエンドで Supabase Client を使わない

以下のフロントエンドアプリに Supabase Client の処理を追加してはいけない。

```text
frontend/user-web
frontend/admin-web
```

以下の値をフロントエンドへ公開してはいけない。

```text
SUPABASE_SERVICE_ROLE_KEY
DATABASE_URL
DIRECT_URL
```

特に `SUPABASE_SERVICE_ROLE_KEY` は強い権限を持つため、絶対にブラウザへ公開してはいけない。

## Prisma の利用方針

バックエンドでは Prisma を使用して Supabase PostgreSQL に接続する。

Prisma 関連ファイルは以下に配置する。

```text
backend/api/prisma/
```

環境変数ファイルは以下に配置する。

```text
backend/api/.env
```

想定する環境変数は以下。

```env
DATABASE_URL=""
DIRECT_URL=""
```

`DATABASE_URL` は、アプリケーション実行時のDB接続に使用する。
`DIRECT_URL` は、Prisma migration 実行時のDB接続に使用する。

`.env` は Git 管理してはいけない。
共有用には `.env.example` を使用する。

## データベース運用ルール

### マイグレーションは必ず手動で実行する

CIやデプロイ時にマイグレーションを自動実行してはいけない。
スキーマ変更は必ず開発者が手動でコマンドを実行して反映する。

### スキーマ変更の手順

マイグレーションは「ローカルで作成 → GitHub に push → 本番で適用」の3ステップで行う。

**Step 1: ローカルでマイグレーションを作成する**

1. `backend/api/prisma/schema.prisma` を編集する
2. `backend/api` ディレクトリで以下を実行する

```bash
cd backend/api
npx prisma migrate dev --name <変更内容を表す名前>
```

例：`npx prisma migrate dev --name add_jobs_table`

これにより `backend/api/prisma/migrations/` にマイグレーションファイルが生成される。

**Step 2: GitHub に push する**

生成されたマイグレーションファイルを Git にコミットして GitHub に push する。

```bash
git add backend/api/prisma/
git commit -m "add migration: <変更内容>"
git push
```

> ⚠️ マイグレーションファイルを push してからでないと、本番環境で `migrate deploy` を実行できない。

**Step 3: 本番環境でマイグレーションを適用する**

本番サーバー上で以下を実行する。

```bash
cd backend/api
npx prisma migrate deploy
```

### Prisma Client の再生成

スキーマを変更したら Prisma Client を再生成する。
`migrate dev` 実行時は自動で行われるが、手動で実行する場合は以下。

```bash
cd backend/api
npx prisma generate
```

### マイグレーションファイルの管理

`backend/api/prisma/migrations/` 以下に生成されるマイグレーションファイルは Git で管理する。
このファイルが本番環境への変更履歴となるため、削除・改ざんをしてはいけない。

### 本番マイグレーション前の確認事項

* マイグレーション内容をレビューしてから実行する
* 破壊的変更（カラム削除・型変更）の場合はデータのバックアップを取ってから実行する
* `prisma migrate deploy` は適用済みのマイグレーションをスキップするため、冪等に実行できる

## RLS の方針

Supabase では automatic RLS を有効にしている。

そのため、新規テーブル作成時に Row Level Security が自動的に有効になる可能性がある。
ただし、このプロジェクトでは、主な認証・認可は `backend/api` 側で実装する。

管理者APIでは、必ずバックエンド側で管理者認証・権限チェックを行う。

対象例：

```text
/api/admin/jobs
/api/admin/job-requirements
/api/admin/diagnosis-logs
/api/admin/click-logs
```

これらのAPIは、フロントエンド側の画面制御だけに依存してはいけない。

## Data API の方針

このプロジェクトでは Supabase Data API を使用しない。

新規テーブルが Supabase の REST API として自動公開されることを前提にしてはいけない。
機能実装時は、必ず `backend/api` にエンドポイントを作成し、そこから Prisma 経由でDBにアクセスする。

将来的に Supabase Data API を直接利用する方針に変更する場合は、このドキュメントを更新し、RLSポリシーを明示的に定義してから実装する。

## セキュリティルール

* フロントエンドから Supabase に直接アクセスしない。
* フロントエンドで Supabase Client を使わない。
* `SUPABASE_SERVICE_ROLE_KEY` をブラウザに公開しない。
* `DATABASE_URL` や `DIRECT_URL` をブラウザに公開しない。
* `.env` ファイルを GitHub にコミットしない。
* 管理者操作は必ず `backend/api` 経由で行う。
* ユーザーの診断回答・診断結果・クリックログの保存も `backend/api` 経由で行う。
* DBアクセスは Prisma を通して行う。
* DB操作は Repository / Domain 層に集約し、Single Source of Truth を保つ。
