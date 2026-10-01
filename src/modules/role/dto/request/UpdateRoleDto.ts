import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

const UpdateRoleSchema = z.object({
  id: z.string().uuid(),
  name: z.enum(['ADMIN', 'USER', 'OWNER', 'MANAGER']),
  description: z.string().max(255).optional(),
});

export class UpdateRoleDto extends createZodDto(UpdateRoleSchema) {}
