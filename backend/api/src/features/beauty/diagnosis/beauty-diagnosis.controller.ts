import { Body, Controller, Get, HttpCode, NotFoundException, Post, UseGuards } from '@nestjs/common';
import { BeautyDiagnosisService } from './beauty-diagnosis.service';
import { BeautyDiagnoseDto } from './beauty-diagnosis.schema';
import { JwtGuard } from '../../../middleware/jwt.guard';
import { CurrentUserId } from '../../../decorators/current-user.decorator';
import { OptionalCurrentUserId } from '../../../decorators/optional-current-user.decorator';

@Controller('beauty/diagnosis')
export class BeautyDiagnosisController {
  constructor(private readonly service: BeautyDiagnosisService) {}

  @Post()
  @HttpCode(200)
  diagnose(@Body() dto: BeautyDiagnoseDto, @OptionalCurrentUserId() beautyUserId: string | null) {
    return this.service.diagnoseAndSave(dto.jobId, dto.answers, beautyUserId);
  }

  @Get('latest')
  @UseGuards(JwtGuard)
  async latest(@CurrentUserId() beautyUserId: string) {
    const result = await this.service.getLatestResult(beautyUserId);
    if (!result) throw new NotFoundException('診断結果が見つかりません');
    return result;
  }
}
