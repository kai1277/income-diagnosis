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
exports.AdminJobsRepository = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../db/prisma.service");
let AdminJobsRepository = class AdminJobsRepository {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll() {
        return this.prisma.job.findMany({
            include: { job_requirements: true },
            orderBy: { created_at: 'desc' },
        });
    }
    async deleteById(id) {
        return this.prisma.job.delete({ where: { id } });
    }
    async create(dto) {
        const { requirements, expires_at, ...jobFields } = dto;
        return this.prisma.job.create({
            data: {
                ...jobFields,
                is_active: jobFields.is_active ?? true,
                expires_at: expires_at ? new Date(expires_at) : null,
                job_requirements: requirements?.length
                    ? {
                        create: requirements.map((r) => ({
                            requirement_code_id: r.requirement_code_id,
                            level: r.level,
                            operator: r.operator,
                            value: r.value ?? null,
                        })),
                    }
                    : undefined,
            },
            include: { job_requirements: true },
        });
    }
};
exports.AdminJobsRepository = AdminJobsRepository;
exports.AdminJobsRepository = AdminJobsRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AdminJobsRepository);
