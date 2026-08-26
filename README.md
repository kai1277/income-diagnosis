# 推定年収診断プラットフォーム

## ⚡ このプロジェクトについて

「あなたの推定年収は◯◯万円」という診断→求人マッチングの型を、複数の職種バーティカルに展開できるプロダクト群。

現在は本格開発・リリースフェーズにあり、以下を継続的に伸ばすことを目標にする：

- 診断がクリック・完了されること
- 結果画面から求人がクリックされること
- 提示した職種提案がユーザーに受け入れられること

診断ロジックはルールベースを採用する（LLM等による動的生成は行わない。理由・係数を説明可能な状態に保つため）。

> 美容系バーティカル（美容師/ネイリスト/アイリスト/エステ向け診断アプリ）は別リポジトリに移管済みのため、このリポジトリには含まれない。

---

## 🗂 プロジェクト構成

```
/
├── frontend/
│   ├── user-web/                      # 一般職・ブルーカラー系 診断アプリ（Cloudflare Pages: 個別プロジェクト）
│   │   ├── src/
│   │   │   ├── main.tsx                   # エントリーポイント（GA4初期化）
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
│   │   ├── .env.local                     # VITE_GA_ID, VITE_LIFF_ID, VITE_API_URL
│   │   └── vite.config.ts
│   │
│   └── admin-web/                     # 管理画面（求人・職種・都道府県・要件コードのCRUD、Cloudflare Pages: 個別プロジェクト）
│
├── backend/
│   ├── api/                           # NestJS APIサーバー（ポート3000、プレフィックス /api、Renderにデプロイ）
│   │   ├── prisma/
│   │   │   ├── schema.prisma          # DBスキーマ（下記「DBスキーマ概要」参照）
│   │   │   └── migrations/            # マイグレーション履歴（Git管理・手動実行）
│   │   └── src/
│   │       ├── main.ts
│   │       ├── app/app.module.ts      # 全モジュールを imports に登録
│   │       ├── db/prisma.service.ts, database.module.ts（@Global）
│   │       ├── middleware/jwt.guard.ts, error-handler.ts
│   │       ├── decorators/current-user.decorator.ts
│   │       ├── features/
│   │       │   ├── admin/
│   │       │   │   ├── jobs/               # 求人CRUD（全バーティカル共通の求人マスタ）
│   │       │   │   ├── occupation-types/   # 職種コードマスタ（全バーティカル共通）
│   │       │   │   ├── prefectures/
│   │       │   │   └── requirement-codes/
│   │       │   ├── auth/                   # 一般職バーティカル用 LINEログイン（POST /api/auth/line）
│   │       │   └── user/
│   │       │       ├── diagnosis/          # 一般職の診断ロジック（ルールベーススコアリング）
│   │       │       ├── jobs/                # 一般職の求人マッチング（occupation_type コードで絞り込み）
│   │       │       └── users/               # GET /api/users/me（JWT保護）
│   │       └── repositories/               # Prismaクエリの集約（*.repository.ts）
│   ├── batch/                          # バッチ処理（未使用）
│   ├── scripts/                        # 手動実行スクリプト（未使用）
│   └── worker/                         # 非同期処理（未使用）
├── docs/
│   └── diagnosis-tree/                 # 診断ロジックの設計ドキュメント
└── CLAUDE.md                           # このリポジトリの開発ルール（AIエージェント向け・詳細版）
```

**フロントエンド技術スタック**

- ビルドツール: **Vite**
- フレームワーク: **React + React Router v7**
- スタイリング: **Tailwind CSS v4**（`@tailwindcss/vite`）
- 認証: **LINE LIFF SDK**（`@line/liff`）。LIFF外の通常ブラウザからアクセスした場合はログインをスキップし、未ログインでも診断・求人閲覧はできる。
- デプロイ: **Cloudflare Pages**（本番）。`user-web` / `admin-web` はそれぞれ**別々のCloudflare Pagesプロジェクト**としてデプロイする（モノレポ内の各ディレクトリを Root directory に指定）。
- 計測: **Google Analytics 4**（gtag.js）

**バックエンド技術スタック**

- フレームワーク: **NestJS**（3層アーキテクチャ、詳細はCLAUDE.md参照）
- ORM: **Prisma v7**（`prisma-client` generator / 出力先: `backend/api/src/generated/prisma/`）
- DB接続: **@prisma/adapter-pg**
- バリデーション: **class-validator / class-transformer**
- DB: **Supabase PostgreSQL**
- 認証: **LINE ID Token検証 + 自前JWT発行**（`jsonwebtoken`）

---

## 🧭 バーティカル（診断アプリ）ごとの方針

このプロジェクトは「年収診断×求人マッチング」という同じ型を、異なる職種セグメントに展開できる構造になっている。現在実装されているバーティカルは一般職（`user-web`）のみ。

