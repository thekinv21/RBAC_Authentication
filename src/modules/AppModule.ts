import { PrismaModule } from '@/lib/prisma/PrismaModule';
import { Module } from '@nestjs/common';
import { RoleModule } from './role/RoleModule';

@Module({
  imports: [PrismaModule, RoleModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
