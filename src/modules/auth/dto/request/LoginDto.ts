import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

const LoginSchema = z.strictObject({
  email: z.email().trim().toLowerCase(),
  password: z.string().min(1),
});

export class LoginDto extends createZodDto(LoginSchema) {}
