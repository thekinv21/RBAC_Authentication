import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

const UpdateUserSchema = z.strictObject({
  id: z.uuid(),
  firstName: z.string().trim().min(1).max(100).optional(),
  lastName: z.string().trim().min(1).max(100).optional(),
  email: z.email().trim().toLowerCase().optional(),
  avatar: z.string().max(2048).nullable().optional(),
  isActive: z.boolean().optional(),
  roles: z.array(
    z.object({
      id: z.uuid(),
    }),
  ),
});

export class UpdateUserDto extends createZodDto(UpdateUserSchema) {}
