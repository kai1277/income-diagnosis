import { IsIn, IsObject } from 'class-validator';
import type { JobId } from './beauty-diagnosis.types';

const JOB_IDS: JobId[] = ['hair', 'nail', 'lash', 'esthe'];

export class BeautyDiagnoseDto {
  @IsIn(JOB_IDS)
  jobId!: JobId;

  @IsObject()
  answers!: Record<string, unknown>;
}
