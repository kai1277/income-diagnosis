import { Injectable } from '@nestjs/common';
import { PrismaService } from '../db/prisma.service';

@Injectable()
export class OccupationTypesRepository {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.occupationType.findMany({
      where: { is_active: true },
      orderBy: { sort_order: 'asc' },
    });
  }
}
