import { Module } from '@nestjs/common';
import { PrefecturesController } from './admin-prefectures.controller';
import { PrefecturesService } from './admin-prefectures.service';
import { PrefecturesRepository } from '../../../repositories/admin-prefectures.repositories';

@Module({
  controllers: [PrefecturesController],
  providers: [PrefecturesService, PrefecturesRepository],
})
export class PrefecturesModule {}
