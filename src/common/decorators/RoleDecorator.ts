import { CustomDecorator, SetMetadata } from '@nestjs/common';

import type { RoleConstant } from '@/common/constants';

export type TRoleName = (typeof RoleConstant)[keyof typeof RoleConstant];

export const ROLES_KEY = 'roles';

export const Roles = (...roles: TRoleName[]): CustomDecorator<string> =>
  SetMetadata(ROLES_KEY, roles);
