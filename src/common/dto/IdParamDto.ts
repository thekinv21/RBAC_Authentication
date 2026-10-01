import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

const IdParamSchema = z.object({
  id: z.uuid(),
});

export class IdParamDto extends createZodDto(IdParamSchema) {}
