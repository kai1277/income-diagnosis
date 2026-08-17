import { Injectable, NotFoundException } from '@nestjs/common';
import { BeautyUserRepository } from '../../../repositories/beauty-user.repository';

@Injectable()
export class BeautyUserService {
  constructor(private readonly beautyUserRepository: BeautyUserRepository) {}

  async getMe(userId: string) {
    const user = await this.beautyUserRepository.findById(userId);
    if (!user) throw new NotFoundException('ユーザーが見つかりません');
    return user;
  }
}
