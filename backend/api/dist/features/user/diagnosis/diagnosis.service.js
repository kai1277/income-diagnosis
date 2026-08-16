"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DiagnosisService = void 0;
const common_1 = require("@nestjs/common");
const diagnosis_rules_1 = require("./diagnosis-rules");
let DiagnosisService = class DiagnosisService {
    computeMaxScore(answers) {
        let max = diagnosis_rules_1.MAX_SCORES.birthYear +
            diagnosis_rules_1.MAX_SCORES.education +
            diagnosis_rules_1.MAX_SCORES.graduationYear +
            diagnosis_rules_1.MAX_SCORES.companyType +
            diagnosis_rules_1.MAX_SCORES.employmentType +
            diagnosis_rules_1.MAX_SCORES.industryLevel1 +
            diagnosis_rules_1.MAX_SCORES.companySize +
            diagnosis_rules_1.MAX_SCORES.position +
            diagnosis_rules_1.MAX_SCORES.currentIncome +
            diagnosis_rules_1.MAX_SCORES.jobLevel1 +
            diagnosis_rules_1.MAX_SCORES.jobLevel3 +
            diagnosis_rules_1.MAX_SCORES.yearsOfExperience +
            diagnosis_rules_1.MAX_SCORES.managementYears +
            diagnosis_rules_1.MAX_SCORES.englishLevel;
        if (answers.education === '大学' || answers.education === '大学院') {
            max += diagnosis_rules_1.MAX_SCORES.schoolTier;
        }
        if (answers.industryLevel1 === 'IT/インターネット/通信') {
            max += diagnosis_rules_1.MAX_SCORES.industryLevel3;
        }
        if (answers.jobLevel1 === '営業') {
            max +=
                diagnosis_rules_1.MAX_SCORES.customerSize +
                    diagnosis_rules_1.MAX_SCORES.achievementRate +
                    diagnosis_rules_1.MAX_SCORES.rankInOrg +
                    diagnosis_rules_1.MAX_SCORES.salesProduct +
                    diagnosis_rules_1.MAX_SCORES.productPrice;
        }
        return max;
    }
    computeScore(answers) {
        let score = 0;
        for (const [key, value] of Object.entries(answers)) {
            score += diagnosis_rules_1.SCORE_MAP[key]?.[value] ?? 0;
        }
        return score;
    }
    getTier(potentialIncome) {
        if (potentialIncome >= 800)
            return diagnosis_rules_1.TIERS[0];
        if (potentialIncome >= 650)
            return diagnosis_rules_1.TIERS[1];
        if (potentialIncome >= 500)
            return diagnosis_rules_1.TIERS[2];
        if (potentialIncome >= 400)
            return diagnosis_rules_1.TIERS[3];
        return diagnosis_rules_1.TIERS[4];
    }
    occ(code, reason) {
        const found = diagnosis_rules_1.OCCUPATION_TYPES.find((o) => o.code === code);
        return { code, title: found?.label ?? code, reason };
    }
    selectSuggestedJobs(answers, potentialIncome) {
        const { jobLevel1, englishLevel, companyType } = answers;
        const isHigh = potentialIncome >= 650;
        const isMidHigh = potentialIncome >= 500;
        const isMid = potentialIncome >= 400;
        const hasHighEnglish = englishLevel === 'ビジネス会話レベル' || englishLevel === 'ネイティブ/流暢';
        const isForeign = companyType === '外資系大手';
        let jobs;
        switch (jobLevel1) {
            case 'ITエンジニア':
                jobs = isHigh
                    ? [
                        this.occ('it_engineer', 'スキルを深めることで年収1000万超が視野に入る'),
                        this.occ('venture_startup', 'エンジニアスキルが事業価値に直結し、ストックオプションも狙える'),
                        hasHighEnglish
                            ? this.occ('foreign_affiliated', '英語力×技術で外資の報酬水準を得られる')
                            : this.occ('consulting', '技術コンサルとして高単価案件にアクセスできる'),
                    ]
                    : [
                        this.occ('it_engineer', '現職スキルを活かしながら待遇の良い環境に移れる'),
                        this.occ('remote_work', 'フリーランス転向で時間と収入を両立できる'),
                        this.occ('marketing_creative', 'エンジニア×マーケの掛け合わせで需要が高い'),
                    ];
                break;
            case 'コンサルタント':
                jobs = [
                    this.occ('consulting', '上位ファームへのステップアップで年収が大幅アップ'),
                    this.occ('ma', '案件成立で高額インセンティブ。コンサル経験が直接活きる'),
                    hasHighEnglish || isForeign
                        ? this.occ('foreign_affiliated', '英語力と論理思考力が直接評価される')
                        : this.occ('venture_startup', '事業参謀として創業期に高いストックオプションを狙える'),
                ];
                break;
            case '営業':
                if (isHigh) {
                    jobs = [
                        this.occ('sales', '高単価商材×インセンティブ制で年収が大幅アップ'),
                        this.occ('real_estate', '成約1件で数十万の報酬。実力次第で高収入が狙える'),
                        this.occ('human_resources', '成果報酬型が多く、実力次第で年収が大きく伸びる'),
                    ];
                }
                else if (isMidHigh) {
                    jobs = [
                        this.occ('sales', '業界・商材を変えることで収入が一段上がる'),
                        this.occ('real_estate', '歩合制で努力が直接収入に反映される'),
                        this.occ('taxi_driver', '固定給＋歩合で安定した収入が見込める'),
                    ];
                }
                else {
                    jobs = [
                        this.occ('sales', '業種を変えることで環境と給与の改善が期待できる'),
                        this.occ('truck_driver', '長距離ドライバーは日当が高く稼ぎやすい'),
                        this.occ('factory_manufacturing', 'シフト制と夜勤手当で実収入アップが見込める'),
                    ];
                }
                break;
            case 'マーケティング/企画':
                jobs = isMidHigh
                    ? [
                        this.occ('marketing_creative', '専門性を深めてフリーランス転向も視野に入る'),
                        this.occ('venture_startup', '事業企画として創業フェーズから関与できる'),
                        this.occ('consulting', '戦略立案経験が高単価コンサルに直結'),
                    ]
                    : [
                        this.occ('marketing_creative', '現職スキルを活かして待遇の良い環境に移れる'),
                        this.occ('remote_work', 'SNS運用・コンテンツ制作で副業から始められる'),
                        this.occ('back_office_administration', '企画×管理の経験が評価されやすい'),
                    ];
                break;
            case '管理部門':
                jobs = isMidHigh
                    ? [
                        this.occ('back_office_administration', '大手への転職で待遇を大幅に改善できる'),
                        this.occ('human_resources', '採用・労務経験が人材業界で高く評価される'),
                        this.occ('certified_tax_accountant', '資格取得で独立も可能。長期的な収入安定につながる'),
                    ]
                    : [
                        this.occ('back_office_administration', '経験を活かして安定した職場に移れる'),
                        this.occ('caregiving', '処遇改善が続く安定した需要がある職種'),
                        this.occ('factory_manufacturing', '管理経験を活かして現場リーダーを目指せる'),
                    ];
                break;
            default: {
                const interest = answers.careerInterest ?? '';
                if (interest === '美容・ウェルネス（美容師・エステ・ネイル等）') {
                    jobs = [
                        this.occ('hair_stylist', '指名客が増えるほど収入が伸び、独立も狙いやすい'),
                        this.occ('esthetician', '高級サロンへの就職でブライダルや高単価施術ができる'),
                        this.occ('nail_technician', '資格取得後にフリーランスとして独立しやすい職種'),
                    ];
                }
                else if (interest === '医療・介護・福祉') {
                    jobs = [
                        this.occ('caregiving', '処遇改善が続く安定した需要がある職種'),
                        this.occ('nurse', '資格取得で安定高収入。夜勤手当でさらにアップ'),
                        this.occ('physical_therapist', '高齢化社会で需要が増え続ける専門職'),
                    ];
                }
                else if (interest === 'ドライバー・物流') {
                    jobs = [
                        this.occ('taxi_driver', '固定給＋歩合で安定した収入が見込める'),
                        this.occ('truck_driver', '長距離で日当が高く稼ぎやすい'),
                        this.occ('factory_manufacturing', '物流倉庫での仕分けなど未経験でも即戦力になれる'),
                    ];
                }
                else if (interest === '製造・建設') {
                    jobs = [
                        this.occ('factory_manufacturing', '未経験OKで安定した収入が得られる'),
                        this.occ('construction', '資格取得で収入が大幅アップする職種'),
                        this.occ('security_guard', '夜勤手当で収入アップ。資格取得で昇給も狙える'),
                    ];
                }
                else if (interest === '接客・サービス・販売') {
                    jobs = [
                        this.occ('sales_reception', '大手百貨店やブランドで安定して働ける'),
                        this.occ('food_beverage', '店長職への昇進で収入アップを狙える'),
                        this.occ('resort_jobs', '住み込みで生活費を抑えながら貯金できる'),
                    ];
                }
                else if (isHigh) {
                    jobs = [
                        this.occ('sales', 'コミュニケーション力があれば高収入が狙いやすい職種'),
                        this.occ('real_estate', '体力と交渉力で大きく稼げる業界'),
                        this.occ('human_resources', '成果報酬型で実力次第で年収が伸びる'),
                    ];
                }
                else if (isMid) {
                    jobs = [
                        this.occ('factory_manufacturing', '安定した収入と夜勤手当で月収アップが見込める'),
                        this.occ('taxi_driver', '固定給＋歩合で安定収入。資格があれば始めやすい'),
                        this.occ('truck_driver', '長距離で日当が高く稼ぎやすい'),
                    ];
                }
                else {
                    jobs = [
                        this.occ('factory_manufacturing', '未経験OKで即戦力になれる'),
                        this.occ('caregiving', '需要が高く安定して働ける'),
                        this.occ('security_guard', '夜勤手当で収入アップ。資格取得で昇給も狙える'),
                    ];
                }
                break;
            }
        }
        // 英語力が高い場合、まだ外資系が入っていなければ3枠目に差し込む
        if (hasHighEnglish && isHigh && !jobs.some((j) => j.code === 'foreign_affiliated')) {
            jobs[2] = this.occ('foreign_affiliated', '英語力が直接評価され、給与水準が大幅に上がる');
        }
        return jobs.slice(0, 3);
    }
    diagnose(answers) {
        const base = diagnosis_rules_1.INCOME_BASE[answers.currentIncome] ?? 350;
        const score = this.computeScore(answers);
        const maxScore = this.computeMaxScore(answers);
        const normalizedScore = maxScore > 0 ? score / maxScore : 0;
        const multiplier = 0.85 + normalizedScore * 0.749;
        const potentialIncome = Math.round((base * multiplier) / 5) * 5;
        const incomeGap = potentialIncome - base;
        const tier = this.getTier(potentialIncome);
        const suggestedJobs = this.selectSuggestedJobs(answers, potentialIncome);
        const shareText = `診断結果：「${tier.name}」\n市場価値ランク ${tier.rank} ｜ ${tier.growthType}\n\n"${tier.tagline}"\n\n#市場価値診断 #キャリア`;
        return {
            id: tier.id,
            name: tier.name,
            emoji: tier.emoji,
            rank: tier.rank,
            growthType: tier.growthType,
            tagline: tier.tagline,
            description: tier.description,
            potentialIncome,
            incomeGap,
            currentIncomeBase: base,
            suggestedJobs,
            shareText,
        };
    }
};
exports.DiagnosisService = DiagnosisService;
exports.DiagnosisService = DiagnosisService = __decorate([
    (0, common_1.Injectable)()
], DiagnosisService);
