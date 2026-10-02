import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

import { RoleConstant } from '@/common/constants';

const CreateRoleSchema = z.strictObject({
  name: z.enum(RoleConstant),
  description: z.string().max(255).optional(),
  isActive: z.boolean().optional(),
});

export class CreateRoleDto extends createZodDto(CreateRoleSchema) {}
