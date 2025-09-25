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
import { GradeSubjectsService } from './grade-subjects.service';
import { CreateGradeSubjectDto } from './dto/create-grade-subject.dto';
import { UpdateGradeSubjectDto } from './dto/update-grade-subject.dto';

@ApiTags('Grade Subjects')
@Controller('grade-subjects')
export class GradeSubjectsController {
  constructor(private readonly gradeSubjectsService: GradeSubjectsService) {}

  @Post()
  @ApiOperation({
    summary: 'Assign subject to grade',
    description: 'Create a new grade-subject assignment',
  })
  @ApiResponse({
    status: 201,
    description: 'Subject assigned to grade successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - subject already assigned to this grade',
  })
  @ApiResponse({
    status: 404,
    description: 'Grade or Subject not found',
  })
  create(@Body() createGradeSubjectDto: CreateGradeSubjectDto) {
    return this.gradeSubjectsService.create(createGradeSubjectDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Get all grade-subject assignments',
    description:
      'Retrieve all grade-subject assignments with optional filtering',
  })
  @ApiQuery({
    name: 'gradeId',
    required: false,
    description: 'Filter by grade ID',
    type: Number,
  })
  @ApiQuery({
    name: 'subjectId',
    required: false,
    description: 'Filter by subject ID',
    type: Number,
  })
  @ApiResponse({
    status: 200,
    description: 'Grade-subject assignments retrieved successfully',
  })
  findAll(
    @Query('gradeId') gradeId?: number,
    @Query('subjectId') subjectId?: number,
  ) {
    return this.gradeSubjectsService.findAll(gradeId, subjectId);
  }

  @Get('grade/:gradeId')
  @ApiOperation({
    summary: 'Get subjects assigned to grade',
    description: 'Retrieve all subjects assigned to a specific grade',
  })
  @ApiParam({
    name: 'gradeId',
    description: 'Grade ID',
    type: Number,
  })
  @ApiResponse({
    status: 200,
    description: 'Grade subjects retrieved successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Grade not found',
  })
  findByGrade(@Param('gradeId', ParseIntPipe) gradeId: number) {
    return this.gradeSubjectsService.findByGrade(gradeId);
  }

  @Get('subject/:subjectId')
  @ApiOperation({
    summary: 'Get grades assigned to subject',
    description: 'Retrieve all grades assigned to a specific subject',
  })
  @ApiParam({
    name: 'subjectId',
    description: 'Subject ID',
    type: Number,
  })
  @ApiResponse({
    status: 200,
    description: 'Subject grades retrieved successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Subject not found',
  })
  findBySubject(@Param('subjectId', ParseIntPipe) subjectId: number) {
    return this.gradeSubjectsService.findBySubject(subjectId);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get grade-subject assignment by ID',
    description: 'Retrieve a specific grade-subject assignment by its ID',
  })
  @ApiParam({
    name: 'id',
    description: 'Grade Subject Assignment ID',
    type: Number,
  })
  @ApiResponse({
    status: 200,
    description: 'Grade-subject assignment retrieved successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Grade-subject assignment not found',
  })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.gradeSubjectsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Update grade-subject assignment',
    description: 'Update an existing grade-subject assignment',
  })
  @ApiParam({
    name: 'id',
    description: 'Grade Subject Assignment ID',
    type: Number,
  })
  @ApiResponse({
    status: 200,
    description: 'Grade-subject assignment updated successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Grade-subject assignment not found',
  })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateGradeSubjectDto: UpdateGradeSubjectDto,
  ) {
    return this.gradeSubjectsService.update(id, updateGradeSubjectDto);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Remove grade-subject assignment',
    description: 'Delete a grade-subject assignment by ID',
  })
  @ApiParam({
    name: 'id',
    description: 'Grade Subject Assignment ID',
    type: Number,
  })
  @ApiResponse({
    status: 200,
    description: 'Grade-subject assignment removed successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Grade-subject assignment not found',
  })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.gradeSubjectsService.remove(id);
  }
}
