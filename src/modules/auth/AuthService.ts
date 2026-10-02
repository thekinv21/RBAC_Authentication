import {
  BadRequestException,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';

import { verify } from 'argon2';

import { RoleConstant } from '@/common/constants';
import type { TJwtPayload } from '@/common/types';
import { PrismaService } from '@/lib/prisma';

import { UserService } from '../user/UserService';
import { UserDto } from '../user/dto/response';
import { LoginDto, RefreshTokenDto, RegisterDto } from './dto/request';
import { AuthDto } from './dto/response';
import { JwtTokenService } from './jwt';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly userService: UserService,
    private readonly jwtTokenService: JwtTokenService,
  ) {}

  /**
   * @param dto Registration data (firstName, lastName, email, password)
   * @returns void
   * @description The role is always USER and never comes from the request.
   */

  async register(dto: RegisterDto): Promise<void> {
    const role = await this.prisma.role.findUnique({
      where: { name: RoleConstant.USER },
      select: { id: true },
    });

    if (!role) {
      this.logger.error(
        `Role "${RoleConstant.USER}" does not exist. Seed the roles table before registering users.`,
      );
      throw new BadRequestException('USER role cannot be exist on system');
    }

    const { firstName, lastName, email, password } = dto;

    await this.userService.create({
      firstName,
      lastName,
      email,
      password,
      roles: [{ id: role.id }],
    });
  }

  /**
   * @param dto Login credentials
   * @returns This operation will retrieve the user and a fresh token pair
   */

  async login({ email, password }: LoginDto): Promise<AuthDto> {
    const user = await this.prisma.user.findUnique({
      where: { email },
      include: {
        roles: { select: { role: { select: { id: true, name: true } } } },
      },
    });

    const dummyHash: string =
      '$argon2id$v=19$m=65536,p=4,t=3$DpzYKDG+NIhdDx42FsYzYg$juMdWcl34nb0MABNYhaZhPFDqNgTjbblWEDS2F4osJc';

    const isValid = await verify(user?.password ?? dummyHash, password);

    if (!user || !isValid || !user.isActive) {
      throw new UnauthorizedException('Invalid email or password.');
    }

    const { password: _password, roles, ...profile } = user;

    return this.issueTokens({
      ...profile,
      roles: roles.map(({ role }) => role),
    });
  }

  /**
   * @param dto Refresh token issued by login or a previous refresh
   * @returns This operation will retrieve the user and a fresh token pair,
   * with roles read from the database
   */

  async refresh({ refreshToken }: RefreshTokenDto): Promise<AuthDto> {
    let sub: string;

    try {
      sub = await this.jwtTokenService.verifyRefreshToken(refreshToken);
    } catch {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }

    const user = await this.userService.findByUnique(sub);

    if (!user?.isActive) {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }

    return this.issueTokens(user);
  }

  private async issueTokens(user: UserDto): Promise<AuthDto> {
    const payload = {
      sub: user.id,
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      roles: user.roles.map(({ name }) => name),
    } satisfies TJwtPayload;

    const tokens = await this.jwtTokenService.generateTokens(payload);

    return { user, ...tokens };
  }
}
