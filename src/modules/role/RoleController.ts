import { IdParamDto, PageDto, QueryDto } from '@/common/dto';
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
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateRoleDto, FindRolesQueryDto, UpdateRoleDto } from './dto/request';
import { RoleDto } from './dto/response';
import { RoleService } from './RoleService';

@ApiTags('Roles')
@Controller('roles')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Version('1')
  @ApiOperation({
    summary: 'Get all roles',
    description: 'This operation will retrieve all roles in the system.',
  })
  @Get('/find-all')
  async findAll(@Query() query: FindRolesQueryDto): Promise<RoleDto[]> {
    return this.roleService.findAll(query.isActive);
  }

  @Version('1')
  @ApiOperation({
    summary: 'Get roles with pagination',
    description:
      'This operation will retrieve roles with pagination support and an optional search term.',
  })
  @Get('/find-by-pagination')
  async findByPagination(@Query() query: QueryDto): Promise<PageDto<RoleDto>> {
    return this.roleService.findByPagination(query);
  }

  @Version('1')
  @ApiOperation({
    summary: 'Get role by unique identifier',
    description:
      'This operation will retrieve a role based on its unique identifier.',
  })
  @Get('/find-by-unique/:id')
  async findByUnique(@Param() { id }: IdParamDto): Promise<RoleDto> {
    return this.roleService.findByUnique(id);
  }

  @Version('1')
  @ApiOperation({
    summary: 'Create a new role',
    description:
      'This operation will create a new role in the system. You need to provide a unique name and an optional description for the role.',
  })
  @Post()
  async create(@Body() body: CreateRoleDto): Promise<void> {
    await this.roleService.create(body);
  }

  @Version('1')
  @ApiOperation({
    summary: 'Update an existing role',
    description:
      "This operation will update the details of an existing role. You can modify the role's name and description.",
  })
  @Put()
  async update(@Body() body: UpdateRoleDto): Promise<void> {
    await this.roleService.update(body);
  }

  @Version('1')
  @ApiOperation({
    summary: 'Toggle role active status',
    description:
      'This operation will toggle the active status of the role. If the role is currently active, it will be deactivated, and vice versa.',
  })
  @Patch('/:id/toggle')
  async toggle(@Param() { id }: IdParamDto): Promise<void> {
    await this.roleService.toggle(id);
  }

  @Version('1')
  @ApiOperation({
    summary: 'Delete a role',
    description:
      'This operation will permanently delete the role from the system. Use with caution.',
  })
  @Delete('/:id')
  async delete(@Param() { id }: IdParamDto): Promise<void> {
    await this.roleService.delete(id);
  }
}
