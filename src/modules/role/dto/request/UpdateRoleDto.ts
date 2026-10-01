import { RoleConstant } from '@/common/constants';
import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

const UpdateRoleSchema = z.object({
  id: z.string().uuid(),
  name: z.enum(RoleConstant),
  description: z.string().max(255).optional(),
  isActive: z.boolean().optional(),
});

export class UpdateRoleDto extends createZodDto(UpdateRoleSchema) {}
