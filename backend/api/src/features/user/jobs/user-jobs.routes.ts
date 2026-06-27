import { Module } from '@nestjs/common';
import { UserJobsController } from './user-jobs.controller';
import { UserJobsService } from './user-jobs.service';
import { UserJobsRepository } from '../../../repositories/user-jobs.repository';

@Module({
  controllers: [UserJobsController],
  providers: [UserJobsService, UserJobsRepository],
})
export class UserJobsModule {}
