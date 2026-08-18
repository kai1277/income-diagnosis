import { Module } from '@nestjs/common';
import { BeautyDiagnosisController } from './beauty-diagnosis.controller';
import { BeautyDiagnosisService } from './beauty-diagnosis.service';
import { BeautyDiagnosisResultsRepository } from '../../../repositories/beauty-diagnosis-results.repository';

@Module({
  controllers: [BeautyDiagnosisController],
  providers: [BeautyDiagnosisService, BeautyDiagnosisResultsRepository],
})
export class BeautyDiagnosisModule {}
