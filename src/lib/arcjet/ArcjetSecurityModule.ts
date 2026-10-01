import { ArcjetGuard, ArcjetModule, fixedWindow, shield } from '@arcjet/nest';
import { Global, Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';

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
          max: 10,
        }),
      ],
    }),
  ],
  providers: [{ provide: APP_GUARD, useClass: ArcjetGuard }],
})
export class ArcjetSecurityModule {}
