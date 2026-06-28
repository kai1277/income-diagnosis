import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { AuthRepository } from '../../repositories/auth.repository';

interface LineIdTokenPayload {
  sub: string;
  name?: string;
  picture?: string;
  email?: string;
}

@Injectable()
export class AuthService {
  constructor(private readonly authRepository: AuthRepository) {}

  async lineLogin(idToken: string) {
    const payload = await this.verifyLineIdToken(idToken);

    let user = await this.authRepository.findByLineUserId(payload.sub);
    if (!user) {
      user = await this.authRepository.createUser({
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
      client_id: process.env.LINE_CHANNEL_ID!,
    });

    const res = await fetch('https://api.line.me/oauth2/v2.1/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: params.toString(),
    });

    if (!res.ok) {
      throw new UnauthorizedException('LINEトークンの検証に失敗しました');
    }

    return res.json() as Promise<LineIdTokenPayload>;
  }
}
