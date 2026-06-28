import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import type { AuthRequest } from '../middleware/jwt.guard';

export const CurrentUserId = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): string => {
    const req = ctx.switchToHttp().getRequest<AuthRequest>();
    return req.userId;
  },
);
