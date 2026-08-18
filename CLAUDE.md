# CLAUDE.md — 推定年収診断プラットフォーム

## ⚡ このプロジェクトについて

「あなたの推定年収は◯◯万円」という診断→求人マッチングの型を、複数の職種バーティカルに展開するプロダクト群。

現在は本格開発・リリースフェーズにあり、各バーティカルで以下を継続的に伸ばすことを目標にする：

- 診断がクリック・完了されること
- 結果画面から求人がクリックされること
- 提示した職種提案がユーザーに受け入れられること

診断ロジックはルールベースを採用する（LLM等による動的生成は行わない。理由・係数を説明可能な状態に保つため）。

---

## 🗂 プロジェクト構成

```
/
├── frontend/
│   ├── user-web/                      # 一般職・ブルーカラー系 診断アプリ（Cloudflare Pages: 個別プロジェクト）
│   │   ├── src/
│   │   │   ├── main.tsx                   # エントリーポイント（GA4初期化）
│   │   │   ├── vite-env.d.ts              # 型定義（gtag, import.meta.env）
│   │   │   ├── index.css                  # グローバルCSS（Tailwind）
│   │   │   ├── app/App.tsx                # ルーティング（/, /quiz, /result, /jobs, /user-my-page）
│   │   │   ├── features/
│   │   │   │   ├── home/routes/home.tsx       # トップLP（診断開始）
│   │   │   │   ├── diagnosis/
│   │   │   │   │   ├── routes/quiz.tsx, result.tsx
│   │   │   │   │   ├── components/quiz-step.tsx, result-card.tsx
│   │   │   │   │   └── utils/diagnose.ts          # backend/api の /api/user/diagnosis を叩く
│   │   │   │   ├── jobs/
│   │   │   │   │   ├── routes/jobs.tsx            # スワイプ式求人マッチングUI（キープ/スキップ）
│   │   │   │   │   ├── components/job-card.tsx, job-link.tsx
│   │   │   │   │   └── lib/mock-jobs.ts           # API失敗時のフォールバック用モック
│   │   │   │   ├── user-my-page/routes/user-my-page.tsx
│   │   │   │   └── auth/auth-context.tsx          # LINE LIFFログインのReact Context
│   │   │   └── lib/tracking.ts, analytics.ts
│   │   ├── index.html
│   │   ├── vite.config.ts
│   │   └── .env.local                     # VITE_GA_ID, VITE_LIFF_ID, VITE_API_URL
│   │
│   ├── beauty-web/                    # 美容系（美容師/ネイリスト/アイリスト/エステ）診断アプリ（Cloudflare Pages: 個別プロジェクト）
│   │   ├── src/
│   │   │   ├── app/App.tsx                # ルーティング（/ = DiagnosisFlow, /jobs, /user-my-page）
│   │   │   ├── features/
│   │   │   │   ├── diagnosis/
│   │   │   │   │   ├── routes/diagnosis-flow.tsx # 職種選択→質問→結果を1画面内でステップ管理
│   │   │   │   │   ├── components/                # question-panel, result-panel, job-select-panel 等
│   │   │   │   │   ├── constants/jobs.ts           # 職種別の質問セット（hair/nail/lash/esthe）
│   │   │   │   │   └── utils/diagnose.ts           # backend/api の /api/beauty/diagnosis を叩く
│   │   │   │   ├── jobs/
│   │   │   │   │   ├── routes/jobs.tsx            # スワイプ式求人マッチングUI（user-webと同じUX、ダーク×ゴールドで再スキン）
│   │   │   │   │   ├── components/job-match-card.tsx
│   │   │   │   │   └── lib/beauty-jobs.ts         # /api/beauty/jobs?jobId=... を叩く
│   │   │   │   ├── user-my-page/routes/user-my-page.tsx  # 未実装（TODO）
│   │   │   │   └── auth/auth-context.tsx
│   │   │   ├── lib/auth.ts, api.ts, analytics.ts, tracking.ts
│   │   │   └── index.css                  # ダーク×ゴールドのデザイントークン（--gold, --rose, --panel 等）
│   │   └── .env.local                     # VITE_GA_MEASUREMENT_ID, VITE_LIFF_ID, VITE_API_URL
│   │
│   └── admin-web/                     # 管理画面（求人・職種・都道府県・要件コードのCRUD、Cloudflare Pages: 個別プロジェクト）
├── backend/
│   ├── api/                           # NestJS APIサーバー（ポート3000）
│   │   ├── prisma/
│   │   │   ├── schema.prisma          # DBスキーマ定義
│   │   │   └── migrations/            # マイグレーション履歴（Git管理）
│   │   └── src/
│   │       ├── main.ts                # エントリーポイント（グローバルPrefix: /api）
│   │       ├── app/
│   │       │   └── app.module.ts      # ルートNestJSモジュール
│   │       ├── db/
│   │       │   ├── prisma.service.ts  # PrismaClient DI用サービス（@Global）
│   │       │   └── database.module.ts # DatabaseModule（全モジュールにPrismaを提供）
│   │       ├── features/
│   │       │   ├── admin/
│   │       │   │   ├── jobs/               # 求人CRUD（全バーティカル共通の求人マスタ）
│   │       │   │   ├── occupation-types/   # 職種コードマスタ（全バーティカル共通）
│   │       │   │   ├── prefectures/
│   │       │   │   └── requirement-codes/
│   │       │   ├── auth/                   # 一般職バーティカル用 LINEログイン（POST /api/auth/line）
│   │       │   ├── user/
│   │       │   │   ├── diagnosis/          # 一般職の診断ロジック（ルールベーススコアリング）
│   │       │   │   ├── jobs/                # 一般職の求人マッチング（occupation_type コードで絞り込み）
│   │       │   │   └── users/               # GET /api/users/me（JWT保護）
│   │       │   └── beauty/
│   │       │       ├── diagnosis/          # 美容系の診断ロジック（職種別の役職・売上・エリア係数）
│   │       │       ├── jobs/                # 美容系の求人マッチング（occupation_type コードで絞り込み）
│   │       │       └── auth/                # 美容系専用 LINEログイン（POST /api/beauty/auth/line、beauty_users テーブル）
│   │       ├── middleware/
│   │       │   ├── error-handler.ts
│   │       │   └── jwt.guard.ts       # Authorization: Bearer <JWT> を検証
│   │       ├── decorators/
│   │       │   └── current-user.decorator.ts
│   │       └── repositories/
│   │           └── *.repository(ies).ts  # Prismaクエリ（DBアクセス層）
│   ├── batch/                         # バッチ処理（未使用）
│   ├── scripts/                       # 手動で実行するスクリプト（未使用）
│   └── worker/                        # 重い処理や非同期通信を裏でやる（未使用）
├── docs/
│   └── diagnosis-tree/                # 診断ロジックの設計ドキュメント
├── README.md                          # プロダクト概要（人間向け・簡潔版）
└── CLAUDE.md                          # このファイル。開発ルール詳細（AIエージェント向け）
```

