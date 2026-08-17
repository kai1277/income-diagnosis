import { Module } from '@nestjs/common';
import { BeautyAuthController } from './beauty-auth.controller';
import { BeautyAuthService } from './beauty-auth.service';
import { BeautyAuthRepository } from '../../../repositories/beauty-auth.repository';

@Module({
  controllers: [BeautyAuthController],
  providers: [BeautyAuthService, BeautyAuthRepository],
})
export class BeautyAuthModule {}
