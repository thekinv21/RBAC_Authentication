import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

const FindIsActiveQuerySchema = z.object({
  isActive: z.stringbool().optional(),
});

export class FindIsActiveQueryDto extends createZodDto(
  FindIsActiveQuerySchema,
) {}
