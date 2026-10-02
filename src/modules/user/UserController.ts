import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Patch,
  Post,
  Put,
  Query,
  Version,
} from '@nestjs/common';

import { RoleConstant } from '@/common/constants';
import { ApiEndpoint, Auth, PreAuthorize } from '@/common/decorators';
import {
  FindIsActiveQueryDto,
  IdParamDto,
  PageDto,
  QueryDto,
} from '@/common/dto';

import { UserService } from './UserService';
import { CreateUserDto, UpdateUserDto } from './dto/request';
import { UserDto } from './dto/response';

@Controller('/users')
@Auth()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Version('1')
  @ApiEndpoint({
    summary: 'Find all users',
    description: 'Returns all users, optionally filtered by active status.',
    type: UserDto,
    isArray: true,
  })
  @Get('/find-all')
  @PreAuthorize(RoleConstant.ADMIN)
  async findAll(
    @Query() query: FindIsActiveQueryDto,
  ): Promise<UserDto[] | undefined> {
    return this.userService.findAll(query);
  }

  @Version('1')
  @ApiEndpoint({
    summary: 'Find users with pagination',
    description: 'Returns a page of users with pagination meta.',
    type: UserDto,
    isPaginated: true,
  })
  @Get('/find-by-pagination')
  @PreAuthorize(RoleConstant.ADMIN)
  async findByPagination(
    @Query() query: QueryDto,
  ): Promise<PageDto<UserDto> | undefined> {
    return this.userService.findByPagination(query);
  }

  @Version('1')
  @ApiEndpoint({
    summary: 'Find a user by id',
    type: UserDto,
  })
  @Get('/find-by-unique/:id')
  @PreAuthorize(RoleConstant.ADMIN)
  async findByUnique(
    @Param() { id }: IdParamDto,
  ): Promise<UserDto | undefined> {
    return this.userService.findByUnique(id);
  }

  @Version('1')
  @ApiEndpoint({
    summary: 'Create a user',
    status: HttpStatus.CREATED,
  })
  @Post()
  @PreAuthorize(RoleConstant.ADMIN)
  async create(@Body() dto: CreateUserDto): Promise<void> {
    await this.userService.create(dto);
  }

  @Version('1')
  @ApiEndpoint({ summary: 'Update a user' })
  @Put()
  @PreAuthorize(RoleConstant.ADMIN)
  async update(@Body() dto: UpdateUserDto): Promise<void> {
    await this.userService.update(dto);
  }

  @Version('1')
  @ApiEndpoint({
    summary: 'Toggle user active status',
    description: 'Switches the user between active and inactive.',
  })
  @Patch('/:id/toggle')
  @PreAuthorize(RoleConstant.ADMIN)
  async toggle(@Param() { id }: IdParamDto): Promise<void> {
    await this.userService.toggle(id);
  }

  @Version('1')
  @ApiEndpoint({ summary: 'Delete a user' })
  @Delete('/:id')
  @PreAuthorize(RoleConstant.ADMIN)
  async delete(@Param() { id }: IdParamDto): Promise<void> {
    await this.userService.delete(id);
  }
}
