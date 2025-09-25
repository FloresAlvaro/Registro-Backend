import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateTeacherDto } from './dto/create-teacher.dto';
import { Teacher } from './entities/teacher.entity';

@Injectable()
export class TeachersService {
  constructor(private prisma: PrismaService) {}

  async create(createTeacherDto: CreateTeacherDto): Promise<Teacher> {
    return this.prisma.teacher.create({
      data: createTeacherDto,
      include: {
        user: {
          include: {
            role: true,
          },
        },
      },
    });
  }

  async findAll(): Promise<Teacher[]> {
    return this.prisma.teacher.findMany({
      orderBy: { teacherId: 'asc' },
      include: {
        user: {
          include: {
            role: true,
          },
        },
      },
    });
  }

  async findOne(id: number): Promise<Teacher> {
    const teacher = await this.prisma.teacher.findUnique({
      where: { teacherId: id },
      include: {
        user: {
          include: {
            role: true,
          },
        },
      },
    });

    if (!teacher) {
      throw new NotFoundException(`Teacher with ID ${id} not found`);
    }

    return teacher;
  }

  async update(id: number): Promise<Teacher> {
    await this.findOne(id); // This will throw NotFoundException if not found

    // Since Teacher only has userId which shouldn't be updated,
    // this method exists for consistency but has no updateable fields
    return this.findOne(id);
  }

  async remove(id: number): Promise<Teacher> {
    await this.findOne(id); // This will throw NotFoundException if not found

    return this.prisma.teacher.delete({
      where: { teacherId: id },
    });
  }

  // Additional method specific to teachers
  async findByUser(userId: number): Promise<Teacher | null> {
    return this.prisma.teacher.findUnique({
      where: { userId },
      include: {
        user: {
          include: {
            role: true,
          },
        },
      },
    });
  }
}
