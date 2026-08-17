import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtGuard } from '../../../middleware/jwt.guard';
import { CurrentUserId } from '../../../decorators/current-user.decorator';
import { BeautyUserService } from './beauty-user.service';

@Controller('beauty/users')
@UseGuards(JwtGuard)
export class BeautyUserController {
  constructor(private readonly beautyUserService: BeautyUserService) {}

  @Get('me')
  getMe(@CurrentUserId() userId: string) {
    return this.beautyUserService.getMe(userId);
  }
}
