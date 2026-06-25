import { Injectable } from '@nestjs/common';
import { PrismaService } from '../db/prisma.service';
import { CreateOccupationTypeDto } from '../features/admin/occupation-types/occupation-types.schema';

@Injectable()
export class OccupationTypesRepository {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.occupationType.findMany({
      orderBy: [{ sort_order: 'asc' }, { created_at: 'asc' }],
    });
  }

  create(dto: CreateOccupationTypeDto) {
    return this.prisma.occupationType.create({
      data: {
        code: dto.code,
        label: dto.label,
        is_active: dto.is_active ?? true,
        sort_order: dto.sort_order ?? null,
      },
    });
  }

  deleteById(id: string) {
    return this.prisma.occupationType.delete({ where: { id } });
  }
}
