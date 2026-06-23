import { Module } from '@nestjs/common';
import { DatabaseModule } from '../db/database.module';
import { AdminJobsModule } from '../features/admin/jobs/admin-jobs.routes';

@Module({
  imports: [DatabaseModule, AdminJobsModule],
})
export class AppModule {}
