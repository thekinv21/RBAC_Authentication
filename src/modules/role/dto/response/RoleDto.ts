import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

const IsoDateSchema = z.codec(z.iso.datetime(), z.date(), {
  decode: (value) => new Date(value),
  encode: (value) => value.toISOString(),
});

const RoleSchema = z.object({
  id: z.uuid(),
  name: z.string(),
  description: z.string().optional(),
  isActive: z.boolean(),
  createdAt: IsoDateSchema.optional(),
  updatedAt: IsoDateSchema.optional(),
});

export class RoleDto extends createZodDto(RoleSchema) {}
