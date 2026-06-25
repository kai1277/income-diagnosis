import { Injectable } from '@nestjs/common';
import { OccupationTypesRepository } from '../../../repositories/occupation-types.repository';
import { CreateOccupationTypeDto } from './occupation-types.schema';

@Injectable()
export class OccupationTypesService {
  constructor(private readonly repo: OccupationTypesRepository) {}

  getAll() {
    return this.repo.findAll();
  }

  create(dto: CreateOccupationTypeDto) {
    return this.repo.create(dto);
  }

  delete(id: string) {
    return this.repo.deleteById(id);
  }
}