**フロントエンド技術スタック**

- ビルドツール: **Vite**
- フレームワーク: **React + React Router v7**
- スタイリング: **Tailwind CSS v4**（`@tailwindcss/vite` プラグイン）。`beauty-web` は独自CSS変数ベースのデザインシステム（`index.css`）が主体。
- 認証: **LINE LIFF SDK**（`@line/liff`）。LIFF外の通常ブラウザからアクセスした場合はログインをスキップする。
- デプロイ: **Cloudflare Pages**（本番環境）。`user-web` / `admin-web` / `beauty-web` はそれぞれ**別々のCloudflare Pagesプロジェクト**としてデプロイする。
- 計測: **Google Analytics 4**（gtag.js）

**バックエンド技術スタック**

- フレームワーク: **NestJS**
- ORM: **Prisma v7**（`prisma-client` generator / 出力先: `src/generated/prisma/`）
- DB接続: **@prisma/adapter-pg**（PgDriverアダプター経由）
- バリデーション: **class-validator / class-transformer**
- DB: **Supabase PostgreSQL**（全バーティカル共通の単一DB・単一バックエンドサービス）
- 認証: **LINE ID Token検証 + 自前JWT発行**（`jsonwebtoken`）

---

## 🧭 バーティカル（診断アプリ）ごとの方針

