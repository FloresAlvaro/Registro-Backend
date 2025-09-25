import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateGradeSubjectDto } from './dto/create-grade-subject.dto';
import { UpdateGradeSubjectDto } from './dto/update-grade-subject.dto';

@Injectable()
export class GradeSubjectsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createGradeSubjectDto: CreateGradeSubjectDto) {
    const { gradeId, subjectId } = createGradeSubjectDto;

    // Verify that grade and subject exist
    const grade = await this.prisma.grade.findUnique({
      where: { gradeId: gradeId },
    });

    if (!grade) {
      throw new NotFoundException(`Grade with ID ${gradeId} not found`);
    }

    const subject = await this.prisma.subject.findUnique({
      where: { subjectID: subjectId },
    });

    if (!subject) {
      throw new NotFoundException(`Subject with ID ${subjectId} not found`);
    }

    try {
      return await this.prisma.gradeSubject.create({
        data: createGradeSubjectDto,
        include: {
          grade: true,
          subject: true,
        },
      });
    } catch (error: any) {
      if (error.code === 'P2002') {
        throw new BadRequestException(
          'This subject is already assigned to this grade',
        );
      }
      throw error;
    }
  }

  async findAll(gradeId?: number, subjectId?: number) {
    const where: Record<string, any> = {};

    if (gradeId) where.gradeId = gradeId;
    if (subjectId) where.subjectId = subjectId;

    return await this.prisma.gradeSubject.findMany({
      where,
      include: {
        grade: true,
        subject: true,
      },
      orderBy: {
        gradeSubjectId: 'asc',
      },
    });
  }

  async findOne(id: number) {
    const gradeSubject = await this.prisma.gradeSubject.findUnique({
      where: { gradeSubjectId: id },
      include: {
        grade: true,
        subject: true,
      },
    });

    if (!gradeSubject) {
      throw new NotFoundException(
        `Grade Subject assignment with ID ${id} not found`,
      );
    }

    return gradeSubject;
  }

  async findByGrade(gradeId: number) {
    const grade = await this.prisma.grade.findUnique({
      where: { gradeId: gradeId },
    });

    if (!grade) {
      throw new NotFoundException(`Grade with ID ${gradeId} not found`);
    }

    return await this.prisma.gradeSubject.findMany({
      where: { gradeId },
      include: {
        subject: true,
      },
      orderBy: {
        gradeSubjectId: 'asc',
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

    return await this.prisma.gradeSubject.findMany({
      where: { subjectId },
      include: {
        grade: true,
      },
      orderBy: {
        gradeSubjectId: 'asc',
      },
    });
  }

  async update(id: number, updateGradeSubjectDto: UpdateGradeSubjectDto) {
    const existingAssignment = await this.prisma.gradeSubject.findUnique({
      where: { gradeSubjectId: id },
    });

    if (!existingAssignment) {
      throw new NotFoundException(
        `Grade Subject assignment with ID ${id} not found`,
      );
    }

    try {
      return await this.prisma.gradeSubject.update({
        where: { gradeSubjectId: id },
        data: updateGradeSubjectDto,
        include: {
          grade: true,
          subject: true,
        },
      });
    } catch (error: any) {
      if (error.code === 'P2002') {
        throw new BadRequestException(
          'This subject is already assigned to this grade',
        );
      }
      throw error;
    }
  }

  async remove(id: number) {
    const existingAssignment = await this.prisma.gradeSubject.findUnique({
      where: { gradeSubjectId: id },
    });

    if (!existingAssignment) {
      throw new NotFoundException(
        `Grade Subject assignment with ID ${id} not found`,
      );
    }

    return await this.prisma.gradeSubject.delete({
      where: { gradeSubjectId: id },
      include: {
        grade: true,
        subject: true,
      },
    });
  }
}
