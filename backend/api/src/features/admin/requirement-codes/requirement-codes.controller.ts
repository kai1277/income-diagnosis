import { Body, Controller, Delete, Get, HttpCode, Param, Post } from '@nestjs/common';
import { RequirementCodesService } from './requirement-codes.service';
import { CreateRequirementCodeDto } from './requirement-codes.schema';

@Controller('admin/requirement-codes')
export class RequirementCodesController {
  constructor(private readonly service: RequirementCodesService) {}

  @Get()
  getRequirementCodes() {
    return this.service.getRequirementCodes();
  }

  @Post()
  @HttpCode(201)
  createRequirementCode(@Body() dto: CreateRequirementCodeDto) {
    return this.service.createRequirementCode(dto);
  }

  @Delete(':id')
  @HttpCode(204)
  deleteRequirementCode(@Param('id') id: string) {
    return this.service.deleteRequirementCode(id);
  }
}
