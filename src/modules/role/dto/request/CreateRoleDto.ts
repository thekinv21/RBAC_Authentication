import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

const CreateRoleSchema = z.object({
  name: z.enum(['ADMIN', 'USER', 'OWNER', 'MANAGER']),
  description: z.string().max(255).optional(),
});

export class CreateRoleDto extends createZodDto(CreateRoleSchema) {}
