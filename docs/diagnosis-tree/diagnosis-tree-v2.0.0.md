# 診断ツリー v2.0.0

> **変更点（v1.0.0 → v2.0.0）**
> - 適職候補を44種の職種マスタから動的に選択するよう変更
> - 選択ロジック：`jobLevel1 × 潜在年収` をメイン軸に、英語力・勤務先タイプを補正
> - `SuggestedJob` に `code`（内部識別）と `title`（表示名 = label）を追加

---

## Part 1 ── 質問フロー（スコア計算入力）

```mermaid
flowchart LR
    START([診断開始]) --> Q1

    %% ── カテゴリ0：プロフィール ──
    Q1["生まれ年\n1990年以前 / 1991〜1995年\n1996〜2000年 / 2001年以降"]
    Q1 --> Q2

    Q2["最終学歴\n高校 / 専門学校 / 短大\n大学 / 大学院"]
    Q2 -->|高校 / 専門学校 / 短大| Q4
    Q2 -->|大学 / 大学院| Q3

    Q3["出身校の水準 ★条件付き\n旧帝大・早慶 / MARCH・関関同立\n日東駒専・産近甲龍 / その他の大学"]
    Q3 --> Q4

    Q4["卒業年\n2024年以降 / 2020〜2023年\n2016〜2019年 / 2011〜2015年 / 2010年以前"]
    Q4 --> Q5

    %% ── カテゴリ1：職場環境 ──
    Q5["勤務先のタイプ\n外資系大手 / 国内大手上場企業\n中堅・ベンチャー上場 / 非上場ベンチャー\n中小企業・その他"]
    Q5 --> Q6

    Q6["雇用形態\n正社員 / 契約社員 / 派遣社員\nフリーランス / その他"]
    Q6 --> Q7

    Q7["関わっている業界\nIT/インターネット/通信 / 金融/保険\nコンサルティング / メーカー/製造業\n商社/卸売 / その他"]
    Q7 -->|IT/インターネット/通信| Q8
    Q7 -->|その他の業界| Q9

    Q8["より具体的な領域 ★条件付き\nSaaS/クラウドサービス / フィンテック/ブロックチェーン\nAI/機械学習 / ECプラットフォーム\nゲーム/エンタメ / その他IT"]
    Q8 --> Q9

    Q9["従業員数\n10人未満 / 10〜49人 / 50〜299人\n300〜999人 / 1000〜2999人 / 3000人以上"]
    Q9 --> Q10

    Q10["現在の役職\n代表/役員 / 部長/マネージャー\n課長/チームリーダー / 主任/リーダー / 役職なし"]
    Q10 --> Q11

    Q11["現在の年収\n〜300万 / 300〜400万 / 400〜500万\n500〜600万 / 600〜800万 / 800万〜"]
    Q11 --> Q12

    %% ── カテゴリ2：職種・経験 ──
    Q12["主な経験職種\n営業 / マーケティング/企画 / ITエンジニア\nコンサルタント / 管理部門 / その他"]
    Q12 -->|営業| Q13a
    Q12 -->|ITエンジニア| Q13b
    Q12 -->|その他の職種| Q13c

    Q13a["より具体的な職種（営業）\n法人営業（大手向け）/ 法人営業（中小向け）\n個人営業 / 代理店営業\nインサイドセールス / その他営業"]
    Q13b["より具体的な職種（エンジニア）\nバックエンドエンジニア / フロントエンドエンジニア\nインフラ/SRE / 機械学習/AI / その他エンジニア"]
    Q13c["より具体的な職種（その他）\n企画/戦略 / マーケティング\n経営管理/財務 / コンサルティング / その他"]

    Q13a --> Q14
    Q13b --> Q14
    Q13c --> Q14

    Q14["職種の経験年数\n1年未満 / 1〜2年 / 2〜4年 / 4年以上"]
    Q14 -->|営業以外| Q20
    Q14 -->|営業| Q15

    %% ── カテゴリ3：実績（営業のみ） ──
    Q15["担当顧客の規模 ★営業のみ\n個人・小規模（〜50名）/ 中小企業（51〜300名）\n中堅企業（301〜1000名）/ 大企業（1001〜5000名）\nエンタープライズ（5000名〜）"]
    Q15 --> Q16

    Q16["営業目標の達成率 ★営業のみ\n60%未満 / 60〜80% / 80〜100%\n100〜120% / 120%以上"]
    Q16 --> Q17

    Q17["組織内の営業成績 ★営業のみ\n下位（60%以下）/ 中位（40〜60%）\n上位（20〜40%）/ 上位（10〜20%）/ トップ（10%以内）"]
    Q17 --> Q18

    Q18["取り扱い商材 ★営業のみ\nクラウド/SaaS / 人材/採用サービス\n広告/マーケティング / 物流/インフラ / その他"]
    Q18 --> Q19

    Q19["取引商材の単価 ★営業のみ\n10万円未満 / 10〜100万\n100万〜1000万 / 1000万〜1億 / 1億以上"]
    Q19 --> Q20

    %% ── カテゴリ4：スキル ──
    Q20["マネジメント経験\nなし / 1年未満 / 1〜2年 / 2年以上"]
    Q20 --> Q21

    Q21["英語力\nなし/初級 / 日常会話レベル\nビジネス会話レベル / ネイティブ/流暢"]
    Q21 --> SCORE

    %% ── ティア判定 ──
    SCORE{スコア計算\n現在年収 × 倍率}

    SCORE -->|潜在年収 800万〜| R1["🚀 ハイポテンシャル層\nランク S｜市場トップクラス型"]
    SCORE -->|潜在年収 650〜800万| R2["💼 即戦力ミドル層\nランク A｜30代ジャンプ型"]
    SCORE -->|潜在年収 500〜650万| R3["📈 標準的キャリア層\nランク B｜着実成長型"]
    SCORE -->|潜在年収 400〜500万| R4["🌱 成長余地あり層\nランク B｜経験積み上げ型"]
    SCORE -->|潜在年収 〜400万| R5["🔄 キャリア再設計層\nランク B｜方向転換型"]

    R1 & R2 & R3 & R4 & R5 --> OCC([Part 2 へ\n適職選択])

    %% ── スタイル ──
    style START fill:#4f46e5,color:#fff,stroke:none
    style OCC fill:#0891b2,color:#fff,stroke:none
    style SCORE fill:#d97706,color:#fff,stroke:none
    style Q3 fill:#fef3c7,stroke:#d97706
    style Q8 fill:#fef3c7,stroke:#d97706
    style Q13a fill:#dbeafe,stroke:#3b82f6
    style Q13b fill:#dbeafe,stroke:#3b82f6
    style Q13c fill:#dbeafe,stroke:#3b82f6
    style Q15 fill:#fee2e2,stroke:#ef4444
    style Q16 fill:#fee2e2,stroke:#ef4444
    style Q17 fill:#fee2e2,stroke:#ef4444
    style Q18 fill:#fee2e2,stroke:#ef4444
    style Q19 fill:#fee2e2,stroke:#ef4444
    style R1 fill:#7c3aed,color:#fff,stroke:none
    style R2 fill:#1d4ed8,color:#fff,stroke:none
    style R3 fill:#0369a1,color:#fff,stroke:none
    style R4 fill:#0f766e,color:#fff,stroke:none
    style R5 fill:#6b7280,color:#fff,stroke:none
```

