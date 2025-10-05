import { Injectable } from '@nestjs/common';
import { PrismaService } from '@prisma';
import { CreateTeacherDto } from './dto/create-teacher.dto';
import { UpdateTeacherDto } from './dto/update-teacher.dto';
import { Teacher } from './entities/teacher.entity';
import { BaseService, QueryUtils, SearchDto, PaginatedResponse } from '@shared';

@Injectable()
export class TeachersService extends BaseService<
  Teacher,
  CreateTeacherDto,
  UpdateTeacherDto
> {
  constructor(prisma: PrismaService) {
    super(prisma, 'Teacher', 'teacherId');
  }

  getModel() {
    return this.prisma.teacher;
  }

  getIncludeOptions() {
    return {
      user: {
        include: {
          role: true,
        },
      },
    };
  }

  // Enhanced findAll with filtering, search and pagination
  async findAllAdvanced(
    filters: SearchDto,
  ): Promise<PaginatedResponse<Teacher>> {
    const where = {
      ...QueryUtils.buildSearchWhere(
        ['user.userName', 'user.userEmail'],
        filters.search,
      ),
    };

    const { skip, take } = QueryUtils.buildPagination(
      filters.page,
      filters.limit,
    );

    const [teachers, total] = await Promise.all([
      this.prisma.teacher.findMany({
        where,
        skip,
        take,
        orderBy: QueryUtils.buildSort(filters.sortBy, filters.sortOrder),
        include: this.getIncludeOptions(),
      }),
      this.prisma.teacher.count({ where }),
    ]);

    const totalPages = Math.ceil(total / filters.limit!);

    return {
      data: teachers,
      meta: {
        total,
        page: filters.page!,
        limit: filters.limit!,
        totalPages,
      },
    };
  }

  // Override update method since Teacher has no updateable fields
  async update(id: number): Promise<Teacher> {
    // Since Teacher only has userId which shouldn't be updated,
    // this method exists for consistency but has no updateable fields
    return this.findOne(id);
  }

  // Additional method specific to teachers
  async findByUser(userId: number): Promise<Teacher | null> {
    return this.prisma.teacher.findUnique({
      where: { userId },
      include: this.getIncludeOptions(),
    });
  }
}
