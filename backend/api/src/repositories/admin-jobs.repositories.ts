import { Injectable } from '@nestjs/common';
import { PrismaService } from '../db/prisma.service';
import { CreateJobDto, UpdateJobDto } from '../features/admin/jobs/admin-jobs.schema';

const JOB_INCLUDE = {
  job_requirements: true,
  job_occupation_types: { include: { occupation_type: true } },
} as const;

@Injectable()
export class AdminJobsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return this.prisma.job.findMany({
      include: JOB_INCLUDE,
      orderBy: { created_at: 'desc' },
    });
  }

  async findById(id: string) {
    return this.prisma.job.findUnique({
      where: { id },
      include: JOB_INCLUDE,
    });
  }

  async update(id: string, dto: UpdateJobDto) {
    const { requirements, expires_at, occupation_type_ids, ...jobFields } = dto;

    return this.prisma.job.update({
      where: { id },
      data: {
        ...jobFields,
        expires_at: expires_at !== undefined
          ? (expires_at ? new Date(expires_at) : null)
          : undefined,
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

  async deleteById(id: string) {
    return this.prisma.job.delete({ where: { id } });
  }

  async create(dto: CreateJobDto) {
    const { requirements, expires_at, occupation_type_ids, ...jobFields } = dto;

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
}
