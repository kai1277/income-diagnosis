import { Controller, Get, HttpCode, Param, Post, Query, UseGuards } from '@nestjs/common';
import { BeautyJobsService } from './beauty-jobs.service';
import type { JobId } from '../diagnosis/beauty-diagnosis.types';
import { JwtGuard } from '../../../middleware/jwt.guard';
import { CurrentUserId } from '../../../decorators/current-user.decorator';

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

  @Get('search')
  searchJobs(
    @Query('occupationCodes') occupationCodes?: string,
    @Query('prefectureId') prefectureId?: string,
    @Query('salaryType') salaryType?: string,
    @Query('keyword') keyword?: string,
  ) {
    const codes = occupationCodes ? occupationCodes.split(',').filter(Boolean) : [];
    return this.service.searchJobs({ occupationCodes: codes, prefectureId, salaryType, keyword });
  }

  @Get('kept')
  @UseGuards(JwtGuard)
  getKeptJobs(@CurrentUserId() beautyUserId: string) {
    return this.service.getKeptJobs(beautyUserId);
  }

  @Post(':jobId/keep')
  @UseGuards(JwtGuard)
  @HttpCode(204)
  async keepJob(@Param('jobId') jobId: string, @CurrentUserId() beautyUserId: string) {
    await this.service.keepJob(beautyUserId, jobId);
  }
}
