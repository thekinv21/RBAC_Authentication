import { Global, Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';

import { ArcjetGuard, ArcjetModule, fixedWindow, shield } from '@arcjet/nest';
import 'dotenv/config';

@Global()
@Module({
  imports: [
    ArcjetModule.forRoot({
      isGlobal: true,
      key: process.env.ARCJET_KEY!,
      rules: [
        shield({ mode: 'LIVE' }),
        fixedWindow({
          mode: 'LIVE',
          window: '60s',
          max: 100,
        }),
      ],
    }),
  ],
  providers: [{ provide: APP_GUARD, useClass: ArcjetGuard }],
})
export class ArcjetSecurityModule {}
