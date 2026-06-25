import { Module } from '@nestjs/common';
import { DatabaseModule } from '../db/database.module';
import { AdminJobsModule } from '../features/admin/jobs/admin-jobs.routes';
import { RequirementCodesModule } from '../features/admin/requirement-codes/requirement-codes.routes';
import { OccupationTypesModule } from '../features/admin/occupation-types/occupation-types.routes';

@Module({
  imports: [DatabaseModule, AdminJobsModule, RequirementCodesModule, OccupationTypesModule],
})
export class AppModule {}
