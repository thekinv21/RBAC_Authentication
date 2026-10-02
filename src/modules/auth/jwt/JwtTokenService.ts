import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { JwtSignOptions } from '@nestjs/jwt';
import { JwtService } from '@nestjs/jwt';

import type { TJwtPayload } from '@/common/types';

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
      this.jwtService.signAsync(payload, {
        secret: this.accessSecret,
        expiresIn: this.accessExpiresIn,
      }),
      this.jwtService.signAsync(
        { sub: payload.sub, tokenVersion: payload.tokenVersion },
        { secret: this.refreshSecret, expiresIn: this.refreshExpiresIn },
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
   * @param refreshToken Refresh token issued by `generateTokens`
   * @returns This operation will return the user id (`sub`) and tokenVersion stored in the token
   * @throws When the token is invalid or expired
   */

  async verifyRefreshToken(
    refreshToken: string,
  ): Promise<{ sub: string; tokenVersion: number }> {
    const { sub, tokenVersion } = await this.jwtService.verifyAsync<{
      sub: string;
      tokenVersion: number;
    }>(refreshToken, { secret: this.refreshSecret });

    return { sub, tokenVersion };
  }

  private expiresAt(token: string): string {
    const { exp } = this.jwtService.decode<{ exp: number }>(token);

    return new Date(exp * 1000).toISOString();
  }
}