このプロジェクトは「年収診断×求人マッチング」という同じ型を、異なる職種セグメントに展開する構造になっている。現在2つのバーティカルが存在する。

| 項目 | 一般職（user-web） | 美容系（beauty-web） |
| --- | --- | --- |
| 対象職種 | 警備・製造・介護・営業 等の幅広い職種 | 美容師・ネイリスト・アイリスト・エステ |
| UXトンマナ | ライト・シンプル | ダーク×ゴールドの専門誌的な世界観 |
| 診断ロジック | `backend/api/src/features/user/diagnosis` | `backend/api/src/features/beauty/diagnosis` |
| 求人マッチング | `backend/api/src/features/user/jobs`（スワイプUI） | `backend/api/src/features/beauty/jobs`（同UXを再スキン） |
| LINE Loginチャネル | 一般職専用チャネル（`LINE_CHANNEL_ID`） | 美容系専用チャネル（`BEAUTY_LINE_CHANNEL_ID`） |
| ユーザーテーブル | `User`（`users`） | `BeautyUser`（`beauty_users`） |

**共有しているもの**：バックエンド（Renderの同一サービス）、DB（同一Supabaseインスタンス）、求人・職種マスタ（`Job` / `OccupationType` / `JobRequirement` / `Prefecture` / `City`）、admin-webによる求人管理画面。

**バーティカルごとに分離しているもの**：診断ロジック、フロントエンドアプリ、Cloudflare Pagesプロジェクト、LINE Loginチャネル、ユーザーテーブル。

**なぜユーザーテーブルだけ分離するのか**：LINEの`line_user_id`（sub）はLINE Loginチャネル単位で発行されるため、チャネルを分けた時点で同一人物でも別IDになる。そのため「テーブルを共有する」ことの重複排除メリットは成立しない。一方、求人・職種マスタはadmin-webで一元管理する方が運用コストが低いため、意図的に共有している。境界線は「実態として分離/共有が合理的な単位」で引く。

**新しいバーティカルを追加する場合**：
1. 上記の表と同じ形で「何を共有し、何を分離するか」を最初に決める
2. フロント: `frontend/<vertical>-web/` を新規作成し、独立したCloudflare Pagesプロジェクトとしてデプロイする
3. バックエンド: `backend/api/src/features/<vertical>/{diagnosis,jobs,auth}/` を作成し、既存の `user`/`beauty` と同じ3層構造・命名パターンに揃える
4. ユーザーを持つ場合は、専用のLINE Loginチャネルと専用のユーザーテーブル（Prismaモデル）を作成する。既存チャネル・既存ユーザーテーブルに相乗りさせない
5. 求人・職種マスタ（`Job`/`OccupationType`等）とadmin-webは既存のものを再利用する。新しいバーティカル専用の求人テーブルは作らない

---

## 🚀 開発サーバーの起動（フロントエンド）

### user-web

```bash
cd frontend/user-web
npm install
npm run dev
```

`.env.local`:
```
VITE_GA_ID=G-XXXXXXXXXX
VITE_LIFF_ID=xxxxxxxxxx-xxxxxxxx
VITE_API_URL=https://<render-service>.onrender.com
```

### beauty-web

```bash
cd frontend/beauty-web
npm install
npm run dev
```

`.env.local`:
```
VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX
VITE_LIFF_ID=xxxxxxxxxx-xxxxxxxx
VITE_API_URL=https://<render-service>.onrender.com
```

> ⚠️ `beauty-web` はGA4測定IDの変数名が `VITE_GA_ID` ではなく **`VITE_GA_MEASUREMENT_ID`**（`user-web`と命名が異なる）。

### admin-web

```bash
cd frontend/admin-web
npm install
npm run dev
```

`.env.local`:
```
VITE_API_URL=https://<render-service>.onrender.com
```

> ⚠️ `VITE_API_URL` が未設定だとリクエストが相対パス（`/api/admin/jobs`）に飛び、HTMLが返って `Unexpected token '<', "<!DOCTYPE "...` エラーになる。

