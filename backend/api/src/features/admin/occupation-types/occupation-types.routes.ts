import { Module } from '@nestjs/common';
import { OccupationTypesController } from './occupation-types.controller';
import { OccupationTypesService } from './occupation-types.service';
import { OccupationTypesRepository } from '../../../repositories/occupation-types.repository';

@Module({
  controllers: [OccupationTypesController],
  providers: [OccupationTypesService, OccupationTypesRepository],
})
export class OccupationTypesModule {}
