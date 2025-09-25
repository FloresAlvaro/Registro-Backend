import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@prisma';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { Role } from './entities/role.entity';

@Injectable()
export class RolesService {
  constructor(private prisma: PrismaService) {}

  async create(createRoleDto: CreateRoleDto): Promise<Role> {
    return this.prisma.role.create({
      data: createRoleDto,
    });
  }

  async findAll(status?: 'active' | 'inactive' | 'all'): Promise<Role[]> {
    let where = {};

    if (status === 'active') {
      where = { roleStatus: true };
    } else if (status === 'inactive') {
      where = { roleStatus: false };
    }
    // For 'all', undefined, or any other value, return all records
    // This ensures consistent behavior and eliminates confusion with "--" or other values

    return this.prisma.role.findMany({
      where,
      orderBy: { roleId: 'asc' },
    });
  }

  async findOne(id: number): Promise<Role> {
    const role = await this.prisma.role.findUnique({
      where: { roleId: id },
    });

    if (!role) {
      throw new NotFoundException(`Role with ID ${id} not found`);
    }

    return role;
  }

  async update(id: number, updateRoleDto: UpdateRoleDto): Promise<Role> {
    await this.findOne(id); // This will throw NotFoundException if not found

    return this.prisma.role.update({
      where: { roleId: id },
      data: updateRoleDto,
    });
  }

  async remove(id: number): Promise<Role> {
    await this.findOne(id); // This will throw NotFoundException if not found

    return this.prisma.role.delete({
      where: { roleId: id },
    });
  }

  async toggleStatus(id: number): Promise<Role> {
    const role = await this.findOne(id);

    return this.prisma.role.update({
      where: { roleId: id },
      data: { roleStatus: !role.roleStatus },
    });
  }
}
