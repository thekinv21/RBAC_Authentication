import { createZodDto } from 'nestjs-zod';

import { CreateUserSchema } from '../../../user/dto/request/CreateUserDto';

const RegisterSchema = CreateUserSchema.pick({
  firstName: true,
  lastName: true,
  email: true,
  password: true,
});

export class RegisterDto extends createZodDto(RegisterSchema) {}
