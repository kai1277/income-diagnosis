import { Injectable } from '@nestjs/common';
import { PrismaService } from '../db/prisma.service';

@Injectable()
export class BeautyAuthRepository {
  constructor(private readonly prisma: PrismaService) {}

  findByLineUserId(lineUserId: string) {
    return this.prisma.beautyUser.findUnique({ where: { line_user_id: lineUserId } });
  }

  createUser(data: {
    line_user_id: string;
    display_name?: string;
    picture_url?: string;
    email?: string;
  }) {
    return this.prisma.beautyUser.create({ data });
  }
}
