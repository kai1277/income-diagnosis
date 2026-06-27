import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { DiagnosisService } from './diagnosis.service';
import { DiagnoseDto } from './diagnosis.schema';

@Controller('user/diagnosis')
export class DiagnosisController {
  constructor(private readonly service: DiagnosisService) {}

  @Post()
  @HttpCode(200)
  diagnose(@Body() dto: DiagnoseDto) {
    return this.service.diagnose(dto.answers);
  }
}
