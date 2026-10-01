import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

const FindRolesQuerySchema = z.object({
  isActive: z.stringbool().optional(),
});

export class FindRolesQueryDto extends createZodDto(FindRolesQuerySchema) {}
