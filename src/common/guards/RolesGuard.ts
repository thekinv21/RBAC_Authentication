import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import type { Request } from 'express';

import { ROLES_KEY, type TRoleName } from '@/common/decorators';
import type { TJwtPayload } from '@/common/types';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const required = this.reflector.getAllAndOverride<TRoleName[] | undefined>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!required?.length) return true;

    const { user } = context
      .switchToHttp()
      .getRequest<Request & { user?: TJwtPayload }>();

    if (!user?.roles.some((role) => required.includes(role as TRoleName))) {
      throw new ForbiddenException(
        'You don`t have permission to access this resource.',
      );
    }

    return true;
  }
}