バックエンドAPI（`backend/api`）のローカル起動手順は、本ファイル後半の「NestJS バックエンド開発ルール」章の「バックエンドの起動（ローカル開発）」を参照。

---

## 📱 画面要件（user-web / 一般職バーティカル）

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

### 4. 求人一覧（`/jobs`）

- Tinder風のスワイプUI（右スワイプ=キープ、左スワイプ=スキップ）
- `GET /api/user/jobs?codes=<occupation_type_code,...>` から取得。取得失敗時は `lib/mock-jobs.ts` のモックにフォールバック
- アフィリエイトリンククリック・インプレッションはGAイベントで計測

美容系バーティカル（beauty-web）の画面仕様は、一般職と同じ「診断→結果→求人」の型を踏襲しつつ、質問内容・診断ロジック・デザインは職種特化で別設計になっている（`frontend/beauty-web/src/features/diagnosis/constants/jobs.ts` 参照）。結果画面から `/jobs?jobId=<hair|nail|lash|esthe>` に遷移する。

---

## 🧠 診断ロジック

### 一般職（`backend/api/src/features/user/diagnosis/diagnosis-rules.ts`）

シンプルなルールベース。正確性より**納得感**を優先する設計方針。

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
```

診断ロジックは `POST /api/user/diagnosis` で提供する（フロントは `features/diagnosis/utils/diagnose.ts` からAPIを叩くのみで、ロジックは持たない）。

### 美容系（`backend/api/src/features/beauty/diagnosis/beauty-diagnosis.service.ts`）

職種（美容師/ネイリスト/アイリスト/エステ）ごとに、役職ベース給与・経験年数・売上・資格・エリア相場・給与体系（固定/歩合ハイブリッド/業務委託）を加味した独自の計算式で想定年収を算出する。`POST /api/beauty/diagnosis` で提供。職種候補・質問セットは `frontend/beauty-web/src/features/diagnosis/constants/jobs.ts` にハードコードで定義する。

---

## 🔗 求人マッチング（共通アーキテクチャ）

求人は `Job` / `OccupationType` / `JobOccupationType` テーブルで**全バーティカル共通管理**する（admin-web経由でCRUD）。各バーティカルの診断結果（職種ラベル）は、`OccupationType.code` にマッピングして求人を絞り込む。

例（美容系）：

```typescript
const OCCUPATION_CODES: Record<JobId, string[]> = {
  hair: ['hair_stylist'],
  nail: ['nail_technician'],
  lash: ['eyelash_technician', 'eyebrow_technician'],
  esthe: ['esthetician', 'therapist'],
};
```

新しいバーティカルを追加する際は、既存の `OccupationType` コード体系に合わせるか、必要であれば admin-web 側で新しいコードを追加し、同様のマッピングテーブルを用意する。求人データ自体を複製しない。

---

## 📊 計測実装（必須）

Google Analytics 4 を使い、以下のカスタムイベントを計測する（両バーティカル共通のイベント名）：

| イベント名        | 発火タイミング                     |
| ----------------- | ----------------------------------- |
| `quiz_start`      | 診断開始（職種選択・「無料で診断する」ボタンクリック時） |
| `quiz_complete`   | 全問回答完了・結果画面表示時       |
| `job_link_click`  | 結果画面の求人CTAボタンクリック時（`/jobs` への遷移） |
| `affiliate_click` | 求人一覧内の個別求人（アフィリエイトリンク）クリック時 |

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

- `user-web`: GA4測定IDは `.env.local` の `VITE_GA_ID`。コード内では `import.meta.env.VITE_GA_ID` で参照。
- `beauty-web`: GA4測定IDは `.env.local` の `VITE_GA_MEASUREMENT_ID`（**変数名がuser-webと異なる**）。コード内では `import.meta.env.VITE_GA_MEASUREMENT_ID` で参照。

---

## 🔗 求人リンク（user-web / モック期の名残）

`user-web` の一部モックデータはダミーURLで実装されている。後から差し替えられるよう `features/jobs/lib/mock-jobs.ts` に集約すること。実データはAPI経由（`GET /api/user/jobs`）で取得し、失敗時のみモックにフォールバックする。

---

## 🚫 やらないこと（原則）

- **AIによる診断ロジック**（ルールベースを維持する。LLM等で動的生成しない。理由・係数を説明可能な状態に保つため）
- **過剰なレスポンシブの細かい調整**（スマホで動けばOK。PCレイアウトの作り込みは優先度低）

> 以前は「ログイン・認証機能」「マイページ・履歴保存」も禁止事項だったが、LINE LIFFログイン・マイページ機能は実装済み・現行方針として採用されている（下記「ログイン（LINE LIFF）」参照）。このため両者はこの禁止リストから除外した。
>
> `beauty-web` のようにバーティカル独自の世界観（アニメーション・演出含む）を作り込むこと自体は許容している。過剰な演出でリリース速度を落とさない範囲で判断する。

---

## 🚀 デプロイ方針

### フロントエンド（Cloudflare Pages）

- 開発中は `npm run dev`（Vite）でローカル確認・計測を行う
- 本番は Cloudflare Pages にデプロイ
  - `user-web` / `admin-web` / `beauty-web` は**それぞれ別のCloudflare Pagesプロジェクト**として作成する
  - `npm run build` で各アプリの `dist/` に静的ファイルを出力
  - GitHub の `main` ブランチへの push で自動デプロイされる

> ⚠️ Vercelは使わない

**Cloudflare Pages の Build settings（新規プロジェクト作成時）**

| 項目 | 値 |
| --- | --- |
| Framework preset | `None`（もしくは `Vite`） |
| Build command | `npm run build` |
| Build output directory | `dist` |
| Root directory (Path) | `frontend/user-web` / `frontend/admin-web` / `frontend/beauty-web`（プロジェクトごとに指定） |

### Cloudflare Pages の環境変数設定（必須）

Vite の `import.meta.env.VITE_*` 変数は**ビルド時に埋め込まれる**。`.env.local` は `.gitignore` で除外されているため、Cloudflare Pages のビルドには渡されない。必ず Cloudflare Dashboard の Settings → Environment variables で設定し、リデプロイすること。

| プロジェクト | 変数名 | 内容 |
|---|---|---|
| `user-web` | `VITE_GA_ID` | GA4 測定ID |
| `user-web` | `VITE_LIFF_ID` | LINE LIFF アプリID（一般職チャネル） |
| `user-web` | `VITE_API_URL` | バックエンドAPIのURL |
| `beauty-web` | `VITE_GA_MEASUREMENT_ID` | GA4 測定ID（**変数名がuser-webと異なる**） |
| `beauty-web` | `VITE_LIFF_ID` | LINE LIFF アプリID（美容系チャネル。user-webとは別チャネル） |
| `beauty-web` | `VITE_API_URL` | バックエンドAPIのURL |
| `admin-web` | `VITE_API_URL` | バックエンドAPIのURL |

> ⚠️ `VITE_API_URL` が未設定の場合、`API_BASE` が空文字になりリクエストが相対パス（`/api/admin/jobs`）に飛ぶ。Cloudflare Pages はその URL に対してHTMLを返すため、`Unexpected token '<', "<!DOCTYPE "...` エラーになる。

> ⚠️ `VITE_LIFF_ID` が未設定の場合、`initLiffAndLogin()` が即座に `null` を返す。LINEログインが行われずユーザーがDBに登録されない。エラーは表示されないため気づきにくい。

> ⚠️ LINE Developers Console の対象チャネル → LIFFタブ → Scopes で **`openid` を有効にしないと `liff.getIDToken()` が `null` を返す**。ユーザーはログインできても `users`/`beauty_users` テーブルに登録されない。

> ⚠️ バーティカルごとに**別のLINE Loginチャネル**を使うこと。既存チャネルに新しいLIFFアプリを追加してはいけない（`line_user_id`の名前空間が混ざり、ユーザーテーブル分離の意味がなくなる）。

---

## 🔐 ログイン（LINE LIFF）

- ログイン方式は **LINE LIFF** のみ。従来型のID/パスワード認証は実装しない。
- LIFFアプリ内（LINEアプリ経由）でアクセスした場合は自動でLINEログインを試みる。**通常のブラウザから直接アクセスした場合はログインをスキップし**、未ログインでも診断・求人閲覧はできる。
- フロント: `lib/auth.ts` の `initLiffAndLogin()` が `liff.init()` → `liff.getIDToken()` → バックエンドへPOSTの流れを実行し、返ってきたJWTを `localStorage` に保存する。
- バックエンド:
  - `POST /api/auth/line`（一般職）: `AuthService.lineLogin()` が LINEのIDトークンを `https://api.line.me/oauth2/v2.1/verify` に投げて `LINE_CHANNEL_ID` を `client_id` として検証し、`line_user_id` で `User` を `findOrCreate` してJWTを発行する。
  - `POST /api/beauty/auth/line`（美容系）: 同様のフローを `BEAUTY_LINE_CHANNEL_ID` と `BeautyUser` テーブルで行う。
  - JWTは `JWT_SECRET` で署名（`{ userId }`、30日有効）。全バーティカルで同じ `JWT_SECRET` を使ってよい（ペイロードの `userId` がどちらのテーブルの行を指すかは、叩いているエンドポイントの文脈で決まる）。
