import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

const RefreshTokenSchema = z.strictObject({
  refreshToken: z.string().min(1),
});

export class RefreshTokenDto extends createZodDto(RefreshTokenSchema) {}
