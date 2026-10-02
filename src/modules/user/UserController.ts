import { UserService } from './UserService';

import {
  FindIsActiveQueryDto,
  IdParamDto,
  PageDto,
  QueryDto,
} from '@/common/dto';

import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Query,
  Version,
} from '@nestjs/common';

import { CreateUserDto, UpdateUserDto } from './dto/request';
import { UserDto } from './dto/response';

@Controller('/users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Version('1')
  @Get('/find-all')
  async findAll(
    @Query() query: FindIsActiveQueryDto,
  ): Promise<UserDto[] | undefined> {
    return this.userService.findAll(query);
  }

  @Version('1')
  @Get('/find-by-pagination')
  async findByPagination(
    @Query() query: QueryDto,
  ): Promise<PageDto<UserDto> | undefined> {
    return this.userService.findByPagination(query);
  }

  @Version('1')
  @Get('/find-by-unique/:id')
  async findByUnique(
    @Param() { id }: IdParamDto,
  ): Promise<UserDto | undefined> {
    return this.userService.findByUnique(id);
  }

  @Version('1')
  @Post()
  async create(@Body() dto: CreateUserDto): Promise<void> {
    this.userService.create(dto);
  }

  @Version('1')
  @Put()
  async update(@Body() dto: UpdateUserDto): Promise<void> {
    this.userService.update(dto);
  }

  @Version('1')
  @Patch('/:id/toggle')
  async toggle(@Param() { id }: IdParamDto): Promise<void> {
    this.userService.toggle(id);
  }

  @Version('1')
  @Delete('/:id')
  async delete(@Param() { id }: IdParamDto): Promise<void> {
    this.userService.delete(id);
  }
}
