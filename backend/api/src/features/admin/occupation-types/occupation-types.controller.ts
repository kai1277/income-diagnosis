import { Controller, Get } from '@nestjs/common';
import { OccupationTypesService } from './occupation-types.service';

@Controller('admin/occupation-types')
export class OccupationTypesController {
  constructor(private readonly service: OccupationTypesService) {}

  @Get()
  getAll() {
    return this.service.getAll();
  }
}
