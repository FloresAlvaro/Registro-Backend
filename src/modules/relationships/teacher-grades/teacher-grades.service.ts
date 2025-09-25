import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '@prisma';
import { CreateTeacherGradeDto } from './dto/create-teacher-grade.dto';
import { UpdateTeacherGradeDto } from './dto/update-teacher-grade.dto';

@Injectable()
export class TeacherGradesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createTeacherGradeDto: CreateTeacherGradeDto) {
    const { teacherId, gradeId } = createTeacherGradeDto;

    // Verify that teacher and grade exist
    const teacher = await this.prisma.teacher.findUnique({
      where: { teacherId: teacherId },
    });

    if (!teacher) {
      throw new NotFoundException(`Teacher with ID ${teacherId} not found`);
    }

    const grade = await this.prisma.grade.findUnique({
      where: { gradeId: gradeId },
    });

    if (!grade) {
      throw new NotFoundException(`Grade with ID ${gradeId} not found`);
    }

    try {
      return await this.prisma.teacherGrade.create({
        data: createTeacherGradeDto,
        include: {
          teacher: {
            include: {
              user: true,
            },
          },
          grade: true,
        },
      });
    } catch (error: unknown) {
      if ((error as Record<string, any>).code === 'P2002') {
        throw new BadRequestException(
          'This teacher is already assigned to this grade',
        );
      }
      throw error;
    }
  }

  async findAll(teacherId?: number, gradeId?: number) {
    const where: Record<string, any> = {};

    if (teacherId) where.teacherId = teacherId;
    if (gradeId) where.gradeId = gradeId;

    return await this.prisma.teacherGrade.findMany({
      where,
      include: {
        teacher: {
          include: {
            user: true,
          },
        },
        grade: true,
      },
      orderBy: {
        teacherGradeId: 'asc',
      },
    });
  }

  async findOne(id: number) {
    const teacherGrade = await this.prisma.teacherGrade.findUnique({
      where: { teacherGradeId: id },
      include: {
        teacher: {
          include: {
            user: true,
          },
        },
        grade: true,
      },
    });

    if (!teacherGrade) {
      throw new NotFoundException(
        `Teacher Grade assignment with ID ${id} not found`,
      );
    }

    return teacherGrade;
  }

  async findByTeacher(teacherId: number) {
    const teacher = await this.prisma.teacher.findUnique({
      where: { teacherId: teacherId },
    });

    if (!teacher) {
      throw new NotFoundException(`Teacher with ID ${teacherId} not found`);
    }

    return await this.prisma.teacherGrade.findMany({
      where: { teacherId },
      include: {
        grade: true,
      },
      orderBy: {
        teacherGradeId: 'asc',
      },
    });
  }

  async findByGrade(gradeId: number) {
    const grade = await this.prisma.grade.findUnique({
      where: { gradeId: gradeId },
    });

    if (!grade) {
      throw new NotFoundException(`Grade with ID ${gradeId} not found`);
    }

    return await this.prisma.teacherGrade.findMany({
      where: { gradeId },
      include: {
        teacher: {
          include: {
            user: true,
          },
        },
      },
      orderBy: {
        teacherGradeId: 'asc',
      },
    });
  }

  async update(id: number, updateTeacherGradeDto: UpdateTeacherGradeDto) {
    const existingAssignment = await this.prisma.teacherGrade.findUnique({
      where: { teacherGradeId: id },
    });

    if (!existingAssignment) {
      throw new NotFoundException(
        `Teacher Grade assignment with ID ${id} not found`,
      );
    }

    if (updateTeacherGradeDto.teacherId) {
      const teacher = await this.prisma.teacher.findUnique({
        where: { teacherId: updateTeacherGradeDto.teacherId },
      });

      if (!teacher) {
        throw new NotFoundException(
          `Teacher with ID ${updateTeacherGradeDto.teacherId} not found`,
        );
      }
    }

    if (updateTeacherGradeDto.gradeId) {
      const grade = await this.prisma.grade.findUnique({
        where: { gradeId: updateTeacherGradeDto.gradeId },
      });

      if (!grade) {
        throw new NotFoundException(
          `Grade with ID ${updateTeacherGradeDto.gradeId} not found`,
        );
      }
    }

    try {
      return await this.prisma.teacherGrade.update({
        where: { teacherGradeId: id },
        data: updateTeacherGradeDto,
        include: {
          teacher: {
            include: {
              user: true,
            },
          },
          grade: true,
        },
      });
    } catch (error: unknown) {
      if ((error as Record<string, any>).code === 'P2002') {
        throw new BadRequestException(
          'This teacher is already assigned to this grade',
        );
      }
      throw error;
    }
  }

  async remove(id: number) {
    const existingAssignment = await this.prisma.teacherGrade.findUnique({
      where: { teacherGradeId: id },
    });

    if (!existingAssignment) {
      throw new NotFoundException(
        `Teacher Grade assignment with ID ${id} not found`,
      );
    }

    return await this.prisma.teacherGrade.delete({
      where: { teacherGradeId: id },
      include: {
        teacher: {
          include: {
            user: true,
          },
        },
        grade: true,
      },
    });
  }
}
