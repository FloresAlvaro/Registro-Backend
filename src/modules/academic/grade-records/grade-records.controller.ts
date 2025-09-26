import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseIntPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
} from '@nestjs/swagger';
import { GradeRecordsService } from './grade-records.service';
import { CreateGradeRecordDto } from './dto/create-grade-record.dto';
import { UpdateGradeRecordDto } from './dto/update-grade-record.dto';

@ApiTags('Grade Records')
@Controller('grade-records')
export class GradeRecordsController {
  constructor(private readonly gradeRecordsService: GradeRecordsService) {}

  @Post()
  @ApiOperation({
    summary: 'Create a new grade record',
    description:
      'Create a new academic grade record for a student in a specific subject',
  })
  @ApiResponse({
    status: 201,
    description: 'Grade record created successfully',
    examples: {
      success: {
        summary: 'Grade Record Created',
        value: {
          gradeRecordId: 1,
          studentId: 15,
          subjectId: 2,
          gradeId: 10,
          gradeValue: 4.5,
          gradeDate: '2024-01-15T10:30:00.000Z',
          period: 'Primer Período',
          observations: 'Excelente desempeño en matemáticas',
          createdAt: '2024-01-15T10:30:00.000Z',
          updatedAt: '2024-01-15T10:30:00.000Z',
          student: {
            studentId: 15,
            studentCode: 'EST2024001',
            user: {
              userFirstName: 'Ana',
              userFirstLastName: 'Rodríguez',
            },
          },
          subject: {
            subjectId: 2,
            subjectName: 'Matemáticas',
            subjectCode: 'MAT001',
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - validation failed or record already exists',
    examples: {
      validation: {
        summary: 'Validation Error',
        value: {
          success: false,
          message: [
            'gradeValue must be between 0 and 5',
            'studentId must exist',
          ],
          error: 'Bad Request',
          statusCode: 400,
          timestamp: '2024-01-15T10:30:00.000Z',
          path: '/grade-records',
        },
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Student, Subject, or Grade not found',
  })
  create(@Body() createGradeRecordDto: CreateGradeRecordDto) {
    return this.gradeRecordsService.create(createGradeRecordDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Get all grade records',
    description: 'Retrieve all grade records with optional filtering',
  })
  @ApiQuery({
    name: 'studentId',
    required: false,
    description: 'Filter by student ID',
    type: Number,
  })
  @ApiQuery({
    name: 'subjectId',
    required: false,
    description: 'Filter by subject ID',
    type: Number,
  })
  @ApiQuery({
    name: 'gradeId',
    required: false,
    description: 'Filter by grade ID',
    type: Number,
  })
  @ApiQuery({
    name: 'academicPeriod',
    required: false,
    description: 'Filter by academic period',
    type: String,
  })
  @ApiResponse({
    status: 200,
    description: 'Grade records retrieved successfully',
  })
  findAll(
    @Query('studentId') studentId?: number,
    @Query('subjectId') subjectId?: number,
    @Query('gradeId') gradeId?: number,
    @Query('academicPeriod') academicPeriod?: string,
  ) {
    return this.gradeRecordsService.findAllFiltered(
      studentId,
      subjectId,
      gradeId,
      academicPeriod,
    );
  }

  @Get('student/:studentId')
  @ApiOperation({
    summary: 'Get grade records by student',
    description: 'Retrieve all grade records for a specific student',
  })
  @ApiParam({
    name: 'studentId',
    description: 'Student ID',
    type: Number,
  })
  @ApiQuery({
    name: 'academicPeriod',
    required: false,
    description: 'Filter by academic period',
    type: String,
  })
  @ApiResponse({
    status: 200,
    description: 'Student grade records retrieved successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Student not found',
  })
  findByStudent(
    @Param('studentId', ParseIntPipe) studentId: number,
    @Query('academicPeriod') academicPeriod?: string,
  ) {
    return this.gradeRecordsService.findByStudent(studentId, academicPeriod);
  }

  @Get('subject/:subjectId')
  @ApiOperation({
    summary: 'Get grade records by subject',
    description: 'Retrieve all grade records for a specific subject',
  })
  @ApiParam({
    name: 'subjectId',
    description: 'Subject ID',
    type: Number,
  })
  @ApiQuery({
    name: 'academicPeriod',
    required: false,
    description: 'Filter by academic period',
    type: String,
  })
  @ApiResponse({
    status: 200,
    description: 'Subject grade records retrieved successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Subject not found',
  })
  findBySubject(
    @Param('subjectId', ParseIntPipe) subjectId: number,
    @Query('academicPeriod') academicPeriod?: string,
  ) {
    return this.gradeRecordsService.findBySubject(subjectId, academicPeriod);
  }

  @Get('statistics')
  @ApiOperation({
    summary: 'Get grade statistics',
    description: 'Get statistical information about grades',
  })
  @ApiQuery({
    name: 'academicPeriod',
    required: false,
    description: 'Filter statistics by academic period',
    type: String,
  })
  @ApiResponse({
    status: 200,
    description: 'Grade statistics retrieved successfully',
  })
  getStatistics(@Query('academicPeriod') academicPeriod?: string) {
    return this.gradeRecordsService.getGradeStatistics(academicPeriod);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get grade record by ID',
    description: 'Retrieve a specific grade record by its ID',
  })
  @ApiParam({
    name: 'id',
    description: 'Grade Record ID',
    type: Number,
  })
  @ApiResponse({
    status: 200,
    description: 'Grade record retrieved successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Grade record not found',
  })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.gradeRecordsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Update grade record',
    description: 'Update an existing grade record',
  })
  @ApiParam({
    name: 'id',
    description: 'Grade Record ID',
    type: Number,
  })
  @ApiResponse({
    status: 200,
    description: 'Grade record updated successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Grade record not found',
  })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateGradeRecordDto: UpdateGradeRecordDto,
  ) {
    return this.gradeRecordsService.update(id, updateGradeRecordDto);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete grade record',
    description: 'Delete a grade record by ID',
  })
  @ApiParam({
    name: 'id',
    description: 'Grade Record ID',
    type: Number,
  })
  @ApiResponse({
    status: 200,
    description: 'Grade record deleted successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Grade record not found',
  })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.gradeRecordsService.remove(id);
  }
}
