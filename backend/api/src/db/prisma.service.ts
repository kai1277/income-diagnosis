import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../generated/prisma/client';

@Injectable()
export class PrismaService implements OnModuleInit {
  private readonly client: PrismaClient;

  constructor() {
    const adapter = new PrismaPg({
      connectionString: process.env.DATABASE_URL!,
    });
    this.client = new PrismaClient({ adapter });
  }

  get job() {
    return this.client.job;
  }

  get jobRequirement() {
    return this.client.jobRequirement;
  }

  get requirementCode() {
    return this.client.requirementCode;
  }

  get occupationType() {
    return this.client.occupationType;
  }

  get prefecture() {
    return this.client.prefecture;
  }

  get city() {
    return this.client.city;
  }

  get user() {
    return this.client.user;
  }

  get beautyUser() {
    return this.client.beautyUser;
  }

  get beautyDiagnosisResult() {
    return this.client.beautyDiagnosisResult;
  }

  get beautyKeptJob() {
    return this.client.beautyKeptJob;
  }

  async onModuleInit() {
    await this.client.$connect();
  }
}
