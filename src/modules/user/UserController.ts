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

  @Get('/find-all')
  @PreAuthorize(RoleConstant.ADMIN)
  @ApiEndpoint({
    summary: 'Find all users',
    description: 'Returns all users, optionally filtered by active status.',
    type: UserDto,
    isArray: true,
  })
  async findAll(
    @Query() query: FindIsActiveQueryDto,
  ): Promise<UserDto[] | undefined> {
    return this.userService.findAll(query);
  }

  @Get('/find-by-pagination')
  @PreAuthorize(RoleConstant.ADMIN)
  @ApiEndpoint({
    summary: 'Find users with pagination',
    description: 'Returns a page of users with pagination meta.',
    type: UserDto,
    isPaginated: true,
  })
  async findByPagination(
    @Query() query: QueryDto,
  ): Promise<PageDto<UserDto> | undefined> {
    return this.userService.findByPagination(query);
  }

  @Get('/find-by-unique/:id')
  @PreAuthorize(RoleConstant.ADMIN)
  @ApiEndpoint({
    summary: 'Find a user by id',
    type: UserDto,
  })
  async findByUnique(
    @Param() { id }: IdParamDto,
  ): Promise<UserDto | undefined> {
    return this.userService.findByUnique(id);
  }

  @Post()
  @PreAuthorize(RoleConstant.ADMIN)
  @ApiEndpoint({
    summary: 'Create a user',
    status: HttpStatus.CREATED,
  })
  async create(@Body() dto: CreateUserDto): Promise<void> {
    await this.userService.create(dto);
  }

  @Put()
  @PreAuthorize(RoleConstant.ADMIN)
  @ApiEndpoint({ summary: 'Update a user' })
  async update(@Body() dto: UpdateUserDto): Promise<void> {
    await this.userService.update(dto);
  }

  @Patch('/toggle/:id')
  @PreAuthorize(RoleConstant.ADMIN)
  @ApiEndpoint({
    summary: 'Toggle user active status',
    description: 'Switches the user between active and inactive.',
  })
  async toggle(@Param() { id }: IdParamDto): Promise<void> {
    await this.userService.toggle(id);
  }

  @Delete('/delete/:id')
  @PreAuthorize(RoleConstant.ADMIN)
  @ApiEndpoint({ summary: 'Delete a user' })
  async delete(@Param() { id }: IdParamDto): Promise<void> {
    await this.userService.delete(id);
  }
}
