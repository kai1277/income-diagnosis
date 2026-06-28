import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtGuard } from '../../../middleware/jwt.guard';
import { CurrentUserId } from '../../../decorators/current-user.decorator';
import { UserService } from './user.service';

@Controller('users')
@UseGuards(JwtGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('me')
  getMe(@CurrentUserId() userId: string) {
    return this.userService.getMe(userId);
  }
}
