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

@Injectable()
export class JwtAuthGuard implements CanActivate {
  private readonly accessSecret: string;

  constructor(
    private readonly jwtService: JwtService,
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

    try {
      request.user = await this.jwtService.verifyAsync<TJwtPayload>(token, {
        secret: this.accessSecret,
      });
    } catch {
      throw new UnauthorizedException(
        'The access token is invalid or has expired. Please provide a valid access token.',
      );
    }

    return true;
  }
}
