import { Body, Controller, Post } from '@nestjs/common';
import { BeautyAuthService } from './beauty-auth.service';
import { BeautyLineAuthDto } from './beauty-auth.schema';

@Controller('beauty/auth')
export class BeautyAuthController {
  constructor(private readonly beautyAuthService: BeautyAuthService) {}

  @Post('line')
  lineLogin(@Body() dto: BeautyLineAuthDto) {
    return this.beautyAuthService.lineLogin(dto.id_token);
  }
}
