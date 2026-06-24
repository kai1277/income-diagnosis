import { Body, Controller, Delete, Get, HttpCode, Param, Post } from '@nestjs/common';
import { AdminJobsService } from './admin-jobs.service';
import { CreateJobDto } from './admin-jobs.schema';

@Controller('admin/jobs')
export class AdminJobsController {
  constructor(private readonly service: AdminJobsService) {}

  @Get()
  getJobs() {
    return this.service.getJobs();
  }

  @Post()
  @HttpCode(201)
  createJob(@Body() dto: CreateJobDto) {
    return this.service.createJob(dto);
  }

  @Delete(':id')
  @HttpCode(204)
  deleteJob(@Param('id') id: string) {
    return this.service.deleteJob(id);
  }
}
