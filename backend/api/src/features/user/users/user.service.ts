import { Injectable, NotFoundException } from '@nestjs/common';
import { UserRepository } from '../../../repositories/user.repository';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async getMe(userId: string) {
    const user = await this.userRepository.findById(userId);
    if (!user) throw new NotFoundException('ユーザーが見つかりません');
    return user;
  }
}
