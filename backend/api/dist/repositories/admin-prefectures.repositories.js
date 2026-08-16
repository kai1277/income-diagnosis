"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrefecturesRepository = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../db/prisma.service");
let PrefecturesRepository = class PrefecturesRepository {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    findAll() {
        return this.prisma.prefecture.findMany({ orderBy: { sort_order: 'asc' } });
    }
    findCitiesByPrefectureId(prefectureId) {
        return this.prisma.city.findMany({
            where: { prefecture_id: prefectureId },
            orderBy: { sort_order: 'asc' },
        });
    }
    async createCity(prefectureId, name) {
        const agg = await this.prisma.city.aggregate({
            where: { prefecture_id: prefectureId },
            _max: { sort_order: true },
        });
        const nextOrder = (agg._max.sort_order ?? 0) + 1;
        return this.prisma.city.create({
            data: { prefecture_id: prefectureId, name, sort_order: nextOrder },
        });
    }
};
exports.PrefecturesRepository = PrefecturesRepository;
exports.PrefecturesRepository = PrefecturesRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PrefecturesRepository);
