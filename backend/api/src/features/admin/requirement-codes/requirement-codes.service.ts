import { Injectable } from '@nestjs/common';
import { RequirementCodesRepository } from '../../../repositories/requirement-codes.repository';
import { CreateRequirementCodeDto } from './requirement-codes.schema';

@Injectable()
export class RequirementCodesService {
  constructor(private readonly repo: RequirementCodesRepository) {}

  getRequirementCodes() {
    return this.repo.findAll();
  }

  createRequirementCode(dto: CreateRequirementCodeDto) {
    return this.repo.create(dto);
  }

  deleteRequirementCode(id: string) {
    return this.repo.deleteById(id);
  }
}
