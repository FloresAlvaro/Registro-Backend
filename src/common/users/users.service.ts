import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    return this.prisma.user.create({
      data: {
        ...createUserDto,
        userDateOfBirth: new Date(createUserDto.userDateOfBirth),
      },
    });
  }

  async findAll(status?: 'active' | 'inactive' | 'all'): Promise<User[]> {
    let where = {};

    if (status === 'active') {
      where = { userStatus: true };
    } else if (status === 'inactive') {
      where = { userStatus: false };
    }
    // For 'all', undefined, or any other value, return all records
    // This ensures consistent behavior and eliminates confusion with "--" or other values

    return this.prisma.user.findMany({
      where,
      orderBy: { userId: 'asc' },
      include: {
        role: true,
        student: {
          include: {
            grade: true,
          },
        },
        teacher: true,
      },
    });
  }

  async findOne(id: number): Promise<User> {
    const user = await this.prisma.user.findUnique({
      where: { userId: id },
      include: {
        role: true,
        student: {
          include: {
            grade: true,
          },
        },
        teacher: true,
      },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    await this.findOne(id); // This will throw NotFoundException if not found

    const updateData: any = { ...updateUserDto };

    // Convert date string to Date object if provided
    if (updateUserDto.userDateOfBirth) {
      updateData.userDateOfBirth = new Date(updateUserDto.userDateOfBirth);
    }

    return this.prisma.user.update({
      where: { userId: id },
      data: updateData,
      include: {
        role: true,
        student: {
          include: {
            grade: true,
          },
        },
        teacher: true,
      },
    });
  }

  async remove(id: number): Promise<User> {
    await this.findOne(id); // This will throw NotFoundException if not found

    return this.prisma.user.delete({
      where: { userId: id },
    });
  }

  async toggleStatus(id: number): Promise<User> {
    const user = await this.findOne(id);

    return this.prisma.user.update({
      where: { userId: id },
      data: { userStatus: !user.userStatus },
      include: {
        role: true,
        student: {
          include: {
            grade: true,
          },
        },
        teacher: true,
      },
    });
  }
}
