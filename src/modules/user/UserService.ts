import { Injectable } from '@nestjs/common';

import { PageDto } from '@/common/dto/PageDto';
import { QueryDto } from '@/common/dto/QueryDto';
import { PrismaService } from '@/lib/prisma';

import { CreateUserDto, UpdateUserDto } from './dto/request';
import { UserDto } from './dto/response';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(
    query: Pick<QueryDto, 'isActive'>,
  ): Promise<UserDto[] | undefined> {
    return undefined;
  }

  async findByPagination(
    query: QueryDto,
  ): Promise<PageDto<UserDto> | undefined> {
    return undefined;
  }

  async findByUnique(id: string): Promise<UserDto | undefined> {
    return undefined;
  }

  async create(dto: CreateUserDto): Promise<void> {}

  async update(dto: UpdateUserDto): Promise<void> {}

  async toggle(id: string): Promise<void> {}

  async delete(id: string): Promise<void> {}
}