新しいバーティカルを追加する場合は、「何を共有し、何を分離するか」を最初に決めてから実装すること。目安：

- **共有してよいもの**：バックエンド（Renderの同一サービス）、DB（同一Supabaseインスタンス）、求人・職種マスタ（`Job` / `OccupationType` / `JobRequirement` / `Prefecture` / `City`）、admin-webによる求人管理画面
- **バーティカルごとに分離すべきもの**：診断ロジック、フロントエンドアプリ、Cloudflare Pagesプロジェクト、LINE Loginチャネル、ユーザーテーブル

**なぜユーザーテーブルは分離するのか**：LINEの`line_user_id`（sub）はLINE Loginチャネル単位で発行されるため、チャネルを分けた時点で同一人物でも別IDになる。そのため「テーブルを共有する」ことの重複排除メリットは成立しない。一方、求人・職種マスタはadmin-webで一元管理する方が運用コストが低いため、意図的に共有している。境界線は「実態として分離/共有が合理的な単位」で引く。

---

## 🚀 開発サーバーの起動

### フロントエンド（一般職: user-web）

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

### 管理画面（admin-web）

```bash
cd frontend/admin-web
npm install
npm run dev
```

`.env.local`:

```
VITE_API_URL=https://<render-service>.onrender.com
```

> ⚠️ この変数が未設定だとリクエストが相対パス `/api/admin/jobs` に飛び、HTMLが返ってJSONパースエラーになる。

### バックエンド API

```bash
cd backend/api
npm install
npm run start:dev   # ts-node で起動（ポート3000）
```

初回は `.env` を作成：

```env
DATABASE_URL=postgresql://<user>:<password>@<host>:5432/<db>?pgbouncer=true
DIRECT_URL=postgresql://<user>:<password>@<host>:5432/<db>
LINE_CHANNEL_ID=xxxxxxxxxx          # 一般職バーティカル用 LINE Login チャネルID
JWT_SECRET=xxxxxxxxxx
```

Prismaクライアントの生成（スキーマ変更時も必要）：

```bash
cd backend/api
npx prisma generate
```

---

## 🔐 ログイン（LINE LIFF）

- ログイン方式は **LINE LIFF** のみ。従来型のID/パスワード認証は実装しない。
- LIFFアプリ内（LINEアプリ経由）でアクセスした場合は自動でLINEログインを試みる。**通常のブラウザから直接アクセスした場合はログインをスキップし**、未ログインでも診断・求人閲覧はできる（マイページ等ログイン前提の機能のみ利用不可）。
- フロント: `lib/auth.ts` の `initLiffAndLogin()` が `liff.init()` → `liff.getIDToken()` → バックエンドへPOSTの流れを実行し、返ってきたJWTを `localStorage` に保存する。
- バックエンド: `POST /api/auth/line` で LINEのIDトークンをLINE公式エンドポイントに投げて検証し、`line_user_id` で `findOrCreate` した上で自前のJWT（`JWT_SECRET`で署名、30日有効）を返す。
- 保護されたエンドポイントは `JwtGuard`（`middleware/jwt.guard.ts`）で `Authorization: Bearer <token>` を検証する。

> ⚠️ LINE Developers Console の対象チャネル → LIFFタブ → Scopes で **`openid` を有効にしないと** `liff.getIDToken()` が `null` を返し、ログインはできてもユーザーがDBに登録されない（エラー表示なし・気づきにくい）。

> ⚠️ バーティカルを追加する場合は、既存チャネルに相乗りさせず**新しいLINE Loginチャネルを作成**し、対応する `*_LINE_CHANNEL_ID` 環境変数とユーザーテーブルを用意すること（理由は上記「バーティカルごとの方針」参照）。

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

診断ロジックは元々フロントエンド（`frontend/user-web`）にあったが、現在は `backend/api` の `POST /api/user/diagnosis` に移植済み（フロントは `features/diagnosis/utils/diagnose.ts` からAPIを叩くのみ）。

---

## 📊 計測実装（必須）

Google Analytics 4 を使い、以下のカスタムイベントを計測する：

| イベント名        | 発火タイミング                                           |
| ----------------- | -------------------------------------------------------- |
| `quiz_start`      | 診断開始（職種選択・「無料で診断する」ボタンクリック時） |
| `quiz_complete`   | 全問回答完了・結果画面表示時                             |
| `job_link_click`  | 結果画面の求人CTAボタンクリック時（`/jobs` への遷移）    |
| `affiliate_click` | 求人一覧内の個別求人（アフィリエイトリンク）クリック時   |

