"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BeautyDiagnosisService = void 0;
const common_1 = require("@nestjs/common");
const beauty_diagnosis_rules_1 = require("./beauty-diagnosis-rules");
function rangeFromCenter(center, volatile) {
    const low = Math.round((center * (volatile ? 0.8 : 0.92)) / 10) * 10;
    const high = Math.round((center * (volatile ? 1.25 : 1.1)) / 10) * 10;
    return { low, high };
}
let BeautyDiagnosisService = class BeautyDiagnosisService {
    diagnose(jobId, answers) {
        switch (jobId) {
            case 'hair':
                return this.calcHair(answers);
            case 'nail':
                return this.calcNail(answers);
            case 'lash':
                return this.calcLash(answers);
            case 'esthe':
                return this.calcEsthe(answers);
        }
    }
    applyAreaAdjustment(subtotal, areaId, breakdown) {
        const mult = beauty_diagnosis_rules_1.AREA_MULT[areaId] ?? 1;
        const adjusted = subtotal * mult;
        const areaDelta = Math.round(adjusted - subtotal);
        breakdown.push({
            label: `エリア相場による調整（×${mult.toFixed(2)}）`,
            text: `${areaDelta >= 0 ? '+' : ''}${areaDelta}万円`,
        });
        return adjusted;
    }
    calcHair(a) {
        const rules = beauty_diagnosis_rules_1.JOB_RULES.hair;
        const base = rules.positionBase[a.position] ?? 0;
        const salesMid = rules.salesMid[a.sales] ?? 0;
        const styleRule = rules.styles[a.style];
        const strengths = a.strengths ?? [];
        const expAdj = Math.min(a.experience, 20) * 4;
        const annualSales = salesMid * 12;
        const breakdown = [];
        let subtotal = 0;
        let incentive = 0;
        if (styleRule.mode === 'fixed') {
            subtotal = base + expAdj;
            breakdown.push({ label: '役職ベース給与', text: `${base}万円` });
            breakdown.push({ label: '経験年数による加算', text: `+${expAdj}万円` });
            breakdown.push({ label: '歩合インセンティブ', text: `±0万円` });
        }
        else if (styleRule.mode === 'hybrid') {
            incentive = Math.round(annualSales * (styleRule.rate ?? 0));
            subtotal = base + expAdj + incentive;
            breakdown.push({ label: '役職ベース給与', text: `${base}万円` });
            breakdown.push({ label: '経験年数による加算', text: `+${expAdj}万円` });
            breakdown.push({ label: '歩合インセンティブ試算', text: `+${incentive}万円` });
        }
        else {
            const retainer = 60;
            const skillAdj = Math.round(base * 0.25);
            incentive = Math.round(annualSales * (styleRule.rate ?? 0));
            subtotal = retainer + skillAdj + incentive;
            breakdown.push({ label: '契約ベース（業務委託）', text: `${retainer}万円` });
            breakdown.push({ label: '技術力加算（役職相当）', text: `+${skillAdj}万円` });
            breakdown.push({ label: '歩合インセンティブ試算', text: `+${incentive}万円` });
        }
        const adjusted = this.applyAreaAdjustment(subtotal, a.area, breakdown);
        const strengthBonus = strengths.reduce((sum, v) => sum + (rules.strengthBonus?.[v] ?? 0), 0);
        breakdown.push({
            label: strengths.length > 0 ? '強みによる加点' : '強みによる加点（未選択）',
            text: `+${strengthBonus}万円`,
        });
        const center = Math.round(adjusted + strengthBonus);
        const volatile = styleRule.mode === 'commission';
        const { low, high } = rangeFromCenter(center, volatile);
        const pct = Math.max(0, Math.min(1, (center - rules.gaugeMin) / (rules.gaugeMax - rules.gaugeMin)));
        return { center, low, high, pct, breakdown };
    }
    calcNail(a) {
        const rules = beauty_diagnosis_rules_1.JOB_RULES.nail;
        const base = rules.positionBase[a.position] ?? 0;
        const salesMid = rules.salesMid[a.sales] ?? 0;
        const certBonus = rules.certBonus?.[a.cert ?? ''] ?? 0;
        const styleRule = rules.styles[a.style];
        const expAdj = Math.min(a.experience, 20) * 3;
        const annualSales = salesMid * 12;
        const breakdown = [];
        let subtotal = 0;
        let incentive = 0;
        if (styleRule.mode === 'fixed') {
            subtotal = base + expAdj + certBonus;
            breakdown.push({ label: '役職ベース給与', text: `${base}万円` });
            breakdown.push({ label: '経験年数による加算', text: `+${expAdj}万円` });
            breakdown.push({ label: '資格・技術レベルによる加点', text: `+${certBonus}万円` });
            breakdown.push({ label: '歩合インセンティブ', text: `±0万円` });
        }
        else if (styleRule.mode === 'hybrid') {
            incentive = Math.round(annualSales * (styleRule.rate ?? 0));
            subtotal = base + expAdj + certBonus + incentive;
            breakdown.push({ label: '役職ベース給与', text: `${base}万円` });
            breakdown.push({ label: '経験年数による加算', text: `+${expAdj}万円` });
            breakdown.push({ label: '資格・技術レベルによる加点', text: `+${certBonus}万円` });
            breakdown.push({ label: '歩合インセンティブ試算', text: `+${incentive}万円` });
        }
        else {
            const retainer = 50;
            const skillAdj = Math.round(base * 0.2);
            incentive = Math.round(annualSales * (styleRule.rate ?? 0));
            subtotal = retainer + skillAdj + certBonus + incentive;
            breakdown.push({ label: '契約ベース（業務委託）', text: `${retainer}万円` });
            breakdown.push({ label: '技術力加算（役職相当）', text: `+${skillAdj}万円` });
            breakdown.push({ label: '資格・技術レベルによる加点', text: `+${certBonus}万円` });
            breakdown.push({ label: '歩合インセンティブ試算', text: `+${incentive}万円` });
        }
        const adjusted = this.applyAreaAdjustment(subtotal, a.area, breakdown);
        const center = Math.round(adjusted);
        const volatile = styleRule.mode === 'commission';
        const { low, high } = rangeFromCenter(center, volatile);
        const pct = Math.max(0, Math.min(1, (center - rules.gaugeMin) / (rules.gaugeMax - rules.gaugeMin)));
        return { center, low, high, pct, breakdown };
    }
    calcLash(a) {
        const rules = beauty_diagnosis_rules_1.JOB_RULES.lash;
        const base = rules.positionBase[a.position] ?? 0;
        const salesMid = rules.salesMid[a.sales] ?? 0;
        const certBonus = rules.certBonus?.[a.cert ?? ''] ?? 0;
        const styleRule = rules.styles[a.style];
        const expAdj = Math.min(a.experience, 20) * 3;
        const annualSales = salesMid * 12;
        const breakdown = [];
        let subtotal = 0;
        let incentive = 0;
        if (styleRule.mode === 'fixed') {
            subtotal = base + expAdj + certBonus;
            breakdown.push({ label: '役職ベース給与', text: `${base}万円` });
            breakdown.push({ label: '経験年数による加算', text: `+${expAdj}万円` });
            breakdown.push({ label: '資格・技術レベルによる加点', text: `+${certBonus}万円` });
            breakdown.push({ label: '歩合インセンティブ', text: `±0万円` });
        }
        else if (styleRule.mode === 'hybrid') {
            incentive = Math.round(annualSales * (styleRule.rate ?? 0));
            subtotal = base + expAdj + certBonus + incentive;
            breakdown.push({ label: '役職ベース給与', text: `${base}万円` });
            breakdown.push({ label: '経験年数による加算', text: `+${expAdj}万円` });
            breakdown.push({ label: '資格・技術レベルによる加点', text: `+${certBonus}万円` });
            breakdown.push({ label: '歩合インセンティブ試算', text: `+${incentive}万円` });
        }
        else {
            const retainer = 48;
            const skillAdj = Math.round(base * 0.2);
            incentive = Math.round(annualSales * (styleRule.rate ?? 0));
            subtotal = retainer + skillAdj + certBonus + incentive;
            breakdown.push({ label: '契約ベース（業務委託）', text: `${retainer}万円` });
            breakdown.push({ label: '技術力加算（役職相当）', text: `+${skillAdj}万円` });
            breakdown.push({ label: '資格・技術レベルによる加点', text: `+${certBonus}万円` });
            breakdown.push({ label: '歩合インセンティブ試算', text: `+${incentive}万円` });
        }
        const adjusted = this.applyAreaAdjustment(subtotal, a.area, breakdown);
        const center = Math.round(adjusted);
        const volatile = styleRule.mode === 'commission';
        const { low, high } = rangeFromCenter(center, volatile);
        const pct = Math.max(0, Math.min(1, (center - rules.gaugeMin) / (rules.gaugeMax - rules.gaugeMin)));
        return { center, low, high, pct, breakdown };
    }
    calcEsthe(a) {
        const rules = beauty_diagnosis_rules_1.JOB_RULES.esthe;
        const base = rules.positionBase[a.position] ?? 0;
        const salesMid = rules.salesMid[a.sales] ?? 0;
        const certBonus = rules.certBonus?.[a.cert ?? ''] ?? 0;
        const styleRule = rules.styles[a.style];
        const expAdj = Math.min(a.experience, 20) * 3.5;
        const annualSales = salesMid * 12;
        const breakdown = [];
        let subtotal = 0;
        let incentive = 0;
        if (styleRule.mode === 'fixed') {
            subtotal = base + expAdj + certBonus;
            breakdown.push({ label: '役職ベース給与', text: `${base}万円` });
            breakdown.push({ label: '経験年数による加算', text: `+${Math.round(expAdj)}万円` });
            breakdown.push({ label: '資格による加点', text: `+${certBonus}万円` });
            breakdown.push({ label: '歩合インセンティブ', text: `±0万円` });
        }
        else if (styleRule.mode === 'hybrid') {
            incentive = Math.round(annualSales * (styleRule.rate ?? 0));
            subtotal = base + expAdj + certBonus + incentive;
            breakdown.push({ label: '役職ベース給与', text: `${base}万円` });
            breakdown.push({ label: '経験年数による加算', text: `+${Math.round(expAdj)}万円` });
            breakdown.push({ label: '資格による加点', text: `+${certBonus}万円` });
            breakdown.push({ label: '物販・コース歩合インセンティブ試算', text: `+${incentive}万円` });
        }
        else {
            const retainer = 55;
            const skillAdj = Math.round(base * 0.22);
            incentive = Math.round(annualSales * (styleRule.rate ?? 0));
            subtotal = retainer + skillAdj + certBonus + incentive;
            breakdown.push({ label: '契約ベース（業務委託）', text: `${retainer}万円` });
            breakdown.push({ label: '技術力加算（役職相当）', text: `+${skillAdj}万円` });
            breakdown.push({ label: '資格による加点', text: `+${certBonus}万円` });
            breakdown.push({ label: '物販・コース歩合インセンティブ試算', text: `+${incentive}万円` });
        }
        const adjusted = this.applyAreaAdjustment(subtotal, a.area, breakdown);
        const center = Math.round(adjusted);
        const volatile = styleRule.mode === 'commission';
        const { low, high } = rangeFromCenter(center, volatile);
        const pct = Math.max(0, Math.min(1, (center - rules.gaugeMin) / (rules.gaugeMax - rules.gaugeMin)));
        return { center, low, high, pct, breakdown };
    }
};
exports.BeautyDiagnosisService = BeautyDiagnosisService;
exports.BeautyDiagnosisService = BeautyDiagnosisService = __decorate([
    (0, common_1.Injectable)()
], BeautyDiagnosisService);
