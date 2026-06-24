import { Module } from '@nestjs/common';
import { DatabaseModule } from '../db/database.module';
import { AdminJobsModule } from '../features/admin/jobs/admin-jobs.routes';
import { RequirementCodesModule } from '../features/admin/requirement-codes/requirement-codes.routes';

@Module({
  imports: [DatabaseModule, AdminJobsModule, RequirementCodesModule],
})
export class AppModule {}
