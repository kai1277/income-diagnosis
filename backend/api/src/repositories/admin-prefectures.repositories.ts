import { Injectable } from '@nestjs/common';
import { PrismaService } from '../db/prisma.service';

@Injectable()
export class PrefecturesRepository {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.prefecture.findMany({ orderBy: { sort_order: 'asc' } });
  }

  findCitiesByPrefectureId(prefectureId: string) {
    return this.prisma.city.findMany({
      where: { prefecture_id: prefectureId },
      orderBy: { sort_order: 'asc' },
    });
  }
}
