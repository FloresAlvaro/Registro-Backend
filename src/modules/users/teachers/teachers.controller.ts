import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  HttpStatus,
  Query,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
  ApiQuery,
} from '@nestjs/swagger';
import { TeachersService } from './teachers.service';
import { CreateTeacherDto } from './dto/create-teacher.dto';
import { UpdateTeacherDto } from './dto/update-teacher.dto';
import { Teacher } from './entities/teacher.entity';
import { SearchDto, PaginatedResponse } from '@shared';

@ApiTags('Teachers')
@Controller('teachers')
export class TeachersController {
  constructor(private readonly teachersService: TeachersService) {}

  @Post()
  @ApiOperation({
    summary: 'Create a new teacher',
    description: 'Register a new teacher in the system',
  })
  @ApiBody({
    type: CreateTeacherDto,
    description: 'Teacher registration data',
    examples: {
      mathTeacher: {
        summary: 'Mathematics Teacher Registration',
        value: {
          userId: 12,
          teacherExperienceYears: 5,
          teacherLicenseNumber: 'LIC-2024-001234',
          teacherHours: 40,
        },
      },
      scienceTeacher: {
        summary: 'Science Teacher Registration',
        value: {
          userId: 13,
          teacherExperienceYears: 3,
          teacherLicenseNumber: 'LIC-2024-005678',
          teacherHours: 35,
        },
      },
      newTeacher: {
        summary: 'New Teacher Registration',
        value: {
          userId: 14,
          teacherExperienceYears: 1,
          teacherLicenseNumber: 'LIC-2024-009999',
          teacherHours: 25,
        },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Teacher created successfully',
    type: Teacher,
    examples: {
      success: {
        summary: 'Teacher Created Successfully',
        value: {
          teacherId: 1,
          userId: 12,
          teacherExperienceYears: 5,
          teacherLicenseNumber: 'LIC-2024-001234',
          teacherHours: 40,
          createdAt: '2024-01-15T10:30:00.000Z',
          updatedAt: '2024-01-15T10:30:00.000Z',
          user: {
            userId: 12,
            userFirstName: 'Roberto',
            userSecondName: 'Carlos',
            userFirstLastName: 'Mendoza',
            userSecondLastName: 'Silva',
            userEmail: 'roberto.mendoza@school.edu.co',
            userCI: 87654321,
            userDateOfBirth: '1985-03-20T00:00:00.000Z',
            userAddress: 'Av. Educadores 456, Ciudad',
            userPhoneNumber: '+1987654321',
            userRoleId: 2,
            userStatus: true,
          },
        },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid input data',
    examples: {
      validation: {
        summary: 'Validation Error',
        value: {
          success: false,
          message: [
            'teacherCode must be unique',
            'teacherDepartment must not be empty',
          ],
          error: 'Bad Request',
          statusCode: 400,
          timestamp: '2024-01-15T10:30:00.000Z',
          path: '/teachers',
        },
      },
    },
  })
  create(@Body() createTeacherDto: CreateTeacherDto): Promise<Teacher> {
    return this.teachersService.create(createTeacherDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Get all teachers',
    description: 'Retrieve all teachers with their user information',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Teachers retrieved successfully',
    type: [Teacher],
    examples: {
      success: {
        summary: 'Teachers List',
        value: [
          {
            teacherId: 1,
            userId: 12,
            teacherExperienceYears: 5,
            teacherLicenseNumber: 'LIC-2024-001234',
            teacherHours: 40,
            createdAt: '2024-01-15T10:30:00.000Z',
            updatedAt: '2024-01-15T10:30:00.000Z',
            user: {
              userId: 12,
              userFirstName: 'Roberto',
              userSecondName: 'Carlos',
              userFirstLastName: 'Mendoza',
              userSecondLastName: 'Silva',
              userEmail: 'roberto.mendoza@school.edu.co',
              userCI: 87654321,
              userRoleId: 2,
              userStatus: true,
            },
          },
          {
            teacherId: 2,
            userId: 13,
            teacherExperienceYears: 3,
            teacherLicenseNumber: 'LIC-2024-005678',
            teacherHours: 35,
            createdAt: '2024-01-15T11:00:00.000Z',
            updatedAt: '2024-01-15T11:00:00.000Z',
            user: {
              userId: 13,
              userFirstName: 'Laura',
              userSecondName: 'Patricia',
              userFirstLastName: 'González',
              userSecondLastName: 'Herrera',
              userEmail: 'laura.gonzalez@school.edu.co',
              userCI: 23456789,
              userRoleId: 2,
              userStatus: true,
            },
          },
        ],
      },
    },
  })
  findAll(): Promise<Teacher[]> {
    return this.teachersService.findAll();
  }

  @Get('search')
  @ApiOperation({
    summary: 'Search teachers with advanced filtering and pagination',
  })
  @ApiQuery({
    name: 'search',
    required: false,
    description: 'Search term for teacher names',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Page number (default: 1)',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Items per page (default: 10)',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Teachers retrieved successfully with pagination',
    type: 'PaginatedResponse<Teacher>',
  })
  searchTeachers(
    @Query() filters: SearchDto,
  ): Promise<PaginatedResponse<Teacher>> {
    return this.teachersService.findAllAdvanced(filters);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a teacher by ID' })
  @ApiParam({ name: 'id', description: 'Teacher ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Teacher found',
    type: Teacher,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Teacher not found',
  })
  findOne(@Param('id', ParseIntPipe) id: number): Promise<Teacher> {
    return this.teachersService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a teacher by ID (no updateable fields)' })
  @ApiParam({ name: 'id', description: 'Teacher ID' })
  @ApiBody({ type: UpdateTeacherDto })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Teacher updated successfully (no changes)',
    type: Teacher,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Teacher not found',
  })
  update(@Param('id', ParseIntPipe) id: number): Promise<Teacher> {
    return this.teachersService.update(id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a teacher by ID' })
  @ApiParam({ name: 'id', description: 'Teacher ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Teacher deleted successfully',
    type: Teacher,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Teacher not found',
  })
  remove(@Param('id', ParseIntPipe) id: number): Promise<Teacher> {
    return this.teachersService.remove(id);
  }

  @Get('user/:userId')
  @ApiOperation({ summary: 'Get teacher by user ID' })
  @ApiParam({ name: 'userId', description: 'User ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Teacher found',
    type: Teacher,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Teacher not found',
  })
  findByUser(
    @Param('userId', ParseIntPipe) userId: number,
  ): Promise<Teacher | null> {
    return this.teachersService.findByUser(userId);
  }
}
