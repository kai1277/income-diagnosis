import { Injectable } from '@nestjs/common';
import { PrefecturesRepository } from '../../../repositories/admin-prefectures.repositories';

@Injectable()
export class PrefecturesService {
  constructor(private readonly repo: PrefecturesRepository) {}

  getPrefectures() {
    return this.repo.findAll();
  }

  getCitiesByPrefectureId(prefectureId: string) {
    return this.repo.findCitiesByPrefectureId(prefectureId);
  }
}
