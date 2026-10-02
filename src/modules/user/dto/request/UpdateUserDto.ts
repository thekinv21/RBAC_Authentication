import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

const UpdateUserSchema = z.object({});

export class UpdateUserDto extends createZodDto(UpdateUserSchema) {}
