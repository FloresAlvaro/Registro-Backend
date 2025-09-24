import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { StudentTeacherSubject } from '@prisma/client';
import { CreateStudentTeacherSubjectDto } from './dto/create-student-teacher-subject.dto';
import { UpdateStudentTeacherSubjectDto } from './dto/update-student-teacher-subject.dto';
import { StudentTeacherSubjectKey } from './interfaces/student-teacher-subject-key.interface';

@Injectable()
export class StudentTeacherSubjectsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    createStudentTeacherSubjectDto: CreateStudentTeacherSubjectDto,
  ): Promise<StudentTeacherSubject> {
    // Validate relationships exist
    const [student, teacher, subject, grade] = await Promise.all([
      this.prisma.student.findUnique({
        where: { studentId: createStudentTeacherSubjectDto.studentId },
      }),
      this.prisma.teacher.findUnique({
        where: { teacherId: createStudentTeacherSubjectDto.teacherId },
      }),
      this.prisma.subject.findUnique({
        where: { subjectID: createStudentTeacherSubjectDto.subjectId },
      }),
      this.prisma.grade.findUnique({
        where: { gradeId: createStudentTeacherSubjectDto.gradeId },
      }),
    ]);

    if (!student) {
      throw new NotFoundException(
        `Student with ID ${createStudentTeacherSubjectDto.studentId} not found`,
      );
    }
    if (!teacher) {
      throw new NotFoundException(
        `Teacher with ID ${createStudentTeacherSubjectDto.teacherId} not found`,
      );
    }
    if (!subject) {
      throw new NotFoundException(
        `Subject with ID ${createStudentTeacherSubjectDto.subjectId} not found`,
      );
    }
    if (!grade) {
      throw new NotFoundException(
        `Grade with ID ${createStudentTeacherSubjectDto.gradeId} not found`,
      );
    }

    try {
      const data = {
        ...createStudentTeacherSubjectDto,
        assignmentDate: createStudentTeacherSubjectDto.assignmentDate
          ? new Date(createStudentTeacherSubjectDto.assignmentDate)
          : new Date(),
        isActive: createStudentTeacherSubjectDto.isActive ?? true,
      };

      return await this.prisma.studentTeacherSubject.create({
        data,
        include: {
          student: {
            include: {
              user: true,
              grade: true,
            },
          },
          teacher: {
            include: {
              user: true,
            },
          },
          subject: true,
          grade: true,
        },
      });
    } catch (error) {
      if (error.code === 'P2002') {
        throw new ConflictException(
          'This student-teacher-subject assignment already exists for the given academic period',
        );
      }
      throw error;
    }
  }

  async findAll(): Promise<StudentTeacherSubject[]> {
    return await this.prisma.studentTeacherSubject.findMany({
      include: {
        student: {
          include: {
            user: true,
            grade: true,
          },
        },
        teacher: {
          include: {
            user: true,
          },
        },
        subject: true,
        grade: true,
      },
      orderBy: [
        { gradeId: 'asc' },
        { student: { user: { userFirstName: 'asc' } } },
        { teacher: { user: { userFirstLastName: 'asc' } } },
        { subject: { subjectName: 'asc' } },
      ],
    });
  }

  async findOne(key: StudentTeacherSubjectKey): Promise<StudentTeacherSubject> {
    const assignment = await this.prisma.studentTeacherSubject.findUnique({
      where: {
        studentId_teacherId_subjectId_academicPeriod: key,
      },
      include: {
        student: {
          include: {
            user: true,
            grade: true,
          },
        },
        teacher: {
          include: {
            user: true,
          },
        },
        subject: true,
        grade: true,
      },
    });

    if (!assignment) {
      throw new NotFoundException(
        `Student-teacher-subject assignment not found for the given key`,
      );
    }

    return assignment;
  }

  async findByStudent(studentId: number): Promise<StudentTeacherSubject[]> {
    const student = await this.prisma.student.findUnique({
      where: { studentId },
    });

    if (!student) {
      throw new NotFoundException(`Student with ID ${studentId} not found`);
    }

    return await this.prisma.studentTeacherSubject.findMany({
      where: { studentId },
      include: {
        student: {
          include: {
            user: true,
            grade: true,
          },
        },
        teacher: {
          include: {
            user: true,
          },
        },
        subject: true,
        grade: true,
      },
      orderBy: [
        { subject: { subjectName: 'asc' } },
        { academicPeriod: 'asc' },
      ],
    });
  }

  async findByTeacher(teacherId: number): Promise<StudentTeacherSubject[]> {
    const teacher = await this.prisma.teacher.findUnique({
      where: { teacherId },
    });

    if (!teacher) {
      throw new NotFoundException(`Teacher with ID ${teacherId} not found`);
    }

    return await this.prisma.studentTeacherSubject.findMany({
      where: { teacherId },
      include: {
        student: {
          include: {
            user: true,
            grade: true,
          },
        },
        teacher: {
          include: {
            user: true,
          },
        },
        subject: true,
        grade: true,
      },
      orderBy: [
        { gradeId: 'asc' },
        { student: { user: { firstName: 'asc' } } },
        { subject: { subjectName: 'asc' } },
      ],
    });
  }

  async findBySubject(subjectId: number): Promise<StudentTeacherSubject[]> {
    const subject = await this.prisma.subject.findUnique({
      where: { subjectID: subjectId },
    });

    if (!subject) {
      throw new NotFoundException(`Subject with ID ${subjectId} not found`);
    }

    return await this.prisma.studentTeacherSubject.findMany({
      where: { subjectId },
      include: {
        student: {
          include: {
            user: true,
            grade: true,
          },
        },
        teacher: {
          include: {
            user: true,
          },
        },
        subject: true,
        grade: true,
      },
      orderBy: [
        { gradeId: 'asc' },
        { student: { user: { firstName: 'asc' } } },
        { teacher: { user: { lastName: 'asc' } } },
      ],
    });
  }

  async findByGrade(gradeId: number): Promise<StudentTeacherSubject[]> {
    const grade = await this.prisma.grade.findUnique({
      where: { gradeId },
    });

    if (!grade) {
      throw new NotFoundException(`Grade with ID ${gradeId} not found`);
    }

    return await this.prisma.studentTeacherSubject.findMany({
      where: { gradeId },
      include: {
        student: {
          include: {
            user: true,
            grade: true,
          },
        },
        teacher: {
          include: {
            user: true,
          },
        },
        subject: true,
        grade: true,
      },
      orderBy: [
        { student: { user: { firstName: 'asc' } } },
        { subject: { subjectName: 'asc' } },
        { academicPeriod: 'asc' },
      ],
    });
  }

  async update(
    key: StudentTeacherSubjectKey,
    updateStudentTeacherSubjectDto: UpdateStudentTeacherSubjectDto,
  ): Promise<StudentTeacherSubject> {
    // First check if the assignment exists
    await this.findOne(key);

    try {
      const data = {
        ...updateStudentTeacherSubjectDto,
        assignmentDate: updateStudentTeacherSubjectDto.assignmentDate
          ? new Date(updateStudentTeacherSubjectDto.assignmentDate)
          : undefined,
      };

      return await this.prisma.studentTeacherSubject.update({
        where: {
          studentId_teacherId_subjectId_academicPeriod: key,
        },
        data,
        include: {
          student: {
            include: {
              user: true,
              grade: true,
            },
          },
          teacher: {
            include: {
              user: true,
            },
          },
          subject: true,
          grade: true,
        },
      });
    } catch (error) {
      if (error.code === 'P2002') {
        throw new ConflictException(
          'Cannot update: this would create a duplicate assignment',
        );
      }
      throw error;
    }
  }

  async remove(key: StudentTeacherSubjectKey): Promise<StudentTeacherSubject> {
    // First check if the assignment exists
    await this.findOne(key);

    return await this.prisma.studentTeacherSubject.delete({
      where: {
        studentId_teacherId_subjectId_academicPeriod: key,
      },
      include: {
        student: {
          include: {
            user: true,
            grade: true,
          },
        },
        teacher: {
          include: {
            user: true,
          },
        },
        subject: true,
        grade: true,
      },
    });
  }

  async findByAcademicPeriod(
    academicPeriod: string,
  ): Promise<StudentTeacherSubject[]> {
    return await this.prisma.studentTeacherSubject.findMany({
      where: { academicPeriod },
      include: {
        student: {
          include: {
            user: true,
            grade: true,
          },
        },
        teacher: {
          include: {
            user: true,
          },
        },
        subject: true,
        grade: true,
      },
      orderBy: [
        { gradeId: 'asc' },
        { student: { user: { firstName: 'asc' } } },
        { teacher: { user: { lastName: 'asc' } } },
        { subject: { subjectName: 'asc' } },
      ],
    });
  }

  async findActiveAssignments(): Promise<StudentTeacherSubject[]> {
    return await this.prisma.studentTeacherSubject.findMany({
      where: { isActive: true },
      include: {
        student: {
          include: {
            user: true,
            grade: true,
          },
        },
        teacher: {
          include: {
            user: true,
          },
        },
        subject: true,
        grade: true,
      },
      orderBy: [
        { gradeId: 'asc' },
        { student: { user: { firstName: 'asc' } } },
        { teacher: { user: { lastName: 'asc' } } },
        { subject: { subjectName: 'asc' } },
      ],
    });
  }

  async toggleActive(
    key: StudentTeacherSubjectKey,
  ): Promise<StudentTeacherSubject> {
    const assignment = await this.findOne(key);

    return await this.prisma.studentTeacherSubject.update({
      where: {
        studentId_teacherId_subjectId_academicPeriod: key,
      },
      data: {
        isActive: !assignment.isActive,
      },
      include: {
        student: {
          include: {
            user: true,
            grade: true,
          },
        },
        teacher: {
          include: {
            user: true,
          },
        },
        subject: true,
        grade: true,
      },
    });
  }
}