import { Injectable } from '@nestjs/common';
import { PrismaService } from '../db/prisma.service';

@Injectable()
export class AuthRepository {
  constructor(private readonly prisma: PrismaService) {}

  findByLineUserId(lineUserId: string) {
    return this.prisma.user.findUnique({ where: { line_user_id: lineUserId } });
  }

  createUser(data: {
    line_user_id: string;
    display_name?: string;
    picture_url?: string;
    email?: string;
  }) {
    return this.prisma.user.create({ data });
  }
}
