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
  HttpCode,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { StudentTeacherSubjectsService } from './student-teacher-subjects.service';
import { CreateStudentTeacherSubjectDto } from './dto/create-student-teacher-subject.dto';
import { UpdateStudentTeacherSubjectDto } from './dto/update-student-teacher-subject.dto';
import { StudentTeacherSubjectKey } from './interfaces/student-teacher-subject-key.interface';

@ApiTags('Student Teacher Subjects')
@Controller('student-teacher-subjects')
export class StudentTeacherSubjectsController {
  constructor(
    private readonly studentTeacherSubjectsService: StudentTeacherSubjectsService,
  ) {}

  @Post()
  @ApiOperation({
    summary: 'Create a new student-teacher-subject assignment',
    description:
      'Assigns a student to a teacher for a specific subject and academic period',
  })
  @ApiResponse({
    status: 201,
    description:
      'The student-teacher-subject assignment has been successfully created.',
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @ApiResponse({
    status: 404,
    description: 'Student, Teacher, Subject, or Grade not found.',
  })
  @ApiResponse({
    status: 409,
    description: 'Assignment already exists for this academic period.',
  })
  create(
    @Body() createStudentTeacherSubjectDto: CreateStudentTeacherSubjectDto,
  ) {
    return this.studentTeacherSubjectsService.create(
      createStudentTeacherSubjectDto,
    );
  }

  @Get()
  @ApiOperation({
    summary: 'Get all student-teacher-subject assignments',
    description:
      'Retrieve all student-teacher-subject assignments with related data',
  })
  @ApiResponse({
    status: 200,
    description: 'Return all student-teacher-subject assignments.',
  })
  findAll() {
    return this.studentTeacherSubjectsService.findAll();
  }

  @Get('student/:studentId')
  @ApiOperation({
    summary: 'Get assignments for a specific student',
    description: 'Retrieve all teacher-subject assignments for a student',
  })
  @ApiParam({ name: 'studentId', type: 'number', description: 'Student ID' })
  @ApiResponse({
    status: 200,
    description: 'Return all assignments for the specified student.',
  })
  @ApiResponse({ status: 404, description: 'Student not found.' })
  findByStudent(@Param('studentId', ParseIntPipe) studentId: number) {
    return this.studentTeacherSubjectsService.findByStudent(studentId);
  }

  @Get('teacher/:teacherId')
  @ApiOperation({
    summary: 'Get assignments for a specific teacher',
    description: 'Retrieve all student-subject assignments for a teacher',
  })
  @ApiParam({ name: 'teacherId', type: 'number', description: 'Teacher ID' })
  @ApiResponse({
    status: 200,
    description: 'Return all assignments for the specified teacher.',
  })
  @ApiResponse({ status: 404, description: 'Teacher not found.' })
  findByTeacher(@Param('teacherId', ParseIntPipe) teacherId: number) {
    return this.studentTeacherSubjectsService.findByTeacher(teacherId);
  }

  @Get('subject/:subjectId')
  @ApiOperation({
    summary: 'Get assignments for a specific subject',
    description: 'Retrieve all student-teacher assignments for a subject',
  })
  @ApiParam({ name: 'subjectId', type: 'number', description: 'Subject ID' })
  @ApiResponse({
    status: 200,
    description: 'Return all assignments for the specified subject.',
  })
  @ApiResponse({ status: 404, description: 'Subject not found.' })
  findBySubject(@Param('subjectId', ParseIntPipe) subjectId: number) {
    return this.studentTeacherSubjectsService.findBySubject(subjectId);
  }

  @Get('grade/:gradeId')
  @ApiOperation({
    summary: 'Get assignments for a specific grade',
    description: 'Retrieve all student-teacher-subject assignments for a grade',
  })
  @ApiParam({ name: 'gradeId', type: 'number', description: 'Grade ID' })
  @ApiResponse({
    status: 200,
    description: 'Return all assignments for the specified grade.',
  })
  @ApiResponse({ status: 404, description: 'Grade not found.' })
  findByGrade(@Param('gradeId', ParseIntPipe) gradeId: number) {
    return this.studentTeacherSubjectsService.findByGrade(gradeId);
  }

  @Get('academic-period')
  @ApiOperation({
    summary: 'Get assignments by academic period',
    description: 'Retrieve all assignments for a specific academic period',
  })
  @ApiQuery({ name: 'period', type: 'string', description: 'Academic period' })
  @ApiResponse({
    status: 200,
    description: 'Return all assignments for the specified academic period.',
  })
  findByAcademicPeriod(@Query('period') academicPeriod: string) {
    return this.studentTeacherSubjectsService.findByAcademicPeriod(
      academicPeriod,
    );
  }

  @Get('active')
  @ApiOperation({
    summary: 'Get all active assignments',
    description:
      'Retrieve all currently active student-teacher-subject assignments',
  })
  @ApiResponse({
    status: 200,
    description: 'Return all active assignments.',
  })
  findActiveAssignments() {
    return this.studentTeacherSubjectsService.findActiveAssignments();
  }

  @Get('find')
  @ApiOperation({
    summary: 'Find a specific assignment',
    description:
      'Find an assignment by student, teacher, subject, and academic period',
  })
  @ApiQuery({ name: 'studentId', type: 'number', description: 'Student ID' })
  @ApiQuery({ name: 'teacherId', type: 'number', description: 'Teacher ID' })
  @ApiQuery({ name: 'subjectId', type: 'number', description: 'Subject ID' })
  @ApiQuery({
    name: 'academicPeriod',
    type: 'string',
    description: 'Academic period',
  })
  @ApiResponse({
    status: 200,
    description: 'Return the specific assignment.',
  })
  @ApiResponse({ status: 404, description: 'Assignment not found.' })
  findOne(
    @Query('studentId', ParseIntPipe) studentId: number,
    @Query('teacherId', ParseIntPipe) teacherId: number,
    @Query('subjectId', ParseIntPipe) subjectId: number,
    @Query('academicPeriod') academicPeriod: string,
  ) {
    const key: StudentTeacherSubjectKey = {
      studentId,
      teacherId,
      subjectId,
      academicPeriod,
    };
    return this.studentTeacherSubjectsService.findOne(key);
  }

  @Patch('update')
  @ApiOperation({
    summary: 'Update a specific assignment',
    description:
      'Update an assignment by student, teacher, subject, and academic period',
  })
  @ApiQuery({ name: 'studentId', type: 'number', description: 'Student ID' })
  @ApiQuery({ name: 'teacherId', type: 'number', description: 'Teacher ID' })
  @ApiQuery({ name: 'subjectId', type: 'number', description: 'Subject ID' })
  @ApiQuery({
    name: 'academicPeriod',
    type: 'string',
    description: 'Academic period',
  })
  @ApiResponse({
    status: 200,
    description: 'The assignment has been successfully updated.',
  })
  @ApiResponse({ status: 404, description: 'Assignment not found.' })
  @ApiResponse({
    status: 409,
    description: 'Update would create duplicate assignment.',
  })
  update(
    @Query('studentId', ParseIntPipe) studentId: number,
    @Query('teacherId', ParseIntPipe) teacherId: number,
    @Query('subjectId', ParseIntPipe) subjectId: number,
    @Query('academicPeriod') academicPeriod: string,
    @Body() updateStudentTeacherSubjectDto: UpdateStudentTeacherSubjectDto,
  ) {
    const key: StudentTeacherSubjectKey = {
      studentId,
      teacherId,
      subjectId,
      academicPeriod,
    };
    return this.studentTeacherSubjectsService.update(
      key,
      updateStudentTeacherSubjectDto,
    );
  }

  @Patch('toggle-active')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Toggle assignment active status',
    description: 'Toggle the active status of an assignment',
  })
  @ApiQuery({ name: 'studentId', type: 'number', description: 'Student ID' })
  @ApiQuery({ name: 'teacherId', type: 'number', description: 'Teacher ID' })
  @ApiQuery({ name: 'subjectId', type: 'number', description: 'Subject ID' })
  @ApiQuery({
    name: 'academicPeriod',
    type: 'string',
    description: 'Academic period',
  })
  @ApiResponse({
    status: 200,
    description: 'The assignment active status has been successfully toggled.',
  })
  @ApiResponse({ status: 404, description: 'Assignment not found.' })
  toggleActive(
    @Query('studentId', ParseIntPipe) studentId: number,
    @Query('teacherId', ParseIntPipe) teacherId: number,
    @Query('subjectId', ParseIntPipe) subjectId: number,
    @Query('academicPeriod') academicPeriod: string,
  ) {
    const key: StudentTeacherSubjectKey = {
      studentId,
      teacherId,
      subjectId,
      academicPeriod,
    };
    return this.studentTeacherSubjectsService.toggleActive(key);
  }

  @Delete('remove')
  @ApiOperation({
    summary: 'Delete a specific assignment',
    description:
      'Delete an assignment by student, teacher, subject, and academic period',
  })
  @ApiQuery({ name: 'studentId', type: 'number', description: 'Student ID' })
  @ApiQuery({ name: 'teacherId', type: 'number', description: 'Teacher ID' })
  @ApiQuery({ name: 'subjectId', type: 'number', description: 'Subject ID' })
  @ApiQuery({
    name: 'academicPeriod',
    type: 'string',
    description: 'Academic period',
  })
  @ApiResponse({
    status: 200,
    description: 'The assignment has been successfully deleted.',
  })
  @ApiResponse({ status: 404, description: 'Assignment not found.' })
  remove(
    @Query('studentId', ParseIntPipe) studentId: number,
    @Query('teacherId', ParseIntPipe) teacherId: number,
    @Query('subjectId', ParseIntPipe) subjectId: number,
    @Query('academicPeriod') academicPeriod: string,
  ) {
    const key: StudentTeacherSubjectKey = {
      studentId,
      teacherId,
      subjectId,
      academicPeriod,
    };
    return this.studentTeacherSubjectsService.remove(key);
  }
}
