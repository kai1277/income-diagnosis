import { Module } from '@nestjs/common';
import { BeautyUserController } from './beauty-user.controller';
import { BeautyUserService } from './beauty-user.service';
import { BeautyUserRepository } from '../../../repositories/beauty-user.repository';

@Module({
  controllers: [BeautyUserController],
  providers: [BeautyUserService, BeautyUserRepository],
})
export class BeautyUserModule {}
