import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateGradeRecordDto } from './dto/create-grade-record.dto';
import { UpdateGradeRecordDto } from './dto/update-grade-record.dto';

@Injectable()
export class GradeRecordsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createGradeRecordDto: CreateGradeRecordDto) {
    const { studentId, subjectId, gradeId } = createGradeRecordDto;

    // Verify that student, subject, and grade exist
    const student = await this.prisma.student.findUnique({
      where: { studentId: studentId },
    });

    if (!student) {
      throw new NotFoundException(`Student with ID ${studentId} not found`);
    }

    const subject = await this.prisma.subject.findUnique({
      where: { subjectID: subjectId },
    });

    if (!subject) {
      throw new NotFoundException(`Subject with ID ${subjectId} not found`);
    }

    const grade = await this.prisma.grade.findUnique({
      where: { gradeId: gradeId },
    });

    if (!grade) {
      throw new NotFoundException(`Grade with ID ${gradeId} not found`);
    }

    try {
      return await this.prisma.gradeRecord.create({
        data: {
          ...createGradeRecordDto,
          evaluationDate: createGradeRecordDto.evaluationDate
            ? new Date(createGradeRecordDto.evaluationDate)
            : new Date(),
        },
        include: {
          student: true,
          subject: true,
          grade: true,
        },
      });
    } catch (error: unknown) {
      if ((error as Record<string, any>).code === 'P2002') {
        throw new BadRequestException(
          'A grade record with these criteria already exists',
        );
      }
      throw error;
    }
  }

  async findAll(
    studentId?: number,
    subjectId?: number,
    gradeId?: number,
    academicPeriod?: string,
  ) {
    const where: Record<string, any> = {};

    if (studentId) where.studentId = studentId;
    if (subjectId) where.subjectId = subjectId;
    if (gradeId) where.gradeId = gradeId;
    if (academicPeriod) where.academicPeriod = academicPeriod;

    const result = await this.prisma.gradeRecord.findMany({
      where,
      include: {
        student: true,
        subject: true,
        grade: true,
      },
      orderBy: {
        evaluationDate: 'desc',
      },
    });

    return result;
  }

  async findOne(id: number) {
    const gradeRecord = await this.prisma.gradeRecord.findUnique({
      where: { gradeRecordId: id },
      include: {
        student: true,
        subject: true,
        grade: true,
      },
    });

    if (!gradeRecord) {
      throw new NotFoundException(`Grade Record with ID ${id} not found`);
    }

    return gradeRecord;
  }

  async findByStudent(studentId: number, academicPeriod?: string) {
    const student = await this.prisma.student.findUnique({
      where: { studentId: studentId },
    });

    if (!student) {
      throw new NotFoundException(`Student with ID ${studentId} not found`);
    }

    const where: Record<string, any> = { studentId };
    if (academicPeriod) where.academicPeriod = academicPeriod;

    return await this.prisma.gradeRecord.findMany({
      where,
      include: {
        subject: true,
        grade: true,
      },
      orderBy: [{ academicPeriod: 'desc' }, { evaluationDate: 'desc' }],
    });
  }

  async findBySubject(subjectId: number, academicPeriod?: string) {
    const subject = await this.prisma.subject.findUnique({
      where: { subjectID: subjectId },
    });

    if (!subject) {
      throw new NotFoundException(`Subject with ID ${subjectId} not found`);
    }

    const where: Record<string, any> = { subjectId };
    if (academicPeriod) where.academicPeriod = academicPeriod;

    return await this.prisma.gradeRecord.findMany({
      where,
      include: {
        student: true,
        grade: true,
      },
      orderBy: [{ academicPeriod: 'desc' }, { evaluationDate: 'desc' }],
    });
  }

  async update(id: number, updateGradeRecordDto: UpdateGradeRecordDto) {
    const existingRecord = await this.prisma.gradeRecord.findUnique({
      where: { gradeRecordId: id },
    });

    if (!existingRecord) {
      throw new NotFoundException(`Grade Record with ID ${id} not found`);
    }

    const updateData: Record<string, any> = { ...updateGradeRecordDto };

    if (updateGradeRecordDto.evaluationDate) {
      updateData.evaluationDate = new Date(updateGradeRecordDto.evaluationDate);
    }

    return await this.prisma.gradeRecord.update({
      where: { gradeRecordId: id },
      data: updateData,
      include: {
        student: true,
        subject: true,
        grade: true,
      },
    });
  }

  async remove(id: number) {
    const existingRecord = await this.prisma.gradeRecord.findUnique({
      where: { gradeRecordId: id },
    });

    if (!existingRecord) {
      throw new NotFoundException(`Grade Record with ID ${id} not found`);
    }

    return await this.prisma.gradeRecord.delete({
      where: { gradeRecordId: id },
      include: {
        student: true,
        subject: true,
        grade: true,
      },
    });
  }

  async getGradeStatistics(academicPeriod?: string) {
    const where: Record<string, any> = {};
    if (academicPeriod) where.academicPeriod = academicPeriod;

    const stats = await this.prisma.gradeRecord.aggregate({
      where,
      _avg: {
        score: true,
      },
      _min: {
        score: true,
      },
      _max: {
        score: true,
      },
      _count: true,
    });

    return {
      totalRecords: stats._count || 0,
      averageScore: stats._avg.score || 0,
      minimumScore: stats._min.score || 0,
      maximumScore: stats._max.score || 0,
    };
  }
}
