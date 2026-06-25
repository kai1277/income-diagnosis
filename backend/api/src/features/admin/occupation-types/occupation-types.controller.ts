import { Body, Controller, Delete, Get, HttpCode, Param, Post } from '@nestjs/common';
import { OccupationTypesService } from './occupation-types.service';
import { CreateOccupationTypeDto } from './occupation-types.schema';

@Controller('admin/occupation-types')
export class OccupationTypesController {
  constructor(private readonly service: OccupationTypesService) {}

  @Get()
  getAll() {
    return this.service.getAll();
  }

  @Post()
  @HttpCode(201)
  create(@Body() dto: CreateOccupationTypeDto) {
    return this.service.create(dto);
  }

  @Delete(':id')
  @HttpCode(204)
  delete(@Param('id') id: string) {
    return this.service.delete(id);
  }
}
