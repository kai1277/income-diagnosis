import { Controller, Get, Param } from '@nestjs/common';
import { PrefecturesService } from './admin-prefectures.service';

@Controller('admin/prefectures')
export class PrefecturesController {
  constructor(private readonly service: PrefecturesService) {}

  @Get()
  getPrefectures() {
    return this.service.getPrefectures();
  }

  @Get(':id/cities')
  getCitiesByPrefectureId(@Param('id') id: string) {
    return this.service.getCitiesByPrefectureId(id);
  }
}