- 保護されたエンドポイントは `JwtGuard`（`middleware/jwt.guard.ts`）で `Authorization: Bearer <token>` を検証し、`CurrentUserId` デコレーターで `userId` を取得する。

---

## ✅ 目安KPI

| 指標                             | 目安値      |
| -------------------------------- | ----------- |
| 診断完了率（start→complete）     | 50%以上 |
| 求人クリック率（complete→click） | 20%以上 |

バーティカルごとに個別に計測・評価する（一般職と美容系で反応が違って当然のため、合算しない）。数値を大きく下回る場合は、質問数・選択肢・訴求の見直しを検討する材料として使う。

---

## 💡 開発時の判断基準

迷ったときはこの順で判断する：

1. **KPI（診断完了・求人クリック）の向上につながるか**
2. **スマホで3秒で意図が伝わるか**
3. **既存バーティカルとインフラを不必要に分離していないか**（求人・職種マスタ、admin-web、バックエンド/DBは原則共有する。ユーザー識別のようにチャネル起因で分離が必須なものだけ分離する）

---

# NestJS バックエンド開発ルール

## バックエンドの起動（ローカル開発）

```bash
cd backend/api
npm run start:dev   # ポート3000で起動（ts-node）
```

初回セットアップは `backend/api/.env` を作成：

