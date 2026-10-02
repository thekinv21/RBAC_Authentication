import { Global, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { UserModule } from '../user/UserModule';
import { AuthController } from './AuthController';
import { AuthService } from './AuthService';
import { JwtTokenService } from './jwt';

@Global()
@Module({
  imports: [JwtModule.register({}), UserModule],
  controllers: [AuthController],
  providers: [AuthService, JwtTokenService],
  exports: [JwtModule],
})
export class AuthModule {}
