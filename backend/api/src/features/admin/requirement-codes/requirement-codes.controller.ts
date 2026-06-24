import { Body, Controller, Delete, Get, HttpCode, Param, Patch, Post } from '@nestjs/common';
import { RequirementCodesService } from './requirement-codes.service';
import { CreateRequirementCodeDto, UpdateRequirementCodeDto } from './requirement-codes.schema';

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

  @Patch(':id')
  updateRequirementCode(@Param('id') id: string, @Body() dto: UpdateRequirementCodeDto) {
    return this.service.updateRequirementCode(id, dto);
  }

  @Delete(':id')
  @HttpCode(204)
  deleteRequirementCode(@Param('id') id: string) {
    return this.service.deleteRequirementCode(id);
  }
}