```env
DATABASE_URL=postgresql://<user>:<password>@<host>:5432/<db>?pgbouncer=true
DIRECT_URL=postgresql://<user>:<password>@<host>:5432/<db>
LINE_CHANNEL_ID=xxxxxxxxxx          # 一般職バーティカル用 LINE Login チャネルID
BEAUTY_LINE_CHANNEL_ID=xxxxxxxxxx   # 美容系バーティカル用 LINE Login チャネルID
JWT_SECRET=xxxxxxxxxx
```

Prismaクライアント生成（スキーマ変更後も必要）：

```bash
cd backend/api
npx prisma generate
```

## バックエンドのデプロイ（Render）

バックエンドAPIは **Render** にデプロイする（全バーティカル共通の単一サービス）。

### Renderの設定値

| 設定項目 | 値 |
|---|---|
| Root Directory | `backend/api` |
| Build Command | `npm install && npm run build && npx prisma generate` |
| Start Command | `npm run start` |
| Environment | Node |

### Renderで設定する環境変数

| 変数名 | 説明 |
|---|---|
| `DATABASE_URL` | Supabase の接続URL（pgbouncer経由） |
| `DIRECT_URL` | Supabase の直接接続URL（マイグレーション用） |
| `NODE_ENV` | `production` |
| `LINE_CHANNEL_ID` | 一般職バーティカル用 LINE Login チャネルID（LINEトークン検証用） |
| `BEAUTY_LINE_CHANNEL_ID` | 美容系バーティカル用 LINE Login チャネルID（LINEトークン検証用） |
| `JWT_SECRET` | JWTトークン署名用のシークレットキー（全バーティカル共通） |

### デプロイ時の注意

