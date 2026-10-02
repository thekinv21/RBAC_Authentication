import { Module } from '@nestjs/common';

import { UserModule } from '../user/UserModule';
import { AuthController } from './AuthController';
import { AuthService } from './AuthService';

@Module({
  imports: [UserModule],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
