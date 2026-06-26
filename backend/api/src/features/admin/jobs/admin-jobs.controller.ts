import { Body, Controller, Delete, Get, HttpCode, Param, Patch, Post } from '@nestjs/common';
import { AdminJobsService } from './admin-jobs.service';
import { CreateJobDto, UpdateJobDto } from './admin-jobs.schema';

@Controller('admin/jobs')
export class AdminJobsController {
  constructor(private readonly service: AdminJobsService) {}

  @Get()
  getJobs() {
    return this.service.getJobs();
  }

  @Get(':id')
  getJobById(@Param('id') id: string) {
    return this.service.getJobById(id);
  }

  @Post()
  @HttpCode(201)
  createJob(@Body() dto: CreateJobDto) {
    return this.service.createJob(dto);
  }

  @Patch(':id')
  updateJob(@Param('id') id: string, @Body() dto: UpdateJobDto) {
    return this.service.updateJob(id, dto);
  }

  @Delete(':id')
  @HttpCode(204)
  deleteJob(@Param('id') id: string) {
    return this.service.deleteJob(id);
  }
}
