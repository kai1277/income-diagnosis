import { Injectable } from '@nestjs/common';
import { PrismaService } from '../db/prisma.service';

@Injectable()
export class UserJobsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findByOccupationCodes(codes: string[]) {
    const now = new Date();
    return this.prisma.job.findMany({
      where: {
        is_active: true,
        OR: [{ expires_at: null }, { expires_at: { gt: now } }],
        job_occupation_types: {
          some: {
            occupation_type: { code: { in: codes } },
          },
        },
      },
      orderBy: { created_at: 'desc' },
    });
  }
}
