import { Module } from '@nestjs/common';
import { RequirementCodesController } from './requirement-codes.controller';
import { RequirementCodesService } from './requirement-codes.service';
import { RequirementCodesRepository } from '../../../repositories/requirement-codes.repository';

@Module({
  controllers: [RequirementCodesController],
  providers: [RequirementCodesService, RequirementCodesRepository],
})
export class RequirementCodesModule {}