```typescript
// 計測例（features/jobs/components/job-link.tsx）
const handleClick = () => {
  window.gtag?.('event', 'job_link_click', {
    job_type: jobType,
    destination_url: url,
  });
  window.open(url, '_blank');
};
```

- `user-web`: GA4測定IDは `.env.local` の `VITE_GA_ID`

---

## 🚀 デプロイ方針

### フロントエンド（Cloudflare Pages）

- 開発中は `npm run dev`（Vite）によるローカルホストで動作確認・計測を行う
- 本番は Cloudflare Pages にデプロイ
  - `user-web` / `admin-web` は**それぞれ別のCloudflare Pagesプロジェクト**として作成する
  - `npm run build` で各アプリの `dist/` に静的ファイルを出力
  - GitHub の `main` ブランチへの push で自動デプロイされる

> ⚠️ Vercelは使わない

**Cloudflare Pages の Build settings（新規プロジェクト作成時）**

| 項目                   | 値                                                                   |
| ---------------------- | -------------------------------------------------------------------- |
| Framework preset       | `None`（もしくは `Vite`）                                            |
| Build command          | `npm run build`                                                      |
| Build output directory | `dist`                                                               |
| Root directory (Path)  | `frontend/user-web` / `frontend/admin-web`（プロジェクトごとに指定） |

**環境変数**（Settings → Environment variables で設定し、リデプロイすること。`.env.local` はgit管理外のためビルドに渡らない）

| プロジェクト | 変数名         | 内容                                 |
| ------------ | -------------- | ------------------------------------ |
| `user-web`   | `VITE_GA_ID`   | GA4 測定ID                           |
| `user-web`   | `VITE_LIFF_ID` | LINE LIFF アプリID（一般職チャネル） |
| `user-web`   | `VITE_API_URL` | バックエンドAPIのURL                 |
| `admin-web`  | `VITE_API_URL` | バックエンドAPIのURL                 |

> ⚠️ `VITE_API_URL` が未設定の場合、`API_BASE` が空文字になりリクエストが相対パス（`/api/admin/jobs`等）に飛ぶ。Cloudflare Pages はその URL に対してHTMLを返すため、`Unexpected token '<', "<!DOCTYPE "...` エラーになる。

> ⚠️ `VITE_LIFF_ID` が未設定の場合、`initLiffAndLogin()` が即座に `null` を返す。LINEログインが行われずユーザーがDBに登録されない。エラーは表示されないため気づきにくい。

### バックエンド（Render）

バックエンドAPIは **Render** にデプロイする。

| 設定項目       | 値                                                    |
| -------------- | ----------------------------------------------------- |
| Root Directory | `backend/api`                                         |
| Build Command  | `npm install && npm run build && npx prisma generate` |
| Start Command  | `npm run start`                                       |
| Environment    | Node                                                  |

環境変数：

| 変数名            | 説明                                         |
| ----------------- | -------------------------------------------- |
| `DATABASE_URL`    | Supabase の接続URL（pgbouncer経由）          |
| `DIRECT_URL`      | Supabase の直接接続URL（マイグレーション用） |
| `NODE_ENV`        | `production`                                 |
| `LINE_CHANNEL_ID` | 一般職バーティカル用 LINE Login チャネルID   |
| `JWT_SECRET`      | JWTトークン署名用のシークレットキー          |

> ⚠️ マイグレーションは Render のデプロイ時に自動実行しない。本番マイグレーションは手動で `npx prisma migrate deploy` を実行すること。

> ⚠️ **Render 無料プランのスリープ**: 一定時間アクセスがないとサービスがスリープし、最初のリクエスト時にHTMLを返す（JSONパースエラーの原因）。フロント側でエラーメッセージと「再試行」ボタンを出す実装で対処済み。継続利用する場合は有料プランへのアップグレードを検討すること。

---

## ✅ 目安KPI

| 指標                             | 目安値  |
| -------------------------------- | ------- |
| 診断完了率（start→complete）     | 50%以上 |
| 求人クリック率（complete→click） | 20%以上 |

数値を大きく下回る場合は、質問数・選択肢・訴求の見直しを検討する材料として使う。

---

## 💡 開発時の判断基準

迷ったときはこの順で判断する：

1. **KPI（診断完了・求人クリック）の向上につながるか**
2. **スマホで3秒で意図が伝わるか**
3. **既存バーティカルとインフラを不必要に分離していないか**（求人・職種マスタ、admin-web、バックエンド/DBは原則共有する。ユーザー識別のようにチャネル起因で分離が必須なものだけ分離する）

---

## 🗄 バックエンドアーキテクチャ

3層構造・実装済みAPIエンドポイント・新機能追加パターン・Prismaの使い方・DB運用ルール・Supabaseセキュリティ設定などの詳細は **`CLAUDE.md`** を参照。README.mdでは概要のみを扱う。
