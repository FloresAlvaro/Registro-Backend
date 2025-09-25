import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { TeacherSubjectsService } from './teacher-subjects.service';
import { CreateTeacherSubjectDto } from './dto/create-teacher-subject.dto';
import { UpdateTeacherSubjectDto } from './dto/update-teacher-subject.dto';

@ApiTags('Teacher Subjects')
@Controller('teacher-subjects')
export class TeacherSubjectsController {
  constructor(
    private readonly teacherSubjectsService: TeacherSubjectsService,
  ) {}

  @Post()
  @ApiOperation({
    summary: 'Create a new teacher-subject assignment',
    description: 'Assigns a teacher to teach a specific subject',
  })
  @ApiResponse({
    status: 201,
    description:
      'The teacher-subject assignment has been successfully created.',
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @ApiResponse({ status: 404, description: 'Teacher or Subject not found.' })
  @ApiResponse({
    status: 409,
    description: 'Teacher-subject assignment already exists.',
  })
  create(@Body() createTeacherSubjectDto: CreateTeacherSubjectDto) {
    return this.teacherSubjectsService.create(createTeacherSubjectDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Get all teacher-subject assignments',
    description: 'Retrieve all teacher-subject assignments with related data',
  })
  @ApiResponse({
    status: 200,
    description: 'Return all teacher-subject assignments.',
  })
  findAll() {
    return this.teacherSubjectsService.findAll();
  }

  @Get('teacher/:teacherId')
  @ApiOperation({
    summary: 'Get subjects for a specific teacher',
    description: 'Retrieve all subjects assigned to a teacher',
  })
  @ApiParam({ name: 'teacherId', type: 'number', description: 'Teacher ID' })
  @ApiResponse({
    status: 200,
    description: 'Return all subjects for the specified teacher.',
  })
  @ApiResponse({ status: 404, description: 'Teacher not found.' })
  findByTeacher(@Param('teacherId', ParseIntPipe) teacherId: number) {
    return this.teacherSubjectsService.findByTeacher(teacherId);
  }

  @Get('subject/:subjectId')
  @ApiOperation({
    summary: 'Get teachers for a specific subject',
    description: 'Retrieve all teachers assigned to a subject',
  })
  @ApiParam({ name: 'subjectId', type: 'number', description: 'Subject ID' })
  @ApiResponse({
    status: 200,
    description: 'Return all teachers for the specified subject.',
  })
  @ApiResponse({ status: 404, description: 'Subject not found.' })
  findBySubject(@Param('subjectId', ParseIntPipe) subjectId: number) {
    return this.teacherSubjectsService.findBySubject(subjectId);
  }

  @Get('active')
  @ApiOperation({
    summary: 'Get all active teacher-subject assignments',
    description: 'Retrieve all currently active teacher-subject assignments',
  })
  @ApiResponse({
    status: 200,
    description: 'Return all active assignments.',
  })
  findActiveAssignments() {
    return this.teacherSubjectsService.findActiveAssignments();
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get a specific teacher-subject assignment',
    description: 'Retrieve a teacher-subject assignment by ID',
  })
  @ApiParam({ name: 'id', type: 'number', description: 'Assignment ID' })
  @ApiResponse({
    status: 200,
    description: 'Return the teacher-subject assignment.',
  })
  @ApiResponse({ status: 404, description: 'Assignment not found.' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.teacherSubjectsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Update a teacher-subject assignment',
    description: 'Update a teacher-subject assignment by ID',
  })
  @ApiParam({ name: 'id', type: 'number', description: 'Assignment ID' })
  @ApiResponse({
    status: 200,
    description: 'The assignment has been successfully updated.',
  })
  @ApiResponse({ status: 404, description: 'Assignment not found.' })
  @ApiResponse({
    status: 409,
    description: 'Teacher-subject assignment already exists.',
  })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateTeacherSubjectDto: UpdateTeacherSubjectDto,
  ) {
    return this.teacherSubjectsService.update(id, updateTeacherSubjectDto);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete a teacher-subject assignment',
    description: 'Delete a teacher-subject assignment by ID',
  })
  @ApiParam({ name: 'id', type: 'number', description: 'Assignment ID' })
  @ApiResponse({
    status: 200,
    description: 'The assignment has been successfully deleted.',
  })
  @ApiResponse({ status: 404, description: 'Assignment not found.' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.teacherSubjectsService.remove(id);
  }
}
