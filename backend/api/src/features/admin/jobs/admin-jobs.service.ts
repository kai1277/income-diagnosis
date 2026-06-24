import { Injectable } from '@nestjs/common';
import { AdminJobsRepository } from '../../../repositories/admin-jobs.repositories';
import { CreateJobDto } from './admin-jobs.schema';

@Injectable()
export class AdminJobsService {
  constructor(private readonly repo: AdminJobsRepository) {}

  getJobs() {
    return this.repo.findAll();
  }

  createJob(dto: CreateJobDto) {
    return this.repo.create(dto);
  }

  deleteJob(id: string) {
    return this.repo.deleteById(id);
  }
}
