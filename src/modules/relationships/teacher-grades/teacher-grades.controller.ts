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
import { TeacherGradesService } from './teacher-grades.service';
import { CreateTeacherGradeDto } from './dto/create-teacher-grade.dto';
import { UpdateTeacherGradeDto } from './dto/update-teacher-grade.dto';

@ApiTags('Teacher Grades')
@Controller('teacher-grades')
export class TeacherGradesController {
  constructor(private readonly teacherGradesService: TeacherGradesService) {}

  @Post()
  @ApiOperation({
    summary: 'Assign teacher to grade',
    description: 'Create a new teacher-grade assignment',
  })
  @ApiResponse({
    status: 201,
    description: 'Teacher assigned to grade successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - teacher already assigned to this grade',
  })
  @ApiResponse({
    status: 404,
    description: 'Teacher or Grade not found',
  })
  create(@Body() createTeacherGradeDto: CreateTeacherGradeDto) {
    return this.teacherGradesService.create(createTeacherGradeDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Get all teacher-grade assignments',
    description:
      'Retrieve all teacher-grade assignments with optional filtering',
  })
  @ApiQuery({
    name: 'teacherId',
    required: false,
    description: 'Filter by teacher ID',
    type: Number,
  })
  @ApiQuery({
    name: 'gradeId',
    required: false,
    description: 'Filter by grade ID',
    type: Number,
  })
  @ApiResponse({
    status: 200,
    description: 'Teacher-grade assignments retrieved successfully',
  })
  findAll(
    @Query('teacherId') teacherId?: number,
    @Query('gradeId') gradeId?: number,
  ) {
    return this.teacherGradesService.findAll(teacherId, gradeId);
  }

  @Get('teacher/:teacherId')
  @ApiOperation({
    summary: 'Get grades assigned to teacher',
    description: 'Retrieve all grades assigned to a specific teacher',
  })
  @ApiParam({
    name: 'teacherId',
    description: 'Teacher ID',
    type: Number,
  })
  @ApiResponse({
    status: 200,
    description: 'Teacher grades retrieved successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Teacher not found',
  })
  findByTeacher(@Param('teacherId', ParseIntPipe) teacherId: number) {
    return this.teacherGradesService.findByTeacher(teacherId);
  }

  @Get('grade/:gradeId')
  @ApiOperation({
    summary: 'Get teachers assigned to grade',
    description: 'Retrieve all teachers assigned to a specific grade',
  })
  @ApiParam({
    name: 'gradeId',
    description: 'Grade ID',
    type: Number,
  })
  @ApiResponse({
    status: 200,
    description: 'Grade teachers retrieved successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Grade not found',
  })
  findByGrade(@Param('gradeId', ParseIntPipe) gradeId: number) {
    return this.teacherGradesService.findByGrade(gradeId);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get teacher-grade assignment by ID',
    description: 'Retrieve a specific teacher-grade assignment by its ID',
  })
  @ApiParam({
    name: 'id',
    description: 'Teacher Grade Assignment ID',
    type: Number,
  })
  @ApiResponse({
    status: 200,
    description: 'Teacher-grade assignment retrieved successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Teacher-grade assignment not found',
  })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.teacherGradesService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Update teacher-grade assignment',
    description: 'Update an existing teacher-grade assignment',
  })
  @ApiParam({
    name: 'id',
    description: 'Teacher Grade Assignment ID',
    type: Number,
  })
  @ApiResponse({
    status: 200,
    description: 'Teacher-grade assignment updated successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Teacher-grade assignment not found',
  })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateTeacherGradeDto: UpdateTeacherGradeDto,
  ) {
    return this.teacherGradesService.update(id, updateTeacherGradeDto);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Remove teacher-grade assignment',
    description: 'Delete a teacher-grade assignment by ID',
  })
  @ApiParam({
    name: 'id',
    description: 'Teacher Grade Assignment ID',
    type: Number,
  })
  @ApiResponse({
    status: 200,
    description: 'Teacher-grade assignment removed successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Teacher-grade assignment not found',
  })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.teacherGradesService.remove(id);
  }
}
