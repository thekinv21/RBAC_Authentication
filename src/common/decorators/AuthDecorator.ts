import { UseGuards, applyDecorators } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';

import { JwtAuthGuard } from '@/common/guards/JwtAuthGuard';
import { RolesGuard } from '@/common/guards/RolesGuard';

export const Auth = (): MethodDecorator & ClassDecorator =>
  applyDecorators(UseGuards(JwtAuthGuard, RolesGuard), ApiBearerAuth());
