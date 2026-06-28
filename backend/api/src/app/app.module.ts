import { Module } from '@nestjs/common';
import { DatabaseModule } from '../db/database.module';
import { AdminJobsModule } from '../features/admin/jobs/admin-jobs.routes';
import { RequirementCodesModule } from '../features/admin/requirement-codes/requirement-codes.routes';
import { OccupationTypesModule } from '../features/admin/occupation-types/occupation-types.routes';
import { PrefecturesModule } from '../features/admin/prefectures/admin-prefectures.routes';
import { DiagnosisModule } from '../features/user/diagnosis/diagnosis.routes';
import { UserJobsModule } from '../features/user/jobs/user-jobs.routes';
import { AuthModule } from '../features/auth/auth.routes';
import { UserModule } from '../features/user/users/user.routes';

@Module({
  imports: [DatabaseModule, AdminJobsModule, RequirementCodesModule, OccupationTypesModule, PrefecturesModule, DiagnosisModule, UserJobsModule, AuthModule, UserModule],
})
export class AppModule {}
