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
const JOB_INCLUDE = {
    job_requirements: true,
    job_occupation_types: { include: { occupation_type: true } },
    prefecture: true,
    city: true,
};
let AdminJobsRepository = class AdminJobsRepository {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll() {
        return this.prisma.job.findMany({
            include: JOB_INCLUDE,
            orderBy: { created_at: 'desc' },
        });
    }
    async findById(id) {
        return this.prisma.job.findUnique({
            where: { id },
            include: JOB_INCLUDE,
        });
    }
    async update(id, dto) {
        const { requirements, expires_at, occupation_type_ids, job_location, prefecture_id, city_id, ...jobFields } = dto;
        return this.prisma.job.update({
            where: { id },
            data: {
                ...jobFields,
                expires_at: expires_at !== undefined
                    ? (expires_at ? new Date(expires_at) : null)
                    : undefined,
                ...(job_location !== undefined && { job_location: job_location ?? null }),
                ...(prefecture_id !== undefined && { prefecture_id: prefecture_id ?? null }),
                ...(city_id !== undefined && { city_id: city_id ?? null }),
                ...(requirements !== undefined && {
                    job_requirements: {
                        deleteMany: {},
                        create: requirements.map((r) => ({
                            requirement_code_id: r.requirement_code_id,
                            level: r.level,
                            operator: r.operator,
                            value: r.value ?? null,
                        })),
                    },
                }),
                ...(occupation_type_ids !== undefined && {
                    job_occupation_types: {
                        deleteMany: {},
                        create: occupation_type_ids.map((occupation_type_id) => ({
                            occupation_type_id,
                        })),
                    },
                }),
            },
            include: JOB_INCLUDE,
        });
    }
    async deleteById(id) {
        return this.prisma.job.delete({ where: { id } });
    }
    async create(dto) {
        const { requirements, expires_at, occupation_type_ids, job_location, prefecture_id, city_id, ...jobFields } = dto;
        return this.prisma.job.create({
            data: {
                ...jobFields,
                job_location: job_location ?? null,
                prefecture_id: prefecture_id ?? null,
                city_id: city_id ?? null,
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
                job_occupation_types: occupation_type_ids?.length
                    ? {
                        create: occupation_type_ids.map((occupation_type_id) => ({
                            occupation_type_id,
                        })),
                    }
                    : undefined,
            },
            include: JOB_INCLUDE,
        });
    }
};
exports.AdminJobsRepository = AdminJobsRepository;
exports.AdminJobsRepository = AdminJobsRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AdminJobsRepository);
