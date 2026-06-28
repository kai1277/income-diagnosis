import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LineAuthDto } from './auth.schema';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('line')
  lineLogin(@Body() dto: LineAuthDto) {
    return this.authService.lineLogin(dto.id_token);
  }
}
