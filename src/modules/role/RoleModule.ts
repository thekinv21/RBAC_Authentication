import { Module } from '@nestjs/common';

import { RoleController } from './RoleController';
import { RoleService } from './RoleService';

@Module({
  imports: [],
  controllers: [RoleController],
  providers: [RoleService],
})
export class RoleModule {}
