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
} from '@nestjs/common';

import { RoleConstant } from '@/common/constants';
import { ApiEndpoint, Auth, PreAuthorize } from '@/common/decorators';
import {
  FindIsActiveQueryDto,
  IdParamDto,
  PageDto,
  QueryDto,
} from '@/common/dto';

import { RoleService } from './RoleService';
import { CreateRoleDto, UpdateRoleDto } from './dto/request';
import { RoleDto } from './dto/response';

@Controller('roles')
@Auth()
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Get('/find-all')
  @PreAuthorize(RoleConstant.ADMIN)
  @ApiEndpoint({
    summary: 'Get all roles',
    description: 'This operation will retrieve all roles in the system.',
    type: RoleDto,
    isArray: true,
  })
  async findAll(@Query() query: FindIsActiveQueryDto): Promise<RoleDto[]> {
    return this.roleService.findAll(query.isActive);
  }

  @Get('/find-by-pagination')
  @PreAuthorize(RoleConstant.ADMIN)
  @ApiEndpoint({
    summary: 'Get roles with pagination',
    description:
      'This operation will retrieve roles with pagination support and an optional search term.',
    type: RoleDto,
    isArray: true,
    isPaginated: true,
  })
  async findByPagination(@Query() query: QueryDto): Promise<PageDto<RoleDto>> {
    return this.roleService.findByPagination(query);
  }

  @Get('/find-by-unique/:id')
  @PreAuthorize(RoleConstant.ADMIN)
  @ApiEndpoint({
    summary: 'Get role by unique identifier',
    description:
      'This operation will retrieve a role based on its unique identifier.',
    type: RoleDto,
    isArray: false,
  })
  async findByUnique(@Param() { id }: IdParamDto): Promise<RoleDto> {
    return this.roleService.findByUnique(id);
  }

  @Post()
  @PreAuthorize(RoleConstant.ADMIN)
  @ApiEndpoint({
    summary: 'Create a new role',
    description:
      'This operation will create a new role in the system. You need to provide a unique name and an optional description for the role.',
  })
  async create(@Body() body: CreateRoleDto): Promise<void> {
    await this.roleService.create(body);
  }

  @Put()
  @PreAuthorize(RoleConstant.ADMIN)
  @ApiEndpoint({
    summary: 'Update an existing role',
    description:
      "This operation will update the details of an existing role. You can modify the role's name and description.",
  })
  async update(@Body() body: UpdateRoleDto): Promise<void> {
    await this.roleService.update(body);
  }

  @Patch('/toggle/:id')
  @PreAuthorize(RoleConstant.ADMIN)
  @ApiEndpoint({
    summary: 'Toggle role active status',
    description:
      'This operation will toggle the active status of the role. If the role is currently active, it will be deactivated, and vice versa.',
  })
  async toggle(@Param() { id }: IdParamDto): Promise<void> {
    await this.roleService.toggle(id);
  }

  @Delete('/delete/:id')
  @PreAuthorize(RoleConstant.ADMIN)
  @ApiEndpoint({
    summary: 'Delete a role',
    description:
      'This operation will permanently delete the role from the system. Use with caution.',
  })
  async delete(@Param() { id }: IdParamDto): Promise<void> {
    await this.roleService.delete(id);
  }
}
