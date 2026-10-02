import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

// Dates are serialized to ISO strings on the wire, so Swagger documents the string form.
const IsoDateSchema = z.codec(z.iso.datetime(), z.date(), {
  decode: (value) => new Date(value),
  encode: (value) => value.toISOString(),
});

const RoleSchema = z.object({
  id: z.uuid(),
  name: z.string(),
  description: z.string().nullish(),
  isActive: z.boolean(),
  createdAt: IsoDateSchema.optional(),
  updatedAt: IsoDateSchema.optional(),
});

export class RoleDto extends createZodDto(RoleSchema) {}
