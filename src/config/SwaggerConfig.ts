import { DocumentBuilder } from '@nestjs/swagger';

export const swaggerConfig = new DocumentBuilder()
  .setTitle('RBAC Authentication & Authorization')
  .setDescription('RBAC Authentication & Authorization API documentation')
  .setVersion('1.0')
  .addBearerAuth()
  .build();
