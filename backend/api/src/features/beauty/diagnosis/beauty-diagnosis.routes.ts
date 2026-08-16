import { Module } from '@nestjs/common';
import { BeautyDiagnosisController } from './beauty-diagnosis.controller';
import { BeautyDiagnosisService } from './beauty-diagnosis.service';

@Module({
  controllers: [BeautyDiagnosisController],
  providers: [BeautyDiagnosisService],
})
export class BeautyDiagnosisModule {}
