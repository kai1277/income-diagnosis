import { Injectable } from '@nestjs/common';
import { UserJobsRepository } from '../../../repositories/user-jobs.repository';

export type UserJobDto = {
  id: string;
  imageUrl: string | null;
  imageBadge: string | null;
  title: string;
  incomeRange: string;
  location: string | null;
  jobTypes: string[];
  affiliateUrl: string;
  impressionPixelUrl: string;
};

@Injectable()
export class UserJobsService {
  constructor(private readonly repo: UserJobsRepository) {}

  async getJobsByOccupationCodes(codes: string[]): Promise<UserJobDto[]> {
    if (!codes.length) return [];
    const jobs = await this.repo.findByOccupationCodes(codes);
    return jobs.map((job) => ({
      id: job.id,
      imageUrl: job.image_url,
      imageBadge: job.badge_text,
      title: job.title,
      incomeRange: job.salary_text,
      location: job.job_location,
      jobTypes: Array.isArray(job.job_types) ? (job.job_types as string[]) : [],
      affiliateUrl: job.affiliate_url,
      impressionPixelUrl: job.impression_pixel_url,
    }));
  }
}
