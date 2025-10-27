import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@prisma';
import { CreateGradeDto } from './dto/create-grade.dto';
import { UpdateGradeDto } from './dto/update-grade.dto';
import { Grade } from './entities/grade.entity';

@Injectable()
export class GradesService {
  constructor(private prisma: PrismaService) {}

  async create(createGradeDto: CreateGradeDto): Promise<Grade> {
    return this.prisma.grade.create({
      data: createGradeDto,
    });
  }

  async findAll(status?: 'active' | 'inactive' | 'all'): Promise<Grade[]> {
    let where = {};

    if (status === 'active') {
      where = { gradeStatus: true };
    } else if (status === 'inactive') {
      where = { gradeStatus: false };
    }
    // For 'all', undefined, or any other value, return all records
    // This ensures consistent behavior and eliminates confusion with "--" or other values

    return this.prisma.grade.findMany({
      where,
      orderBy: { gradeId: 'asc' },
    });
  }

  async findOne(id: number): Promise<Grade> {
    const grade = await this.prisma.grade.findUnique({
      where: { gradeId: id },
    });

    if (!grade) {
      throw new NotFoundException(`Grade with ID ${id} not found`);
    }

    return grade;
  }

  async update(id: number, updateGradeDto: UpdateGradeDto): Promise<Grade> {
    await this.findOne(id); // This will throw NotFoundException if not found

    return this.prisma.grade.update({
      where: { gradeId: id },
      data: updateGradeDto,
    });
  }

  async remove(id: number): Promise<Grade> {
    await this.findOne(id); // This will throw NotFoundException if not found

    // Soft delete: set gradeStatus to false instead of physical deletion
    return this.prisma.grade.update({
      where: { gradeId: id },
      data: { gradeStatus: false },
    });
  }
}
