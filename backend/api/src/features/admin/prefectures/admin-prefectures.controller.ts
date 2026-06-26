import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { PrefecturesService } from './admin-prefectures.service';
import { CreateCityDto } from './admin-prefectures.schema';

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

  @Post(':id/cities')
  createCity(@Param('id') id: string, @Body() dto: CreateCityDto) {
    return this.service.createCity(id, dto.name);
  }
}
