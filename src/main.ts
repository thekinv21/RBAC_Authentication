import { Logger, VersioningType } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { SwaggerModule } from '@nestjs/swagger';

import 'dotenv/config';

import { AllExceptionsFilter } from './common/filters';
import { ApiResponseInterceptor } from './common/interceptors';
import { AppValidationPipe } from './common/pipes';
import { swaggerConfig } from './config';
import { AppModule } from './modules/AppModule';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalInterceptors(new ApiResponseInterceptor());

  app.useGlobalPipes(new AppValidationPipe());

  app.useGlobalFilters(new AllExceptionsFilter());

  app.setGlobalPrefix('/api');

  app.enableVersioning({
    type: VersioningType.URI,
  });

  SwaggerModule.setup(
    '/docs',
    app,
    SwaggerModule.createDocument(app, swaggerConfig),
  );

  await app.listen(process.env.PORT ?? 4200);

  Logger.debug('Swagger UI running on server: http://localhost:4200/docs');
}
void bootstrap();
