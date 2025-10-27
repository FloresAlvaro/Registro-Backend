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
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
  ApiBody,
} from '@nestjs/swagger';
import { GradesService } from './grades.service';
import { CreateGradeDto } from './dto/create-grade.dto';
import { UpdateGradeDto } from './dto/update-grade.dto';
import { Grade } from './entities/grade.entity';

@ApiTags('Grades')
@Controller('grades')
export class GradesController {
  constructor(private readonly gradesService: GradesService) {}

  @Post()
  @ApiOperation({
    summary: 'Create a new grade',
    description: 'Create a new academic grade level in the system',
  })
  @ApiBody({
    type: CreateGradeDto,
    description: 'Grade creation data',
    examples: {
      elementaryGrade: {
        summary: 'Elementary Grade',
        value: {
          gradeName: '1ro Primaria',
          gradeDescription: 'Primer grado de educación primaria',
          gradeLevel: 1,
        },
      },
      middleSchoolGrade: {
        summary: 'Middle School Grade',
        value: {
          gradeName: '6to Básica',
          gradeDescription: 'Sexto grado de educación básica',
          gradeLevel: 6,
        },
      },
      highSchoolGrade: {
        summary: 'High School Grade',
        value: {
          gradeName: '10mo Bachillerato',
          gradeDescription: 'Décimo grado de bachillerato',
          gradeLevel: 10,
        },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Grade created successfully',
    type: Grade,
    examples: {
      success: {
        summary: 'Grade Created Successfully',
        value: {
          gradeId: 4,
          gradeName: '10mo Bachillerato',
          gradeDescription: 'Décimo grado de bachillerato',
          gradeLevel: 10,
          gradeStatus: true,
          createdAt: '2024-01-15T10:30:00.000Z',
          updatedAt: '2024-01-15T10:30:00.000Z',
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
            'gradeName must be unique',
            'gradeLevel must be a positive number',
          ],
          error: 'Bad Request',
          statusCode: 400,
          timestamp: '2024-01-15T10:30:00.000Z',
          path: '/grades',
        },
      },
    },
  })
  create(@Body() createGradeDto: CreateGradeDto): Promise<Grade> {
    return this.gradesService.create(createGradeDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all grades with optional status filter' })
  @ApiQuery({
    name: 'status',
    required: false,
    enum: ['active', 'inactive', 'all'],
    description: 'Filter grades by status. Default: all',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Grades retrieved successfully',
    type: [Grade],
  })
  findAll(
    @Query('status') status?: 'active' | 'inactive' | 'all',
  ): Promise<Grade[]> {
    // Normalize the status parameter: if it's not 'active' or 'inactive', treat as 'all'
    const normalizedStatus =
      status && ['active', 'inactive'].includes(status) ? status : 'all';
    return this.gradesService.findAll(normalizedStatus);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a grade by ID' })
  @ApiParam({ name: 'id', description: 'Grade ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Grade found',
    type: Grade,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Grade not found',
  })
  findOne(@Param('id', ParseIntPipe) id: number): Promise<Grade> {
    return this.gradesService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Update a grade by ID',
    description:
      'Update grade information and/or status. All fields are optional.',
  })
  @ApiParam({ name: 'id', description: 'Grade ID' })
  @ApiBody({
    type: UpdateGradeDto,
    examples: {
      updateLevel: {
        summary: 'Update only grade level',
        value: {
          gradeLevel: '1ro Primaria Avanzada',
        },
      },
      updateDescription: {
        summary: 'Update only description',
        value: {
          gradeDescription:
            'Primer grado de educación primaria con enfoque integral',
        },
      },
      updateStatus: {
        summary: 'Update only status',
        value: {
          gradeStatus: false,
        },
      },
      updateAll: {
        summary: 'Update multiple fields',
        value: {
          gradeLevel: '1ro Primaria Plus',
          gradeDescription: 'Primer grado mejorado',
          gradeStatus: true,
        },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Grade updated successfully',
    type: Grade,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Grade not found',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid input data',
  })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateGradeDto: UpdateGradeDto,
  ): Promise<Grade> {
    return this.gradesService.update(id, updateGradeDto);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Soft delete a grade by ID',
    description:
      'Deactivate a grade by setting its status to false (soft delete)',
  })
  @ApiParam({ name: 'id', description: 'Grade ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Grade deactivated successfully (soft delete)',
    type: Grade,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Grade not found',
  })
  remove(@Param('id', ParseIntPipe) id: number): Promise<Grade> {
    return this.gradesService.remove(id);
  }
}
