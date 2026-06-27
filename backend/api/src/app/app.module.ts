import { Module } from '@nestjs/common';
import { DatabaseModule } from '../db/database.module';
import { AdminJobsModule } from '../features/admin/jobs/admin-jobs.routes';
import { RequirementCodesModule } from '../features/admin/requirement-codes/requirement-codes.routes';
import { OccupationTypesModule } from '../features/admin/occupation-types/occupation-types.routes';
import { PrefecturesModule } from '../features/admin/prefectures/admin-prefectures.routes';
import { DiagnosisModule } from '../features/user/diagnosis/diagnosis.routes';
import { UserJobsModule } from '../features/user/jobs/user-jobs.routes';

@Module({
  imports: [DatabaseModule, AdminJobsModule, RequirementCodesModule, OccupationTypesModule, PrefecturesModule, DiagnosisModule, UserJobsModule],
})
export class AppModule {}
