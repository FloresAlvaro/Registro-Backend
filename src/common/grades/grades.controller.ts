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

@ApiTags('grades')
@Controller('grades')
export class GradesController {
  constructor(private readonly gradesService: GradesService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new grade' })
  @ApiBody({ type: CreateGradeDto })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Grade created successfully',
    type: Grade,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid input data',
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
    return this.gradesService.findAll(status);
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
  @ApiOperation({ summary: 'Update a grade by ID' })
  @ApiParam({ name: 'id', description: 'Grade ID' })
  @ApiBody({ type: UpdateGradeDto })
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
  @ApiOperation({ summary: 'Delete a grade by ID' })
  @ApiParam({ name: 'id', description: 'Grade ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Grade deleted successfully',
    type: Grade,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Grade not found',
  })
  remove(@Param('id', ParseIntPipe) id: number): Promise<Grade> {
    return this.gradesService.remove(id);
  }

  @Patch(':id/toggle-status')
  @ApiOperation({ summary: 'Toggle the status of a grade (active/inactive)' })
  @ApiParam({ name: 'id', description: 'Grade ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Grade status toggled successfully',
    type: Grade,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Grade not found',
  })
  toggleStatus(@Param('id', ParseIntPipe) id: number): Promise<Grade> {
    return this.gradesService.toggleStatus(id);
  }
}
