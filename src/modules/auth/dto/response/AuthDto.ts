import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

import { UserSchema } from '../../../user/dto/response/UserDto';

const AuthSchema = z.object({
  user: UserSchema,
  accessToken: z.string(),
  accessTokenExpireAt: z.iso.datetime(),
  refreshToken: z.string(),
  refreshTokenExpireAt: z.iso.datetime(),
});

export class AuthDto extends createZodDto(AuthSchema) {}
