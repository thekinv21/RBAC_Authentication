import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

const IsoDateSchema = z.codec(z.iso.datetime(), z.date(), {
  decode: (value) => new Date(value),
  encode: (value) => value.toISOString(),
});

export const UserSchema = z.object({
  id: z.uuid(),
  firstName: z.string(),
  lastName: z.string(),
  email: z.email(),
  avatar: z.string().nullable(),
  isEmailVerified: z.boolean(),
  tokenVersion: z.number().optional(),
  isActive: z.boolean(),
  roles: z.array(
    z.object({
      id: z.uuid(),
      name: z.string(),
    }),
  ),
  createdAt: IsoDateSchema.optional(),
  updatedAt: IsoDateSchema.optional(),
});

export class UserDto extends createZodDto(UserSchema) {}
