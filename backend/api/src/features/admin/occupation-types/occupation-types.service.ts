import { Injectable } from '@nestjs/common';
import { OccupationTypesRepository } from '../../../repositories/occupation-types.repository';

@Injectable()
export class OccupationTypesService {
  constructor(private readonly repo: OccupationTypesRepository) {}

  getAll() {
    return this.repo.findAll();
  }
}