---

## Part 2 ── 適職選択ロジック（v2.0.0 NEW）

> 職種マスタ44種の中から `jobLevel1 × 潜在年収` を軸に3件を選択。
> 英語力がビジネス以上 かつ 潜在年収650万以上の場合は3枠目を「外資系」に差し替え。

```mermaid
flowchart TD
    OCC_IN([適職選択開始\ntierId + jobLevel1 + 潜在年収 + 英語力]) --> JL1

    JL1{jobLevel1}

    %% ── ITエンジニア ──
    JL1 -->|ITエンジニア| IT_CHK{潜在年収\n650万以上?}
    IT_CHK -->|Yes| IT_H["① ITエンジニア\n② ベンチャー・スタートアップ\n③ 外資系 or コンサル"]
    IT_CHK -->|No| IT_L["① ITエンジニア\n② 在宅ワーク\n③ マーケティング・クリエイティブ"]

    %% ── コンサルタント ──
    JL1 -->|コンサルタント| CONS_CHK{英語力 or\n外資系大手?}
    CONS_CHK -->|Yes| CONS_EN["① コンサル\n② M&A\n③ 外資系"]
    CONS_CHK -->|No| CONS_NO["① コンサル\n② M&A\n③ ベンチャー・スタートアップ"]

    %% ── 営業 ──
    JL1 -->|営業| SALES_CHK{潜在年収}
    SALES_CHK -->|650万〜| SALES_H["① 営業\n② 不動産\n③ 人材"]
    SALES_CHK -->|500〜650万| SALES_M["① 営業\n② 不動産\n③ タクシードライバー"]
    SALES_CHK -->|〜500万| SALES_L["① 営業\n② トラックドライバー\n③ 工場・製造業"]

    %% ── マーケティング/企画 ──
    JL1 -->|マーケティング/企画| MKT_CHK{潜在年収\n500万以上?}
    MKT_CHK -->|Yes| MKT_H["① マーケティング・クリエイティブ\n② ベンチャー・スタートアップ\n③ コンサル"]
    MKT_CHK -->|No| MKT_L["① マーケティング・クリエイティブ\n② 在宅ワーク\n③ バックオフィス・事務"]

    %% ── 管理部門 ──
    JL1 -->|管理部門| ADM_CHK{潜在年収\n500万以上?}
    ADM_CHK -->|Yes| ADM_H["① バックオフィス・事務\n② 人材\n③ 税理士"]
    ADM_CHK -->|No| ADM_L["① バックオフィス・事務\n② 介護\n③ 工場・製造業"]

    %% ── その他 ──
    JL1 -->|その他| OTHER_CHK{潜在年収}
    OTHER_CHK -->|650万〜| OTHER_H["① 営業\n② 不動産\n③ 人材"]
    OTHER_CHK -->|400〜650万| OTHER_M["① 工場・製造業\n② タクシードライバー\n③ トラックドライバー"]
    OTHER_CHK -->|〜400万| OTHER_L["① 工場・製造業\n② 介護\n③ 警備員"]

    %% ── 英語ボーナス補正 ──
    IT_H & IT_L & CONS_EN & CONS_NO & SALES_H & SALES_M & SALES_L & MKT_H & MKT_L & ADM_H & ADM_L & OTHER_H & OTHER_M & OTHER_L --> ENG_CHK

    ENG_CHK{"英語力\nビジネス以上?\n× 潜在年収650万〜?"}
    ENG_CHK -->|Yes かつ ③が外資系でない| ENG_REPLACE["③ を 外資系 に差し替え"]
    ENG_CHK -->|No or 外資系すでに含む| ENG_KEEP[そのまま]

    ENG_REPLACE & ENG_KEEP --> RESULT([結果画面\n求人CTA表示])

    %% ── スタイル ──
    style OCC_IN fill:#0891b2,color:#fff,stroke:none
    style RESULT fill:#059669,color:#fff,stroke:none
    style JL1 fill:#d97706,color:#fff,stroke:none
    style IT_CHK fill:#7c3aed,color:#fff,stroke:none
    style CONS_CHK fill:#7c3aed,color:#fff,stroke:none
    style SALES_CHK fill:#7c3aed,color:#fff,stroke:none
    style MKT_CHK fill:#7c3aed,color:#fff,stroke:none
    style ADM_CHK fill:#7c3aed,color:#fff,stroke:none
    style OTHER_CHK fill:#7c3aed,color:#fff,stroke:none
    style ENG_CHK fill:#b45309,color:#fff,stroke:none
    style IT_H fill:#dbeafe,stroke:#3b82f6
    style IT_L fill:#dbeafe,stroke:#3b82f6
    style CONS_EN fill:#ede9fe,stroke:#7c3aed
    style CONS_NO fill:#ede9fe,stroke:#7c3aed
    style SALES_H fill:#dcfce7,stroke:#16a34a
    style SALES_M fill:#dcfce7,stroke:#16a34a
    style SALES_L fill:#dcfce7,stroke:#16a34a
    style MKT_H fill:#fef9c3,stroke:#ca8a04
    style MKT_L fill:#fef9c3,stroke:#ca8a04
    style ADM_H fill:#fce7f3,stroke:#db2777
    style ADM_L fill:#fce7f3,stroke:#db2777
    style OTHER_H fill:#ffedd5,stroke:#ea580c
    style OTHER_M fill:#ffedd5,stroke:#ea580c
    style OTHER_L fill:#ffedd5,stroke:#ea580c
    style ENG_REPLACE fill:#0369a1,color:#fff,stroke:none
    style ENG_KEEP fill:#6b7280,color:#fff,stroke:none
```

