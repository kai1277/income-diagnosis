import { Module } from '@nestjs/common';
import { AdminJobsController } from './admin-jobs.controller';
import { AdminJobsService } from './admin-jobs.service';
import { AdminJobsRepository } from '../../../repositories/admin-jobs.repositories';

@Module({
  controllers: [AdminJobsController],
  providers: [AdminJobsService, AdminJobsRepository],
})
export class AdminJobsModule {}
