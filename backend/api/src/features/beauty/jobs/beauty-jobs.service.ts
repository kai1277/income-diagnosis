import { Injectable } from '@nestjs/common';
import { BeautyJobsRepository } from '../../../repositories/beauty-jobs.repository';
import { BeautyKeptJobsRepository } from '../../../repositories/beauty-kept-jobs.repository';
import type { Job } from '../../../generated/prisma/client';
import type { JobId } from '../diagnosis/beauty-diagnosis.types';

export type BeautyJobDto = {
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

// 美容系診断の職種IDを、一般診断で使われている職種コードにマッピングする
const OCCUPATION_CODES: Record<JobId, string[]> = {
  hair: ['hair_stylist'],
  nail: ['nail_technician'],
  lash: ['eyelash_technician', 'eyebrow_technician'],
  esthe: ['esthetician', 'therapist'],
};

// 求人検索の対象となる美容系職種コード（全職種）
export const ALL_BEAUTY_OCCUPATION_CODES = [
  'hair_stylist',
  'nail_technician',
  'eyelash_technician',
  'eyebrow_technician',
  'esthetician',
  'therapist',
];

export type BeautyJobSearchParams = {
  occupationCodes: string[];
  prefectureId?: string;
  salaryType?: string;
  keyword?: string;
};

function matchesKeyword(job: Job, keyword: string): boolean {
  const needle = keyword.trim().toLowerCase();
  if (!needle) return true;
  const jobTypes = Array.isArray(job.job_types) ? (job.job_types as string[]) : [];
  const haystacks = [job.title, job.job_location ?? '', ...jobTypes];
  return haystacks.some((text) => text.toLowerCase().includes(needle));
}

function toBeautyJobDto(job: Job): BeautyJobDto {
  return {
    id: job.id,
    imageUrl: job.image_url,
    imageBadge: job.badge_text,
    title: job.title,
    incomeRange: job.salary_text,
    location: job.job_location,
    jobTypes: Array.isArray(job.job_types) ? (job.job_types as string[]) : [],
    affiliateUrl: job.affiliate_url,
    impressionPixelUrl: job.impression_pixel_url,
  };
}

@Injectable()
export class BeautyJobsService {
  constructor(
    private readonly repo: BeautyJobsRepository,
    private readonly keptJobsRepo: BeautyKeptJobsRepository,
  ) {}

  async getJobsByJobId(jobId: JobId): Promise<BeautyJobDto[]> {
    const codes = OCCUPATION_CODES[jobId];
    if (!codes) return [];
    const jobs = await this.repo.findByOccupationCodes(codes);
    return jobs.map(toBeautyJobDto);
  }

  async keepJob(beautyUserId: string, jobId: string): Promise<void> {
    await this.keptJobsRepo.keep(beautyUserId, jobId);
  }

  async getKeptJobs(beautyUserId: string): Promise<BeautyJobDto[]> {
    const keptJobs = await this.keptJobsRepo.findJobsByUserId(beautyUserId);
    return keptJobs.map((keptJob) => toBeautyJobDto(keptJob.job));
  }

  async searchJobs(params: BeautyJobSearchParams): Promise<BeautyJobDto[]> {
    const codes = params.occupationCodes.length ? params.occupationCodes : ALL_BEAUTY_OCCUPATION_CODES;
    const jobs = await this.repo.search(codes, params.prefectureId, params.salaryType);
    const filtered = params.keyword ? jobs.filter((job) => matchesKeyword(job, params.keyword!)) : jobs;
    return filtered.map(toBeautyJobDto);
  }
}
