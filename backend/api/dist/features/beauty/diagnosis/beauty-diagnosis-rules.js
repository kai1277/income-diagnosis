"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JOB_RULES = exports.AREA_MULT = void 0;
exports.AREA_MULT = {
    a1: 1.2,
    a2: 1.08,
    a3: 1.0,
    a4: 0.92,
};
exports.JOB_RULES = {
    hair: {
        positionBase: { assistant: 260, stylist: 320, top: 400, manager: 480, owner: 580 },
        salesMid: { s1: 60, s2: 115, s3: 200, s4: 325, s5: 480 },
        styles: {
            fixed: { mode: 'fixed' },
            hybrid: { mode: 'hybrid', rate: 0.1 },
            commission: { mode: 'commission', rate: 0.48 },
        },
        strengthBonus: { sns: 8, color: 6, mgmt: 10, award: 12, updo: 5 },
        gaugeMin: 250,
        gaugeMax: 950,
    },
    nail: {
        positionBase: { assistant: 230, nailist: 280, top: 340, manager: 400, owner: 500 },
        salesMid: { s1: 30, s2: 55, s3: 95, s4: 150, s5: 220 },
        styles: {
            fixed: { mode: 'fixed' },
            hybrid: { mode: 'hybrid', rate: 0.12 },
            commission: { mode: 'commission', rate: 0.5 },
        },
        certBonus: { c1: 0, c2: 15, c3: 30, c4: 50 },
        gaugeMin: 220,
        gaugeMax: 750,
    },
    lash: {
        positionBase: { assistant: 240, lashist: 290, top: 350, manager: 420, owner: 520 },
        salesMid: { s1: 40, s2: 70, s3: 120, s4: 185, s5: 260 },
        styles: {
            fixed: { mode: 'fixed' },
            hybrid: { mode: 'hybrid', rate: 0.11 },
            commission: { mode: 'commission', rate: 0.46 },
        },
        certBonus: { c1: 0, c2: 12, c3: 25, c4: 40 },
        gaugeMin: 230,
        gaugeMax: 780,
    },
    esthe: {
        positionBase: { assistant: 250, esthetician: 300, top: 370, manager: 440, owner: 540 },
        salesMid: { s1: 45, s2: 85, s3: 145, s4: 230, s5: 340 },
        styles: {
            fixed: { mode: 'fixed' },
            hybrid: { mode: 'hybrid', rate: 0.13 },
            commission: { mode: 'commission', rate: 0.45 },
        },
        certBonus: { c1: 0, c2: 15, c3: 35 },
        gaugeMin: 240,
        gaugeMax: 900,
    },
};
