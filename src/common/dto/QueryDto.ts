import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

const QuerySchema = z.object({
  offset: z.coerce.number().int().min(0).default(0),

  limit: z.coerce.number().int().min(1).max(100).default(10),

  searchTerm: z.string().trim().optional(),

  sortBy: z.enum(['asc', 'desc']).optional(),

  isActive: z.stringbool().optional(),
});

export class QueryDto extends createZodDto(QuerySchema) {}
