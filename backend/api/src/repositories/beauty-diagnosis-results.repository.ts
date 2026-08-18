import { Injectable } from '@nestjs/common';
import { PrismaService } from '../db/prisma.service';
import type { InputJsonValue } from '@prisma/client/runtime/client';

export interface CreateBeautyDiagnosisResultInput {
  beautyUserId: string | null;
  answers: InputJsonValue;
  potentialIncome: number;
  incomeLow: number;
  incomeHigh: number;
  resultSnapshot: InputJsonValue;
}

@Injectable()
export class BeautyDiagnosisResultsRepository {
  constructor(private readonly prisma: PrismaService) {}

  create(input: CreateBeautyDiagnosisResultInput) {
    return this.prisma.beautyDiagnosisResult.create({
      data: {
        beauty_user_id: input.beautyUserId,
        answers: input.answers,
        potential_income: input.potentialIncome,
        income_low: input.incomeLow,
        income_high: input.incomeHigh,
        result_snapshot: input.resultSnapshot,
      },
    });
  }

  findLatestByUserId(beautyUserId: string) {
    return this.prisma.beautyDiagnosisResult.findFirst({
      where: { beauty_user_id: beautyUserId },
      orderBy: { created_at: 'desc' },
    });
  }
}
