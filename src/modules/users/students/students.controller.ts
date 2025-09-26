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
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';
import { StudentsService } from './students.service';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { Student } from './entities/student.entity';

@ApiTags('Students')
@Controller('students')
export class StudentsController {
  constructor(private readonly studentsService: StudentsService) {}

  @Post()
  @ApiOperation({
    summary: 'Create a new student',
    description: 'Register a new student in the system',
  })
  @ApiBody({
    type: CreateStudentDto,
    description: 'Student registration data',
    examples: {
      basicStudent: {
        summary: 'Basic Student Registration',
        value: {
          userId: 15,
          studentCode: 'EST2024001',
          studentGrade: '10A',
          studentSection: 'Mañana',
          studentYear: 2024,
        },
      },
      completeStudent: {
        summary: 'Complete Student Registration',
        value: {
          userId: 16,
          studentCode: 'EST2024002',
          studentGrade: '11B',
          studentSection: 'Tarde',
          studentYear: 2024,
        },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Student created successfully',
    type: Student,
    examples: {
      success: {
        summary: 'Student Created Successfully',
        value: {
          studentId: 1,
          userId: 15,
          studentCode: 'EST2024001',
          studentGrade: '10A',
          studentSection: 'Mañana',
          studentYear: 2024,
          createdAt: '2024-01-15T10:30:00.000Z',
          updatedAt: '2024-01-15T10:30:00.000Z',
          user: {
            userId: 15,
            userFirstName: 'Ana',
            userSecondName: 'María',
            userFirstLastName: 'Rodríguez',
            userSecondLastName: 'García',
            userEmail: 'ana.rodriguez@student.edu.co',
            userDateOfBirth: '2008-05-12T00:00:00.000Z',
            userAddress: 'Calle Estudiantil 123, Ciudad',
            userPhoneNumber: '+1234567890',
            userRoleId: 3,
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
            'studentCode must be unique',
            'studentGrade must not be empty',
          ],
          error: 'Bad Request',
          statusCode: 400,
          timestamp: '2024-01-15T10:30:00.000Z',
          path: '/students',
        },
      },
    },
  })
  create(@Body() createStudentDto: CreateStudentDto): Promise<Student> {
    return this.studentsService.create(createStudentDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Get all students',
    description: 'Retrieve all students with their user information',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Students retrieved successfully',
    type: [Student],
    examples: {
      success: {
        summary: 'Students List',
        value: [
          {
            studentId: 1,
            userId: 15,
            studentCode: 'EST2024001',
            studentGrade: '10A',
            studentSection: 'Mañana',
            studentYear: 2024,
            createdAt: '2024-01-15T10:30:00.000Z',
            updatedAt: '2024-01-15T10:30:00.000Z',
            user: {
              userId: 15,
              userFirstName: 'Ana',
              userSecondName: 'María',
              userFirstLastName: 'Rodríguez',
              userSecondLastName: 'García',
              userEmail: 'ana.rodriguez@student.edu.co',
              userRoleId: 3,
              userStatus: true,
            },
          },
          {
            studentId: 2,
            userId: 16,
            studentCode: 'EST2024002',
            studentGrade: '11B',
            studentSection: 'Tarde',
            studentYear: 2024,
            createdAt: '2024-01-15T11:15:00.000Z',
            updatedAt: '2024-01-15T11:15:00.000Z',
            user: {
              userId: 16,
              userFirstName: 'Carlos',
              userSecondName: 'Eduardo',
              userFirstLastName: 'Martínez',
              userSecondLastName: 'López',
              userEmail: 'carlos.martinez@student.edu.co',
              userRoleId: 3,
              userStatus: true,
            },
          },
        ],
      },
    },
  })
  findAll(): Promise<Student[]> {
    return this.studentsService.findAll();
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get a student by ID',
    description: 'Retrieve a specific student with user details',
  })
  @ApiParam({
    name: 'id',
    description: 'Student unique identifier',
    example: 1,
    type: 'number',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Student found',
    type: Student,
    examples: {
      success: {
        summary: 'Student Details',
        value: {
          studentId: 1,
          userId: 15,
          studentCode: 'EST2024001',
          studentGrade: '10A',
          studentSection: 'Mañana',
          studentYear: 2024,
          createdAt: '2024-01-15T10:30:00.000Z',
          updatedAt: '2024-01-15T10:30:00.000Z',
          user: {
            userId: 15,
            userFirstName: 'Ana',
            userSecondName: 'María',
            userFirstLastName: 'Rodríguez',
            userSecondLastName: 'García',
            userEmail: 'ana.rodriguez@student.edu.co',
            userDateOfBirth: '2008-05-12T00:00:00.000Z',
            userAddress: 'Calle Estudiantil 123, Ciudad',
            userPhoneNumber: '+1234567890',
            userRoleId: 3,
            userStatus: true,
          },
        },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Student not found',
    examples: {
      notFound: {
        summary: 'Student Not Found',
        value: {
          success: false,
          message: 'Student not found',
          error: 'Not Found',
          statusCode: 404,
          timestamp: '2024-01-15T10:30:00.000Z',
          path: '/students/999',
        },
      },
    },
  })
  findOne(@Param('id', ParseIntPipe) id: number): Promise<Student> {
    return this.studentsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Update a student by ID',
    description: 'Update student academic information',
  })
  @ApiParam({
    name: 'id',
    description: 'Student unique identifier',
    example: 1,
    type: 'number',
  })
  @ApiBody({
    type: UpdateStudentDto,
    examples: {
      gradeChange: {
        summary: 'Change Grade Level',
        value: {
          studentGrade: '11A',
          studentYear: 2025,
        },
      },
      sectionChange: {
        summary: 'Change Section',
        value: {
          studentSection: 'Tarde',
        },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Student updated successfully',
    type: Student,
    examples: {
      success: {
        summary: 'Student Updated',
        value: {
          studentId: 1,
          userId: 15,
          studentCode: 'EST2024001',
          studentGrade: '11A',
          studentSection: 'Mañana',
          studentYear: 2025,
          createdAt: '2024-01-15T10:30:00.000Z',
          updatedAt: '2024-01-15T14:20:00.000Z',
        },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Student not found',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid input data',
  })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateStudentDto: UpdateStudentDto,
  ): Promise<Student> {
    return this.studentsService.update(id, updateStudentDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a student by ID' })
  @ApiParam({ name: 'id', description: 'Student ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Student deleted successfully',
    type: Student,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Student not found',
  })
  remove(@Param('id', ParseIntPipe) id: number): Promise<Student> {
    return this.studentsService.remove(id);
  }

  @Get('grade/:gradeId')
  @ApiOperation({ summary: 'Get all students by grade ID' })
  @ApiParam({ name: 'gradeId', description: 'Grade ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Students retrieved successfully',
    type: [Student],
  })
  findByGrade(
    @Param('gradeId', ParseIntPipe) gradeId: number,
  ): Promise<Student[]> {
    return this.studentsService.findByGrade(gradeId);
  }

  @Get('user/:userId')
  @ApiOperation({ summary: 'Get student by user ID' })
  @ApiParam({ name: 'userId', description: 'User ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Student found',
    type: Student,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Student not found',
  })
  findByUser(
    @Param('userId', ParseIntPipe) userId: number,
  ): Promise<Student | null> {
    return this.studentsService.findByUser(userId);
  }
}
