import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { BeautyDiagnosisService } from './beauty-diagnosis.service';
import { BeautyDiagnoseDto } from './beauty-diagnosis.schema';
import type { BeautyDiagnosisAnswers } from './beauty-diagnosis.types';

@Controller('beauty/diagnosis')
export class BeautyDiagnosisController {
  constructor(private readonly service: BeautyDiagnosisService) {}

  @Post()
  @HttpCode(200)
  diagnose(@Body() dto: BeautyDiagnoseDto) {
    return this.service.diagnose(dto.jobId, dto.answers as unknown as BeautyDiagnosisAnswers);
  }
}
