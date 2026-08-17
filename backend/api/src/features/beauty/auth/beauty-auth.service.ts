import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { BeautyAuthRepository } from '../../../repositories/beauty-auth.repository';

interface LineIdTokenPayload {
  sub: string;
  name?: string;
  picture?: string;
  email?: string;
}

@Injectable()
export class BeautyAuthService {
  private readonly logger = new Logger(BeautyAuthService.name);

  constructor(private readonly beautyAuthRepository: BeautyAuthRepository) {}

  async lineLogin(idToken: string) {
    const payload = await this.verifyLineIdToken(idToken);

    let user = await this.beautyAuthRepository.findByLineUserId(payload.sub);
    if (!user) {
      user = await this.beautyAuthRepository.createUser({
        line_user_id: payload.sub,
        display_name: payload.name,
        picture_url: payload.picture,
        email: payload.email,
      });
    }

    const accessToken = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET!,
      { expiresIn: '30d' },
    );

    return { accessToken, user };
  }

  private async verifyLineIdToken(idToken: string): Promise<LineIdTokenPayload> {
    const params = new URLSearchParams({
      id_token: idToken,
      client_id: process.env.BEAUTY_LINE_CHANNEL_ID!,
    });

    const res = await fetch('https://api.line.me/oauth2/v2.1/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: params.toString(),
    });

    if (!res.ok) {
      const body = await res.text().catch(() => '(unreadable)');
      this.logger.error(
        `LINE token verify failed: status=${res.status} body=${body} channel_id=${process.env.BEAUTY_LINE_CHANNEL_ID}`,
      );
      throw new UnauthorizedException('LINEトークンの検証に失敗しました');
    }

    return res.json() as Promise<LineIdTokenPayload>;
  }
}
