import { Injectable } from '@nestjs/common';
import { PrismaService } from '../db/prisma.service';

@Injectable()
export class BeautyKeptJobsRepository {
  constructor(private readonly prisma: PrismaService) {}

  keep(beautyUserId: string, jobId: string) {
    return this.prisma.beautyKeptJob.upsert({
      where: { beauty_user_id_job_id: { beauty_user_id: beautyUserId, job_id: jobId } },
      create: { beauty_user_id: beautyUserId, job_id: jobId },
      update: {},
    });
  }

  findJobsByUserId(beautyUserId: string) {
    return this.prisma.beautyKeptJob.findMany({
      where: { beauty_user_id: beautyUserId },
      orderBy: { created_at: 'desc' },
      include: { job: true },
    });
  }
}
