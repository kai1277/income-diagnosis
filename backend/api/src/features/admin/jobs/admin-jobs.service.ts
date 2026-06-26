import { Injectable, NotFoundException } from '@nestjs/common';
import { AdminJobsRepository } from '../../../repositories/admin-jobs.repositories';
import { CreateJobDto, UpdateJobDto } from './admin-jobs.schema';

@Injectable()
export class AdminJobsService {
  constructor(private readonly repo: AdminJobsRepository) {}

  getJobs() {
    return this.repo.findAll();
  }

  async getJobById(id: string) {
    const job = await this.repo.findById(id);
    if (!job) throw new NotFoundException(`Job ${id} not found`);
    return job;
  }

  createJob(dto: CreateJobDto) {
    return this.repo.create(dto);
  }

  async updateJob(id: string, dto: UpdateJobDto) {
    await this.getJobById(id);
    return this.repo.update(id, dto);
  }

  deleteJob(id: string) {
    return this.repo.deleteById(id);
  }
}
