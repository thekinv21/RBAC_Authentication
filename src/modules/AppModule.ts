import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { ArcjetSecurityModule } from '@/lib/arcjet/ArcjetSecurityModule';
import { PrismaModule } from '@/lib/prisma/PrismaModule';

import { RoleModule } from './role/RoleModule';
import { UserModule } from './user/UserModule';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ArcjetSecurityModule,
    PrismaModule,
    RoleModule,
    UserModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
