import { Logger, VersioningType } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import type { NestExpressApplication } from '@nestjs/platform-express';
import { SwaggerModule } from '@nestjs/swagger';

import 'dotenv/config';
import helmet from 'helmet';

import { AllExceptionsFilter } from './common/filters';
import { ApiResponseInterceptor } from './common/interceptors';
import { AppValidationPipe } from './common/pipes';
import { swaggerConfig } from './config';
import { AppModule } from './modules/AppModule';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.disable('x-powered-by');

  app.use(helmet());

  app.useGlobalInterceptors(new ApiResponseInterceptor());

  app.useGlobalPipes(new AppValidationPipe());

  app.useGlobalFilters(new AllExceptionsFilter());

  app.setGlobalPrefix('/api');

  app.enableVersioning({
    type: VersioningType.URI,
  });

  const isProduction = process.env.NODE_ENV === 'production';

  if (!isProduction) {
    SwaggerModule.setup(
      '/docs',
      app,
      SwaggerModule.createDocument(app, swaggerConfig),
    );
  }

  await app.listen(process.env.PORT ?? 4200);

  if (!isProduction) {
    Logger.debug('Swagger UI running on server: http://localhost:4200/docs');
  }
}
void bootstrap();
