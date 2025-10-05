import { Injectable } from '@nestjs/common';
import { PrismaService } from '@prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import {
  BaseService,
  DateUtils,
  QueryUtils,
  StatusFilterDto,
  SearchDto,
  PaginatedResponse,
} from '@shared';

@Injectable()
export class UsersService extends BaseService<
  User,
  CreateUserDto,
  UpdateUserDto
> {
  constructor(prisma: PrismaService) {
    super(prisma, 'User', 'userId');
  }

  getModel() {
    return this.prisma.user;
  }

  getIncludeOptions() {
    return {
      role: true,
      student: {
        include: {
          grade: true,
        },
      },
      teacher: true,
    };
  }

  // Override create to handle date transformation
  async create(createUserDto: CreateUserDto): Promise<User> {
    const userData = {
      ...createUserDto,
      userDateOfBirth: DateUtils.safeParseDate(createUserDto.userDateOfBirth),
    };

    const model = this.getModel();
    return model.create({
      data: userData,
      include: this.getIncludeOptions(),
    });
  }

  // Override update to handle date transformation
  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    const updateData: Record<string, any> = { ...updateUserDto };

    // Convert date string to Date object if provided
    if (updateUserDto.userDateOfBirth) {
      updateData.userDateOfBirth = DateUtils.safeParseDate(
        updateUserDto.userDateOfBirth,
      );
    }

    return super.update(id, updateData);
  }

  // Enhanced findAll with filtering, search and pagination
  async findAllAdvanced(
    filters: StatusFilterDto & SearchDto,
  ): Promise<PaginatedResponse<User>> {
    const where = {
      ...QueryUtils.buildSearchWhere(['userName', 'userEmail'], filters.search),
      ...QueryUtils.buildStatusFilter(filters.status, 'userStatus'),
    };

    const { skip, take } = QueryUtils.buildPagination(
      filters.page,
      filters.limit,
    );

    const [users, total] = await Promise.all([
      this.prisma.user.findMany({
        where,
        skip,
        take,
        orderBy: QueryUtils.buildSort(filters.sortBy, filters.sortOrder),
        include: this.getIncludeOptions(),
      }),
      this.prisma.user.count({ where }),
    ]);

    const totalPages = Math.ceil(total / filters.limit!);

    return {
      data: users,
      meta: {
        total,
        page: filters.page!,
        limit: filters.limit!,
        totalPages,
      },
    };
  }

  // Legacy method for backward compatibility
  async findAllByStatus(
    status?: 'active' | 'inactive' | 'all',
  ): Promise<User[]> {
    const where = QueryUtils.buildStatusFilter(status, 'userStatus');
    return super.findAll(where);
  }

  async toggleStatus(id: number): Promise<User> {
    const user = await this.findOne(id);

    return this.prisma.user.update({
      where: { userId: id },
      data: { userStatus: !user.userStatus },
      include: this.getIncludeOptions(),
    });
  }
}