---

## 職種マスタ一覧（44種）

| code | label |
|---|---|
| `apparel_cosmetics` | アパレル・コスメ |
| `security_guard` | 警備員 |
| `factory_manufacturing` | 工場・製造業 |
| `tutor` | 塾講師 |
| `call_center` | コールセンター |
| `resort_jobs` | リゾートバイト |
| `girls_bar_concept_cafe` | ガールズバー・コンカフェ |
| `caregiving` | 介護 |
| `chat_hostess` | チャットレディー |
| `food_beverage` | 飲食 |
| `taxi_driver` | タクシードライバー |
| `truck_driver` | トラックドライバー |
| `remote_work` | 在宅ワーク |
| `marketing_creative` | マーケティング・クリエイティブ |
| `housekeeping` | 家事代行 |
| `consulting` | コンサル |
| `construction` | 建設 |
| `real_estate` | 不動産 |
| `sales_reception` | 販売・受付 |
| `supermarket_fresh_food` | スーパー・生鮮 |
| `translation` | 翻訳 |
| `back_office_administration` | バックオフィス・事務 |
| `venture_startup` | ベンチャー・スタートアップ |
| `it_engineer` | ITエンジニア |
| `ma` | M&A |
| `foreign_affiliated` | 外資系 |
| `sales` | 営業 |
| `human_resources` | 人材 |
| `doctor` | 医師 |
| `nurse` | 看護師 |
| `pharmacist` | 薬剤師 |
| `physical_therapist` | 理学療法士 |
| `dentist` | 歯科医師 |
| `dental_hygienist` | 歯科衛生士 |
| `hair_stylist` | 美容師 |
| `seitai_therapist` | 整体師 |
| `certified_tax_accountant` | 税理士 |
| `certified_public_accountant` | 公認会計士 |
| `nail_technician` | ネイリスト |
| `eyelash_technician` | アイリスト |
| `eyebrow_technician` | アイブロウリスト |
| `esthetician` | エステティシャン |
| `therapist` | セラピスト |
