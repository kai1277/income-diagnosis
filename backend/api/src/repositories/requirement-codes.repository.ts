import { Injectable } from '@nestjs/common';
import { PrismaService } from '../db/prisma.service';
import { CreateRequirementCodeDto } from '../features/admin/requirement-codes/requirement-codes.schema';

@Injectable()
export class RequirementCodesRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return this.prisma.requirementCode.findMany({
      orderBy: [{ category: 'asc' }, { sort_order: 'asc' }, { code: 'asc' }],
    });
  }

  async create(dto: CreateRequirementCodeDto) {
    return this.prisma.requirementCode.create({
      data: {
        category: dto.category,
        code: dto.code,
        label: dto.label,
        value_type: dto.value_type,
        allowed_operators: dto.allowed_operators,
        is_active: dto.is_active ?? true,
        sort_order: dto.sort_order ?? null,
      },
    });
  }

  async deleteById(id: string) {
    return this.prisma.requirementCode.delete({ where: { id } });
  }
}
