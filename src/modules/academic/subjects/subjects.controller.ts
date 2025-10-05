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
import { SubjectsService } from './subjects.service';
import { CreateSubjectDto } from './dto/create-subject.dto';
import { UpdateSubjectDto } from './dto/update-subject.dto';
import { Subject } from './entities/subject.entity';

@ApiTags('Subjects')
@Controller('subjects')
export class SubjectsController {
  constructor(private readonly subjectsService: SubjectsService) {}

  @Post()
  @ApiOperation({
    summary: 'Create a new subject',
    description: 'Create a new academic subject in the system',
  })
  @ApiBody({
    type: CreateSubjectDto,
    description: 'Subject creation data',
    examples: {
      mathSubject: {
        summary: 'Mathematics Subject',
        value: {
          subjectName: 'Matemáticas',
          subjectDescription: 'Matemáticas básicas y avanzadas',
          subjectCode: 'MAT001',
        },
      },
      scienceSubject: {
        summary: 'Science Subject',
        value: {
          subjectName: 'Ciencias Naturales',
          subjectDescription: 'Biología, Química y Física',
          subjectCode: 'CIE001',
        },
      },
      languageSubject: {
        summary: 'Language Subject',
        value: {
          subjectName: 'Lengua Castellana',
          subjectDescription: 'Gramática, literatura y comprensión lectora',
          subjectCode: 'LEN001',
        },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Subject created successfully',
    type: Subject,
    examples: {
      success: {
        summary: 'Subject Created Successfully',
        value: {
          subjectId: 4,
          subjectName: 'Matemáticas',
          subjectDescription: 'Matemáticas básicas y avanzadas',
          subjectCode: 'MAT001',
          subjectStatus: true,
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
            'subjectCode must be unique',
            'subjectName must not be empty',
          ],
          error: 'Bad Request',
          statusCode: 400,
          timestamp: '2024-01-15T10:30:00.000Z',
          path: '/subjects',
        },
      },
    },
  })
  create(@Body() createSubjectDto: CreateSubjectDto): Promise<Subject> {
    return this.subjectsService.create(createSubjectDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all subjects with optional status filter' })
  @ApiQuery({
    name: 'status',
    required: false,
    enum: ['active', 'inactive', 'all'],
    description: 'Filter subjects by status. Default: all',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Subjects retrieved successfully',
    type: [Subject],
  })
  findAll(
    @Query('status') status?: 'active' | 'inactive' | 'all',
  ): Promise<Subject[]> {
    // Normalize the status parameter: if it's not 'active' or 'inactive', treat as 'all'
    const normalizedStatus =
      status && ['active', 'inactive'].includes(status) ? status : 'all';
    return this.subjectsService.findAll(normalizedStatus);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a subject by ID' })
  @ApiParam({ name: 'id', description: 'Subject ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Subject found',
    type: Subject,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Subject not found',
  })
  findOne(@Param('id', ParseIntPipe) id: number): Promise<Subject> {
    return this.subjectsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a subject by ID' })
  @ApiParam({ name: 'id', description: 'Subject ID' })
  @ApiBody({ type: UpdateSubjectDto })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Subject updated successfully',
    type: Subject,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Subject not found',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid input data',
  })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateSubjectDto: UpdateSubjectDto,
  ): Promise<Subject> {
    return this.subjectsService.update(id, updateSubjectDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a subject by ID' })
  @ApiParam({ name: 'id', description: 'Subject ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Subject deleted successfully',
    type: Subject,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Subject not found',
  })
  remove(@Param('id', ParseIntPipe) id: number): Promise<Subject> {
    return this.subjectsService.remove(id);
  }

  @Patch(':id/toggle-status')
  @ApiOperation({ summary: 'Toggle the status of a subject (active/inactive)' })
  @ApiParam({ name: 'id', description: 'Subject ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Subject status toggled successfully',
    type: Subject,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Subject not found',
  })
  toggleStatus(@Param('id', ParseIntPipe) id: number): Promise<Subject> {
    return this.subjectsService.toggleStatus(id);
  }
}
