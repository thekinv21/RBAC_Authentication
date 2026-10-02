import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { JwtSignOptions, JwtVerifyOptions } from '@nestjs/jwt';
import { JwtService } from '@nestjs/jwt';

import { randomUUID } from 'node:crypto';

import type { TJwtPayload } from '@/common/types';

const ALGORITHM = 'HS256';
const ISSUER = 'rbac-auth';
const MIN_SECRET_LENGTH = 32;

type TTokenType = 'access' | 'refresh';

type TExpiresIn = JwtSignOptions['expiresIn'];

export type TTokenPair = {
  accessToken: string;
  accessTokenExpireAt: string;
  refreshToken: string;
  refreshTokenExpireAt: string;
};

@Injectable()
export class JwtTokenService {
  private readonly accessSecret: string;
  private readonly refreshSecret: string;
  private readonly accessExpiresIn: TExpiresIn;
  private readonly refreshExpiresIn: TExpiresIn;

  constructor(
    private readonly jwtService: JwtService,
    configService: ConfigService,
  ) {
    this.accessSecret = configService.getOrThrow<string>('JWT_ACCESS_SECRET');

    this.refreshSecret = configService.getOrThrow<string>('JWT_REFRESH_SECRET');

    if (
      this.accessSecret.length < MIN_SECRET_LENGTH ||
      this.refreshSecret.length < MIN_SECRET_LENGTH
    ) {
      throw new Error(
        `JWT secrets must be at least ${MIN_SECRET_LENGTH} characters long`,
      );
    }

    if (this.accessSecret === this.refreshSecret) {
      throw new Error('JWT_ACCESS_SECRET and JWT_REFRESH_SECRET must differ');
    }

    this.accessExpiresIn = configService.getOrThrow<string>(
      'JWT_ACCESS_EXPIRES_IN',
    ) as TExpiresIn;

    this.refreshExpiresIn = configService.getOrThrow<string>(
      'JWT_REFRESH_EXPIRES_IN',
    ) as TExpiresIn;
  }

  /**
   * @param payload Access token claims (`sub` doubles as the refresh token subject)
   * @returns This operation will sign an access/refresh token pair with their expiry dates
   */

  async generateTokens(payload: TJwtPayload): Promise<TTokenPair> {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        { ...payload, typ: 'access' satisfies TTokenType },
        {
          ...this.signOptions('access'),
          secret: this.accessSecret,
          expiresIn: this.accessExpiresIn,
        },
      ),
      this.jwtService.signAsync(
        {
          sub: payload.sub,
          tokenVersion: payload.tokenVersion,
          typ: 'refresh' satisfies TTokenType,
        },
        {
          ...this.signOptions('refresh'),
          secret: this.refreshSecret,
          expiresIn: this.refreshExpiresIn,
        },
      ),
    ]);

    return {
      accessToken,
      accessTokenExpireAt: this.expiresAt(accessToken),
      refreshToken,
      refreshTokenExpireAt: this.expiresAt(refreshToken),
    };
  }

  /**
   * @param accessToken Access token sent as a Bearer token
   * @returns This operation will return the verified access token claims
   * @throws When the signature, algorithm, issuer, audience, type or expiry is wrong
   */

  async verifyAccessToken(accessToken: string): Promise<TJwtPayload> {
    const payload = await this.jwtService.verifyAsync<
      TJwtPayload & { typ?: TTokenType }
    >(accessToken, {
      ...this.verifyOptions('access'),
      secret: this.accessSecret,
    });

    if (payload.typ !== 'access')
      throw new BadRequestException('Wrong token type');

    return payload;
  }

  /**
   * @param refreshToken Refresh token issued by `generateTokens`
   * @returns This operation will return the user id (`sub`) and tokenVersion stored in the token
   * @throws When the token is invalid or expired
   */

  async verifyRefreshToken(
    refreshToken: string,
  ): Promise<{ sub: string; tokenVersion: number }> {
    const { sub, tokenVersion, typ } = await this.jwtService.verifyAsync<{
      sub: string;
      tokenVersion: number;
      typ?: TTokenType;
    }>(refreshToken, {
      ...this.verifyOptions('refresh'),
      secret: this.refreshSecret,
    });

    if (typ !== 'refresh') throw new Error('Wrong token type');

    return { sub, tokenVersion };
  }

  private signOptions(type: TTokenType) {
    return {
      algorithm: ALGORITHM,
      issuer: ISSUER,
      audience: type,
      jwtid: randomUUID(),
    } as const;
  }

  private verifyOptions(type: TTokenType): JwtVerifyOptions {
    return { algorithms: [ALGORITHM], issuer: ISSUER, audience: type };
  }

  private expiresAt(token: string): string {
    const { exp } = this.jwtService.decode<{ exp: number }>(token);

    return new Date(exp * 1000).toISOString();
  }
}
