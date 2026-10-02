import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

import type { Request } from 'express';

import type { TJwtPayload } from '@/common/types';
import { PrismaService } from '@/lib/prisma';
import { JwtTokenService } from '@/modules/auth/jwt';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private readonly jwtTokenService: JwtTokenService,
    private readonly prisma: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context
      .switchToHttp()
      .getRequest<Request & { user?: TJwtPayload }>();

    const [type, token, ...rest] =
      request.headers.authorization?.split(' ') ?? [];

    if (type !== 'Bearer' || !token || rest.length) {
      throw new UnauthorizedException(
        'Authorization header is missing or invalid. Please provide a valid Bearer token.',
      );
    }

    let payload: TJwtPayload;

    try {
      payload = await this.jwtTokenService.verifyAccessToken(token);
    } catch {
      throw new UnauthorizedException(
        'The access token is invalid or has expired. Please provide a valid access token.',
      );
    }

    /**
     * Verify token version matches current user token version and read the
     * roles from the database so role changes apply immediately
     */

    const user = await this.prisma.user.findUnique({
      where: { id: payload.sub },
      select: {
        tokenVersion: true,
        isActive: true,
        roles: {
          where: { role: { isActive: true } },
          select: { role: { select: { name: true } } },
        },
      },
    });

    if (!user || !user.isActive || user.tokenVersion !== payload.tokenVersion) {
      throw new UnauthorizedException(
        'The access token is invalid or has expired. Please provide a valid access token.',
      );
    }

    request.user = {
      ...payload,
      roles: user.roles.map(({ role }) => role.name),
    };

    return true;
  }
}
