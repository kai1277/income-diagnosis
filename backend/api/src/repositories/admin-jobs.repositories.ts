import { Injectable } from '@nestjs/common';
import { PrismaService } from '../db/prisma.service';
import { CreateJobDto } from '../features/admin/jobs/admin-jobs.schema';

@Injectable()
export class AdminJobsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return this.prisma.job.findMany({
      include: { job_requirements: true },
      orderBy: { created_at: 'desc' },
    });
  }

  async create(dto: CreateJobDto) {
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
}
