import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

import { RoleConstant } from '@/common/constants';

const UpdateRoleSchema = z.strictObject({
  id: z.string().uuid(),
  name: z.enum(RoleConstant),
  description: z.string().max(255).optional(),
  isActive: z.boolean().optional(),
});

export class UpdateRoleDto extends createZodDto(UpdateRoleSchema) {}
