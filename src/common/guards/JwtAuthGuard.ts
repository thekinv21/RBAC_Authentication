import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

import type { Request } from 'express';

import type { TJwtPayload } from '@/common/types';
import { PrismaService } from '@/lib/prisma';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  private readonly accessSecret: string;

  constructor(
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
    configService: ConfigService,
  ) {
    this.accessSecret = configService.getOrThrow<string>('JWT_ACCESS_SECRET');
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context
      .switchToHttp()
      .getRequest<Request & { user?: TJwtPayload }>();

    const [type, token] = request.headers.authorization?.split(' ') ?? [];

    if (type !== 'Bearer' || !token) {
      throw new UnauthorizedException(
        'Authorization header is missing or invalid. Please provide a valid Bearer token.',
      );
    }

    let payload: TJwtPayload;

    try {
      payload = await this.jwtService.verifyAsync<TJwtPayload>(token, {
        secret: this.accessSecret,
      });
    } catch {
      throw new UnauthorizedException(
        'The access token is invalid or has expired. Please provide a valid access token.',
      );
    }

    /**
     * Verify token version matches current user token version
     */

    const user = await this.prisma.user.findUnique({
      where: { id: payload.sub },
      select: { tokenVersion: true, isActive: true },
    });

    if (!user || !user.isActive) {
      throw new UnauthorizedException('User account is not active.');
    }

    if (user.tokenVersion !== payload.tokenVersion) {
      throw new UnauthorizedException('Token has been revoked');
    }

    request.user = payload;

    return true;
  }
}
