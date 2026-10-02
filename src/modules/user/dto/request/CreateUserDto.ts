import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

const CreateUserSchema = z.object({});

export class CreateUserDto extends createZodDto(CreateUserSchema) {}
