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
  @ApiOperation({ summary: 'Create a new teacher' })
  @ApiBody({ type: CreateTeacherDto })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Teacher created successfully',
    type: Teacher,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid input data',
  })
  create(@Body() createTeacherDto: CreateTeacherDto): Promise<Teacher> {
    return this.teachersService.create(createTeacherDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all teachers' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Teachers retrieved successfully',
    type: [Teacher],
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
