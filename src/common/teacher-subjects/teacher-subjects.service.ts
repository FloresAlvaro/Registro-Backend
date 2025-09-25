import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateTeacherSubjectDto } from './dto/create-teacher-subject.dto';
import { UpdateTeacherSubjectDto } from './dto/update-teacher-subject.dto';

@Injectable()
export class TeacherSubjectsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createTeacherSubjectDto: CreateTeacherSubjectDto) {
    const { teacherId, subjectId } = createTeacherSubjectDto;

    // Verify that teacher and subject exist
    const teacher = await this.prisma.teacher.findUnique({
      where: { teacherId: teacherId },
    });

    if (!teacher) {
      throw new NotFoundException(`Teacher with ID ${teacherId} not found`);
    }

    const subject = await this.prisma.subject.findUnique({
      where: { subjectID: subjectId },
    });

    if (!subject) {
      throw new NotFoundException(`Subject with ID ${subjectId} not found`);
    }

    try {
      return await this.prisma.teacherSubject.create({
        data: createTeacherSubjectDto,
        include: {
          teacher: {
            include: {
              user: true,
            },
          },
          subject: true,
        },
      });
    } catch (error: unknown) {
      if ((error as Record<string, any>).code === 'P2002') {
        throw new BadRequestException(
          'This teacher is already assigned to this subject',
        );
      }
      throw error;
    }
  }

  async findAll(teacherId?: number, subjectId?: number) {
    const where: Record<string, any> = {};

    if (teacherId) where.teacherId = teacherId;
    if (subjectId) where.subjectId = subjectId;

    return await this.prisma.teacherSubject.findMany({
      where,
      include: {
        teacher: {
          include: {
            user: true,
          },
        },
        subject: true,
      },
      orderBy: {
        teacherSubjectId: 'asc',
      },
    });
  }

  async findOne(id: number) {
    const teacherSubject = await this.prisma.teacherSubject.findUnique({
      where: { teacherSubjectId: id },
      include: {
        teacher: {
          include: {
            user: true,
          },
        },
        subject: true,
      },
    });

    if (!teacherSubject) {
      throw new NotFoundException(
        `Teacher Subject assignment with ID ${id} not found`,
      );
    }

    return teacherSubject;
  }

  async findByTeacher(teacherId: number) {
    const teacher = await this.prisma.teacher.findUnique({
      where: { teacherId: teacherId },
    });

    if (!teacher) {
      throw new NotFoundException(`Teacher with ID ${teacherId} not found`);
    }

    return await this.prisma.teacherSubject.findMany({
      where: { teacherId },
      include: {
        subject: true,
      },
      orderBy: {
        teacherSubjectId: 'asc',
      },
    });
  }

  async findBySubject(subjectId: number) {
    const subject = await this.prisma.subject.findUnique({
      where: { subjectID: subjectId },
    });

    if (!subject) {
      throw new NotFoundException(`Subject with ID ${subjectId} not found`);
    }

    return await this.prisma.teacherSubject.findMany({
      where: { subjectId },
      include: {
        teacher: {
          include: {
            user: true,
          },
        },
      },
      orderBy: {
        teacherSubjectId: 'asc',
      },
    });
  }

  async update(id: number, updateTeacherSubjectDto: UpdateTeacherSubjectDto) {
    const existingAssignment = await this.prisma.teacherSubject.findUnique({
      where: { teacherSubjectId: id },
    });

    if (!existingAssignment) {
      throw new NotFoundException(
        `Teacher Subject assignment with ID ${id} not found`,
      );
    }

    if (updateTeacherSubjectDto.teacherId) {
      const teacher = await this.prisma.teacher.findUnique({
        where: { teacherId: updateTeacherSubjectDto.teacherId },
      });

      if (!teacher) {
        throw new NotFoundException(
          `Teacher with ID ${updateTeacherSubjectDto.teacherId} not found`,
        );
      }
    }

    if (updateTeacherSubjectDto.subjectId) {
      const subject = await this.prisma.subject.findUnique({
        where: { subjectID: updateTeacherSubjectDto.subjectId },
      });

      if (!subject) {
        throw new NotFoundException(
          `Subject with ID ${updateTeacherSubjectDto.subjectId} not found`,
        );
      }
    }

    try {
      return await this.prisma.teacherSubject.update({
        where: { teacherSubjectId: id },
        data: updateTeacherSubjectDto,
        include: {
          teacher: {
            include: {
              user: true,
            },
          },
          subject: true,
        },
      });
    } catch (error: unknown) {
      if ((error as Record<string, any>).code === 'P2002') {
        throw new BadRequestException(
          'This teacher is already assigned to this subject',
        );
      }
      throw error;
    }
  }

  async remove(id: number) {
    const existingAssignment = await this.prisma.teacherSubject.findUnique({
      where: { teacherSubjectId: id },
    });

    if (!existingAssignment) {
      throw new NotFoundException(
        `Teacher Subject assignment with ID ${id} not found`,
      );
    }

    return await this.prisma.teacherSubject.delete({
      where: { teacherSubjectId: id },
      include: {
        teacher: {
          include: {
            user: true,
          },
        },
        subject: true,
      },
    });
  }

  async findActiveAssignments() {
    return await this.prisma.teacherSubject.findMany({
      include: {
        teacher: {
          include: {
            user: true,
          },
        },
        subject: true,
      },
      orderBy: [
        { teacher: { user: { userFirstLastName: 'asc' } } },
        { subject: { subjectName: 'asc' } },
      ],
    });
  }
}
