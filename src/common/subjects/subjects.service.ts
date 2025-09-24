import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateSubjectDto } from './dto/create-subject.dto';
import { UpdateSubjectDto } from './dto/update-subject.dto';
import { Subject } from './entities/subject.entity';

@Injectable()
export class SubjectsService {
  constructor(private prisma: PrismaService) {}

  async create(createSubjectDto: CreateSubjectDto): Promise<Subject> {
    return this.prisma.subject.create({
      data: createSubjectDto,
    });
  }

  async findAll(status?: 'active' | 'inactive' | 'all'): Promise<Subject[]> {
    let where = {};

    if (status === 'active') {
      where = { subjectStatus: true };
    } else if (status === 'inactive') {
      where = { subjectStatus: false };
    }
    // For 'all' or undefined, no where condition (returns all records)

    return this.prisma.subject.findMany({
      where,
      orderBy: { subjectID: 'asc' },
    });
  }

  async findOne(id: number): Promise<Subject> {
    const subject = await this.prisma.subject.findUnique({
      where: { subjectID: id },
    });

    if (!subject) {
      throw new NotFoundException(`Subject with ID ${id} not found`);
    }

    return subject;
  }

  async update(
    id: number,
    updateSubjectDto: UpdateSubjectDto,
  ): Promise<Subject> {
    await this.findOne(id); // This will throw NotFoundException if not found

    return this.prisma.subject.update({
      where: { subjectID: id },
      data: updateSubjectDto,
    });
  }

  async remove(id: number): Promise<Subject> {
    await this.findOne(id); // This will throw NotFoundException if not found

    return this.prisma.subject.delete({
      where: { subjectID: id },
    });
  }

  async toggleStatus(id: number): Promise<Subject> {
    const subject = await this.findOne(id);

    return this.prisma.subject.update({
      where: { subjectID: id },
      data: { subjectStatus: !subject.subjectStatus },
    });
  }
}