- **マイグレーションは Render のビルドコマンドに含めない**（CLAUDE.mdのDBルール参照）
- **Render 無料プランはスリープする**: 一定時間アクセスがないとサービスがスリープし、復帰時の最初のリクエストにHTMLを返す。フロントエンドでJSON以外のレスポンスが来た場合は「サーバーが起動中です」と表示して再試行ボタンを出す実装で対処済み。継続利用時は有料プランへのアップグレードを検討すること。
- 本番マイグレーションはデプロイ後に手動で実行する：

```bash
# Render の Shell または ローカルから DIRECT_URL を使って実行
cd backend/api
npx prisma migrate deploy
```

- スキーマ変更時は `npx prisma generate` がビルドコマンドに含まれているため、生成済みクライアント（`src/generated/prisma/`）は `.gitignore` に追加して Git 管理しない。

## 3層アーキテクチャのルール

バックエンドは必ず以下の3層構造で実装する。

```
Controller → Service → Repository → Supabase PostgreSQL
```

| 層 | ファイル | やること | やらないこと |
|---|---|---|---|
| Controller | `*.controller.ts` | HTTPルーティング、DTOでリクエスト受付 | ビジネスロジック・DBアクセス |
| Service | `*.service.ts` | ビジネスロジック、Repositoryの呼び出し | Prismaクエリを直接書く |
| Repository | `repositories/*.repository(ies).ts` | Prismaクエリ、DBアクセスの集約 | HTTPの概念を持ち込む |

DTOは `*.schema.ts` にclass-validatorデコレーターで定義する。
NestJSモジュールの定義（providers/controllersの登録）は `*.routes.ts` に書く。

バーティカル別の機能は `features/<vertical>/<機能>/` に配置する（例: `features/beauty/jobs/`）。`repositories/` はバーティカルをまたいだ共通配置とし、ファイル名に `<vertical>-<機能>.repository.ts` のようにバーティカル名を含める。

## 新機能の追加パターン

新しいAPIエンドポイントを追加する際は以下の手順に従う。

1. `src/features/<vertical>/<機能>/` にフォルダを作成（管理者向けなら `admin`、一般職なら `user`、美容系なら `beauty`）
2. `<機能>.schema.ts` → class-validatorで DTOクラスを定義（必須フィールドには `!`）
3. `src/repositories/<vertical>-<機能>.repository.ts` → `@Injectable()` クラス、Prismaクエリを記述
4. `<機能>.service.ts` → Repositoryをコンストラクタ注入してロジックを実装
5. `<機能>.controller.ts` → Serviceをコンストラクタ注入してエンドポイントを定義
6. `<機能>.routes.ts` → `@Module({ controllers: [...], providers: [...] })` で登録
7. `src/app/app.module.ts` の `imports` にモジュールを追加

## PrismaServiceの使い方

`DatabaseModule` が `@Global()` のため、各モジュールでimportせずにPrismaServiceをそのまま注入できる。

```typescript
// repositories 内での使い方
@Injectable()
export class SomeRepository {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.job.findMany(); // モデル名はスキーマのmodel名をcamelCaseにしたもの
  }
}
```

## 実装済みAPIエンドポイント

| メソッド | パス | 説明 |
|---|---|---|
| `GET` | `/api/admin/jobs` | 求人一覧取得（job_requirements含む） |
| `POST` | `/api/admin/jobs` | 求人追加（job_requirements同時作成可） |
| `GET` | `/api/admin/occupation-types` | 職種コード一覧取得 |
| `POST` | `/api/admin/occupation-types` | 職種コード追加 |
| `DELETE` | `/api/admin/occupation-types/:id` | 職種コード削除 |
| `GET` | `/api/admin/prefectures` | 都道府県一覧取得 |
| `GET` | `/api/admin/requirement-codes` | 要件コード一覧取得 |
| `POST` | `/api/auth/line` | 一般職バーティカルのLINEログイン（`User`テーブル） |
| `GET` | `/api/users/me` | ログイン中の一般職ユーザー情報取得（JWT保護） |
| `POST` | `/api/user/diagnosis` | 一般職の診断（ルールベーススコアリング） |
| `GET` | `/api/user/jobs?codes=<code,...>` | 一般職の求人マッチング（occupation_typeコードで絞り込み） |
| `POST` | `/api/beauty/diagnosis` | 美容系の診断（職種別計算式） |
| `GET` | `/api/beauty/jobs?jobId=<hair\|nail\|lash\|esthe>` | 美容系の求人マッチング（jobIdをoccupation_typeコードにマッピングして絞り込み） |
| `POST` | `/api/beauty/auth/line` | 美容系バーティカルのLINEログイン（`BeautyUser`テーブル） |

