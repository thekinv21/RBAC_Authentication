import { PageDto, QueryDto } from '@/common/dto';
import { PrismaService } from '@/lib/prisma';
import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateRoleDto, UpdateRoleDto } from './dto/request';
import { RoleDto } from './dto/response';

@Injectable()
export class RoleService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * @param isActive Optional filter to retrieve only active or inactive roles
   * @returns This operation will retrieve the list of RoleDto
   */

  async findAll(isActive?: boolean): Promise<RoleDto[]> {
    return this.prisma.role.findMany({
      where: { isActive },
      orderBy: { createdAt: 'asc' },
    });
  }

  /**
   * @param query QueryDto containing pagination parameters
   * @returns This operation will retrieve a page of RoleDto. The search term
   * matches the role name and sortBy orders by the role name.
   */

  async findByPagination(query: QueryDto): Promise<PageDto<RoleDto>> {
    const { offset, limit, searchTerm, sortBy } = query;

    const where = searchTerm
      ? { name: { contains: searchTerm, mode: 'insensitive' as const } }
      : {};

    const [roles, total] = await this.prisma.$transaction([
      this.prisma.role.findMany({
        where,
        orderBy: sortBy ? { name: sortBy } : { createdAt: 'asc' },
        skip: offset,
        take: limit,
      }),
      this.prisma.role.count({ where }),
    ]);

    return PageDto.of(roles, total, { offset, limit });
  }

  /**
   * @param id Unique identifier of the role
   * @returns This operation will retrieve a single RoleDto based on the
   * provided unique identifier
   */

  async findByUnique(id: string): Promise<RoleDto> {
    const role = await this.prisma.role.findUnique({ where: { id } });

    if (!role) throw new NotFoundException('Role not found');

    return role;
  }

  /**
   * @param body Role creation data
   * @returns void
   */

  async create(body: CreateRoleDto): Promise<void> {
    const existingRole = await this.prisma.role.findUnique({
      where: { name: body.name },
    });

    if (existingRole) {
      throw new ConflictException('Role already exists!');
    }

    await this.prisma.role.create({ data: body });
  }

  /**
   * @param body Role update data
   * @returns void
   */

  async update(body: UpdateRoleDto): Promise<void> {
    const existing: RoleDto = await this.findByUnique(body.id);

    await this.prisma.role.update({
      where: { id: body.id },
      data: {
        id: existing.id,
        name: body.name ?? existing.name,
        description: body.description ?? existing.description,
        isActive: body.isActive ?? existing.isActive,
      },
    });
  }

  /**
   * @param id Unique identifier of the role
   * @returns void
   */

  async toggle(id: string): Promise<void> {
    const existing = await this.findByUnique(id);

    await this.prisma.role.update({
      where: { id },
      data: { isActive: !existing.isActive },
    });
  }

  /**
   * @param id Unique identifier of the role
   * @returns void
   * @description This operation will permanently delete the role from the
   * system. Use with caution.
   */

  async delete(id: string): Promise<void> {
    await this.findByUnique(id);

    const assignedUserCount: number = await this.prisma.userRole.count({
      where: { roleId: id },
    });

    if (assignedUserCount > 0) {
      throw new ConflictException(
        `This role assigned to ${assignedUserCount} user(s). Can't delete!`,
      );
    }

    await this.prisma.role.delete({ where: { id } });
  }
}
