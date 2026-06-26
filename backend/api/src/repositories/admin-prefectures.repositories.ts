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

  async createCity(prefectureId: string, name: string) {
    const agg = await this.prisma.city.aggregate({
      where: { prefecture_id: prefectureId },
      _max: { sort_order: true },
    });
    const nextOrder = (agg._max.sort_order ?? 0) + 1;
    return this.prisma.city.create({
      data: { prefecture_id: prefectureId, name, sort_order: nextOrder },
    });
  }
}
