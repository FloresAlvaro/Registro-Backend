import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { Student } from './entities/student.entity';

@Injectable()
export class StudentsService {
  constructor(private prisma: PrismaService) {}

  async create(createStudentDto: CreateStudentDto): Promise<Student> {
    return this.prisma.student.create({
      data: createStudentDto,
      include: {
        user: true,
        grade: true,
      },
    });
  }

  async findAll(): Promise<Student[]> {
    return this.prisma.student.findMany({
      orderBy: { studentId: 'asc' },
      include: {
        user: {
          include: {
            role: true,
          },
        },
        grade: true,
      },
    });
  }

  async findOne(id: number): Promise<Student> {
    const student = await this.prisma.student.findUnique({
      where: { studentId: id },
      include: {
        user: {
          include: {
            role: true,
          },
        },
        grade: true,
      },
    });

    if (!student) {
      throw new NotFoundException(`Student with ID ${id} not found`);
    }

    return student;
  }

  async update(
    id: number,
    updateStudentDto: UpdateStudentDto,
  ): Promise<Student> {
    await this.findOne(id); // This will throw NotFoundException if not found

    return this.prisma.student.update({
      where: { studentId: id },
      data: updateStudentDto,
      include: {
        user: {
          include: {
            role: true,
          },
        },
        grade: true,
      },
    });
  }

  async remove(id: number): Promise<Student> {
    await this.findOne(id); // This will throw NotFoundException if not found

    return this.prisma.student.delete({
      where: { studentId: id },
    });
  }

  // Additional methods specific to students
  async findByGrade(gradeId: number): Promise<Student[]> {
    return this.prisma.student.findMany({
      where: { gradeId },
      orderBy: { studentId: 'asc' },
      include: {
        user: {
          include: {
            role: true,
          },
        },
        grade: true,
      },
    });
  }

  async findByUser(userId: number): Promise<Student | null> {
    return this.prisma.student.findUnique({
      where: { userId },
      include: {
        user: {
          include: {
            role: true,
          },
        },
        grade: true,
      },
    });
  }
}
