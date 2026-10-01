import { ArcjetSecurityModule } from '@/lib/arcjet/ArcjetSecurityModule';
import { PrismaModule } from '@/lib/prisma/PrismaModule';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { RoleModule } from './role/RoleModule';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ArcjetSecurityModule,
    PrismaModule,
    RoleModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
