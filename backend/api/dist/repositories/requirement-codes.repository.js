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
exports.RequirementCodesRepository = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../db/prisma.service");
let RequirementCodesRepository = class RequirementCodesRepository {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll() {
        return this.prisma.requirementCode.findMany({
            orderBy: [{ category: 'asc' }, { sort_order: 'asc' }, { code: 'asc' }],
        });
    }
    async create(dto) {
        return this.prisma.requirementCode.create({
            data: {
                category: dto.category,
                code: dto.code,
                label: dto.label,
                value_type: dto.value_type,
                allowed_operators: dto.allowed_operators,
                is_active: dto.is_active ?? true,
                sort_order: dto.sort_order ?? null,
            },
        });
    }
    async deleteById(id) {
        return this.prisma.requirementCode.delete({ where: { id } });
    }
};
exports.RequirementCodesRepository = RequirementCodesRepository;
exports.RequirementCodesRepository = RequirementCodesRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], RequirementCodesRepository);
