import { Module } from '@nestjs/common';
import { BeautyJobsController } from './beauty-jobs.controller';
import { BeautyJobsService } from './beauty-jobs.service';
import { BeautyJobsRepository } from '../../../repositories/beauty-jobs.repository';
import { BeautyKeptJobsRepository } from '../../../repositories/beauty-kept-jobs.repository';

@Module({
  controllers: [BeautyJobsController],
  providers: [BeautyJobsService, BeautyJobsRepository, BeautyKeptJobsRepository],
})
export class BeautyJobsModule {}