## Prisma v7 特有の注意点

- **クライアント生成先**: `src/generated/prisma/`（`index.ts` なし）
  - importは `'../generated/prisma/client'` と `/client` まで指定すること
- **DB接続**: `@prisma/adapter-pg` を使う（Prisma v7はDriverAdapterが必須）
- **`PrismaClient` は extends不可**: `PrismaService` は extends ではなく compositionパターンで実装
  - モデルアクセサは `get job()` 等のgetterで公開する

---

# Supabase / Database 開発ルール

このプロジェクトでは、Database として Supabase PostgreSQL を使用する。全バーティカルで単一のDBインスタンスを共有する。

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
frontend/user-web, frontend/admin-web, frontend/beauty-web
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
frontend/beauty-web
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

### AIエージェント（Claude等）の役割範囲

DBスキーマを変更する際、AIエージェントは **`schema.prisma` の編集まで**を担当範囲とする。以下はユーザー（開発者）が手動で行うため、AIエージェントは実行しない。

- `npx prisma migrate dev` の実行（マイグレーションファイルの生成・ローカル/開発DBへの適用）
- `npx prisma migrate deploy` の実行（本番DBへの適用）
- マイグレーション関連ファイルの `git add` / `git commit` / `git push`

理由：スキーマ変更はDBに対する破壊的操作になりうるため、実行タイミング・対象環境をユーザー自身がコントロールする。

### スキーマ変更の手順

マイグレーションは「ローカルで作成 → GitHub に push → 本番で適用」の3ステップで行う。**Step 1〜3はすべてユーザーが手動で実行する**（AIエージェントは1の `schema.prisma` 編集のみ担当）。

**Step 1: ローカルでマイグレーションを作成する**

1. `backend/api/prisma/schema.prisma` を編集する（ここまでAIエージェントが担当可）
2. `backend/api` ディレクトリで以下を実行する（ここから先はユーザーが手動で実行）

```bash
cd backend/api
npx prisma migrate dev --name <変更内容を表す名前>
```

例：`npx prisma migrate dev --name add_beauty_users`

これにより `backend/api/prisma/migrations/` にマイグレーションファイルが生成され、`DIRECT_URL` で指定したDB（通常はローカル/開発用のSupabaseプロジェクト）に即座に適用される。

**Step 2: GitHub に push する**

生成されたマイグレーションファイルを Git にコミットして GitHub に push する。

```bash
git add backend/api/prisma/
git commit -m "add migration: <変更内容>"
git push
```

> ⚠️ マイグレーションファイルを push してからでないと、本番環境で `migrate deploy` を実行できない。

**Step 3: 本番（リモート）DBにマイグレーションを適用する**

本番サーバー、またはローカルから `DIRECT_URL` を本番Supabaseの接続情報に向けた状態で以下を実行する。

```bash
cd backend/api
npx prisma migrate deploy
```

`migrate deploy` は未適用のマイグレーションのみを順番に適用する（`migrate dev` と違い、スキーマ差分からの新規生成は行わない）。Renderの場合はダッシュボードの Shell からこのコマンドを実行する。

### Prisma Client の再生成

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
* `.env` ファイルを GitHubにコミットしない。
* 管理者操作は必ず `backend/api` 経由で行う。
* ユーザーの診断回答・診断結果・クリックログの保存も `backend/api` 経由で行う。
* DBアクセスは Prisma を通して行う。
* DB操作は Repository / Domain 層に集約し、Single Source of Truth を保つ。
* バーティカルごとに分離した LINE Login チャネル・ユーザーテーブルを、他バーティカルのコードから直接参照しない（例: `features/user/*` から `BeautyUser` を参照しない）。
