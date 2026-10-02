import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { hash } from 'argon2';

import { FindIsActiveQueryDto, PageDto, QueryDto } from '@/common/dto';
import { PrismaService } from '@/lib/prisma';

import { CreateUserDto, UpdateUserDto } from './dto/request';
import { UserDto } from './dto/response';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * @param query Optional isActive filter
   * @returns This operation will retrieve the list of UserDto
   */

  async findAll({ isActive }: FindIsActiveQueryDto): Promise<UserDto[]> {
    const users = await this.prisma.user.findMany({
      where: { isActive },
      include: {
        roles: { select: { role: { select: { id: true, name: true } } } },
      },
      omit: {
        password: true,
        tokenVersion: true,
      },
      orderBy: { createdAt: 'asc' },
    });

    return users.map((user) => ({
      ...user,
      roles: user.roles.map(({ role }) => role),
    }));
  }

  /**
   * @param query QueryDto containing pagination parameters. The search term
   * matches first name, last name and email; sortBy orders by email.
   * @returns This operation will retrieve a page of UserDto
   */

  async findByPagination(query: QueryDto): Promise<PageDto<UserDto>> {
    const { offset, limit, searchTerm, sortBy, isActive } = query;

    const where = {
      isActive,
      ...(searchTerm && {
        OR: [
          { firstName: { contains: searchTerm, mode: 'insensitive' as const } },
          { lastName: { contains: searchTerm, mode: 'insensitive' as const } },
          { email: { contains: searchTerm, mode: 'insensitive' as const } },
        ],
      }),
    };

    const [users, total] = await this.prisma.$transaction([
      this.prisma.user.findMany({
        where,
        include: {
          roles: { select: { role: { select: { id: true, name: true } } } },
        },
        omit: {
          password: true,
          tokenVersion: true,
        },
        orderBy: sortBy ? { email: sortBy } : { createdAt: 'asc' },
        skip: offset,
        take: limit,
      }),
      this.prisma.user.count({ where }),
    ]);

    return PageDto.of(
      users.map((user) => ({
        ...user,
        roles: user.roles.map(({ role }) => role),
      })),
      total,
      { offset, limit },
    );
  }

  /**
   * @param id Unique identifier of the user
   * @returns This operation will retrieve a single UserDto
   */

  async findByUnique(id: string): Promise<UserDto> {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: {
        roles: { select: { role: { select: { id: true, name: true } } } },
      },
      omit: {
        password: true,
        tokenVersion: true,
      },
    });

    if (!user) throw new NotFoundException('User not found');

    return {
      ...user,
      roles: user.roles.map(({ role }) => role),
    };
  }

  /**
   * @param dto User creation data
   * @returns void
   */

  async create(dto: CreateUserDto): Promise<void> {
    const { firstName, lastName, email, avatar, isActive, password, roles } =
      dto;

    const existing = await this.prisma.user.findUnique({
      where: { email },
    });

    if (existing) throw new ConflictException('Email already in use!');

    await this.checkRoles({
      roles,
    });

    await this.prisma.user.create({
      data: {
        firstName,
        lastName,
        email,
        password: await hash(password),
        isActive,
        avatar,
        roles: roles && {
          create: [...new Set(roles)].map(({ id }) => ({ roleId: id })),
        },
      },
    });
  }

  /**
   * @param dto User update data. When roles is provided, the user's roles
   * are replaced with the given set.
   * @returns void
   * @description Bumps tokenVersion, revoking the user's tokens.
   */

  async update(dto: UpdateUserDto): Promise<void> {
    const { id, firstName, lastName, avatar, isActive, roles } = dto;

    await this.checkRoles({
      roles,
    });

    await this.prisma.user.update({
      where: { id },
      data: {
        firstName,
        lastName,
        avatar,
        isActive,
        tokenVersion: { increment: 1 },
        roles: roles && {
          deleteMany: {},
          create: [...new Set(roles)].map(({ id }) => ({ roleId: id })),
        },
      },
    });
  }

  /**
   * @param id Unique identifier of the user
   * @returns void
   */

  async toggle(id: string): Promise<void> {
    const existing = await this.findByUnique(id);

    const { count } = await this.prisma.user.updateMany({
      where: { id, isActive: existing.isActive },
      data: { isActive: !existing.isActive, tokenVersion: { increment: 1 } },
    });

    if (!count) {
      throw new ConflictException('User was modified concurrently, retry');
    }
  }

  /**
   * @param id Unique identifier of the user
   * @returns void
   * @description This operation will permanently delete the user and their
   * role assignments.
   */

  async delete(id: string): Promise<void> {
    await this.findByUnique(id);

    await this.prisma.user.delete({ where: { id } });
  }

  /**
   * @body roles Array
   */

  private async checkRoles({ roles }: Pick<CreateUserDto, 'roles'>) {
    if (roles) {
      const existing = await this.prisma.role.findMany({
        where: { id: { in: roles.map(({ id }) => id) } },
        select: { id: true },
      });
      const existingIds = new Set(existing.map(({ id }) => id));
      const missing = [...new Set(roles)].filter(
        ({ id }) => !existingIds.has(id),
      );

      if (missing.length) {
        throw new BadRequestException(`Roles not found: ${missing.join(', ')}`);
      }
    }
  }
}
