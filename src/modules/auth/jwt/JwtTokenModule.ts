import { Global, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { JwtTokenService } from './JwtTokenService';

@Global()
@Module({
  imports: [JwtModule.register({})],
  providers: [JwtTokenService],
  exports: [JwtTokenService],
})
export class JwtTokenModule {}
