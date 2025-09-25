import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateGradeRecordDto } from './dto/create-grade-record.dto';
import { UpdateGradeRecordDto } from './dto/update-grade-record.dto';
import { BaseService } from '../base/base.service';
import { GradeRecord } from './entities/grade-record.entity';
import { DateUtils, ValidationUtils } from '../utils/common.utils';

@Injectable()
export class GradeRecordsService extends BaseService<
  GradeRecord,
  CreateGradeRecordDto,
  UpdateGradeRecordDto
> {
  constructor(prisma: PrismaService) {
    super(prisma, 'GradeRecord', 'gradeRecordId');
  }

  getModel() {
    return this.prisma.gradeRecord;
  }

  getIncludeOptions() {
    return {
      student: true,
      subject: true,
      grade: true,
    };
  }

  // Optimized create method - batch validation instead of N+1 queries
  async create(createGradeRecordDto: CreateGradeRecordDto) {
    const { studentId, subjectId, gradeId } = createGradeRecordDto;

    // Batch validation instead of separate queries
    const [student, subject, grade] = await Promise.all([
      this.prisma.student.findUnique({ where: { studentId } }),
      this.prisma.subject.findUnique({ where: { subjectID: subjectId } }),
      this.prisma.grade.findUnique({ where: { gradeId } }),
    ]);

    ValidationUtils.validateExists(student, studentId, 'Student');
    ValidationUtils.validateExists(subject, subjectId, 'Subject');
    ValidationUtils.validateExists(grade, gradeId, 'Grade');

    try {
      return await this.prisma.gradeRecord.create({
        data: {
          ...createGradeRecordDto,
          evaluationDate: DateUtils.safeParseDate(
            createGradeRecordDto.evaluationDate,
          ),
        },
        include: this.getIncludeOptions(),
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

  // Optimized bulk create method for multiple records
  async createMany(createGradeRecordDtos: CreateGradeRecordDto[]) {
    // Extract unique IDs for batch validation
    const studentIds = [
      ...new Set(createGradeRecordDtos.map((dto) => dto.studentId)),
    ];
    const subjectIds = [
      ...new Set(createGradeRecordDtos.map((dto) => dto.subjectId)),
    ];
    const gradeIds = [
      ...new Set(createGradeRecordDtos.map((dto) => dto.gradeId)),
    ];

    // Batch validation
    const [students, subjects, grades] = await Promise.all([
      this.prisma.student.findMany({
        where: { studentId: { in: studentIds } },
      }),
      this.prisma.subject.findMany({
        where: { subjectID: { in: subjectIds } },
      }),
      this.prisma.grade.findMany({
        where: { gradeId: { in: gradeIds } },
      }),
    ]);

    const studentMap = new Map(students.map((s) => [s.studentId, s]));
    const subjectMap = new Map(subjects.map((s) => [s.subjectID, s]));
    const gradeMap = new Map(grades.map((g) => [g.gradeId, g]));

    // Validate all references exist
    for (const dto of createGradeRecordDtos) {
      ValidationUtils.validateExists(
        studentMap.get(dto.studentId),
        dto.studentId,
        'Student',
      );
      ValidationUtils.validateExists(
        subjectMap.get(dto.subjectId),
        dto.subjectId,
        'Subject',
      );
      ValidationUtils.validateExists(
        gradeMap.get(dto.gradeId),
        dto.gradeId,
        'Grade',
      );
    }

    // Prepare data for batch insert
    const gradeRecordsData = createGradeRecordDtos.map((dto) => ({
      ...dto,
      evaluationDate: DateUtils.safeParseDate(dto.evaluationDate),
    }));

    // Use transaction for consistency
    return await this.prisma.$transaction(async (tx) => {
      const results = await Promise.all(
        gradeRecordsData.map((data) =>
          tx.gradeRecord.create({
            data,
            include: this.getIncludeOptions(),
          }),
        ),
      );
      return results;
    });
  }

  // Renamed to avoid BaseService conflict
  async findAllFiltered(
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

    return super.findAll(where);
  }

  // Optimized method - remove separate validation query
  async findByStudent(studentId: number, academicPeriod?: string) {
    const where: Record<string, any> = { studentId };
    if (academicPeriod) where.academicPeriod = academicPeriod;

    const records = await this.prisma.gradeRecord.findMany({
      where,
      include: {
        subject: true,
        grade: true,
        student: true, // Include to validate existence
      },
      orderBy: [{ academicPeriod: 'desc' }, { evaluationDate: 'desc' }],
    });

    // If no records found, validate that student exists
    if (records.length === 0) {
      const student = await this.prisma.student.findUnique({
        where: { studentId },
      });
      ValidationUtils.validateExists(student, studentId, 'Student');
    }

    return records;
  }

  // Optimized method - remove separate validation query
  async findBySubject(subjectId: number, academicPeriod?: string) {
    const where: Record<string, any> = { subjectId };
    if (academicPeriod) where.academicPeriod = academicPeriod;

    const records = await this.prisma.gradeRecord.findMany({
      where,
      include: {
        student: true,
        grade: true,
        subject: true, // Include to validate existence
      },
      orderBy: [{ academicPeriod: 'desc' }, { evaluationDate: 'desc' }],
    });

    // If no records found, validate that subject exists
    if (records.length === 0) {
      const subject = await this.prisma.subject.findUnique({
        where: { subjectID: subjectId },
      });
      ValidationUtils.validateExists(subject, subjectId, 'Subject');
    }

    return records;
  }

  async update(id: number, updateGradeRecordDto: UpdateGradeRecordDto) {
    const updateData: Record<string, any> = { ...updateGradeRecordDto };

    if (updateGradeRecordDto.evaluationDate) {
      updateData.evaluationDate = DateUtils.safeParseDate(
        updateGradeRecordDto.evaluationDate,
      );
    }

    return super.update(id, updateData);
  }

  // Optimized batch update method
  async updateMany(updates: Array<{ id: number; data: UpdateGradeRecordDto }>) {
    return await this.prisma.$transaction(async (tx) => {
      const results = await Promise.all(
        updates.map(({ id, data }) => {
          const updateData: Record<string, any> = { ...data };
          if (data.evaluationDate) {
            updateData.evaluationDate = DateUtils.safeParseDate(
              data.evaluationDate,
            );
          }

          return tx.gradeRecord.update({
            where: { gradeRecordId: id },
            data: updateData,
            include: this.getIncludeOptions(),
          });
        }),
      );
      return results;
    });
  }

  // Enhanced statistics with more efficient aggregation
  async getGradeStatistics(academicPeriod?: string) {
    const where: Record<string, any> = {};
    if (academicPeriod) where.academicPeriod = academicPeriod;

    const [stats, distribution] = await Promise.all([
      this.prisma.gradeRecord.aggregate({
        where,
        _avg: { score: true },
        _min: { score: true },
        _max: { score: true },
        _count: true,
      }),
      this.prisma.gradeRecord.groupBy({
        by: ['gradeId'],
        where,
        _count: true,
        _avg: { score: true },
        orderBy: { gradeId: 'asc' },
      }),
    ]);

    return {
      totalRecords: stats._count || 0,
      averageScore: stats._avg.score || 0,
      minimumScore: stats._min.score || 0,
      maximumScore: stats._max.score || 0,
      distribution: distribution.map((item) => ({
        gradeId: item.gradeId,
        count: item._count,
        averageScore: item._avg.score || 0,
      })),
    };
  }

  // New method for efficient grade summary by student
  async getStudentGradeSummary(studentId: number, academicPeriod?: string) {
    const where: Record<string, any> = { studentId };
    if (academicPeriod) where.academicPeriod = academicPeriod;

    return await this.prisma.gradeRecord.groupBy({
      by: ['subjectId'],
      where,
      _avg: { score: true },
      _count: true,
      _min: { score: true },
      _max: { score: true },
      orderBy: { subjectId: 'asc' },
    });
  }
}
