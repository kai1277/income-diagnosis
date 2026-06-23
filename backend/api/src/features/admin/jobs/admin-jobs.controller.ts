import { Body, Controller, Get, HttpCode, Post } from '@nestjs/common';
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
}
