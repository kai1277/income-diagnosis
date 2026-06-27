import { Controller, Get, Query } from '@nestjs/common';
import { UserJobsService } from './user-jobs.service';

@Controller('user/jobs')
export class UserJobsController {
  constructor(private readonly service: UserJobsService) {}

  @Get()
  getJobs(@Query('codes') codes: string) {
    const codeList = codes ? codes.split(',').filter(Boolean) : [];
    return this.service.getJobsByOccupationCodes(codeList);
  }
}
