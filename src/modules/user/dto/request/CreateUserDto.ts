import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

const CreateUserSchema = z.object({
  firstName: z.string().trim().min(1).max(100),
  lastName: z.string().trim().min(1).max(100),
  email: z.email().trim().toLowerCase(),
  password: z.string().min(8).max(72),
  avatar: z.string().max(2048).optional(),
  isActive: z.boolean().optional(),
  roles: z.array(
    z.object({
      id: z.uuid(),
    }),
  ),
});

export class CreateUserDto extends createZodDto(CreateUserSchema) {}
