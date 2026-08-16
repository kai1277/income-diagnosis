import { Controller, Get, Query } from '@nestjs/common';
import { BeautyJobsService } from './beauty-jobs.service';
import type { JobId } from '../diagnosis/beauty-diagnosis.types';

const JOB_IDS: JobId[] = ['hair', 'nail', 'lash', 'esthe'];

function isJobId(value: string): value is JobId {
  return (JOB_IDS as string[]).includes(value);
}

@Controller('beauty/jobs')
export class BeautyJobsController {
  constructor(private readonly service: BeautyJobsService) {}

  @Get()
  getJobs(@Query('jobId') jobId: string) {
    if (!jobId || !isJobId(jobId)) return [];
    return this.service.getJobsByJobId(jobId);
  }
}
