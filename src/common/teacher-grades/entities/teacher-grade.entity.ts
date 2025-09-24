import { ApiProperty } from '@nestjs/swagger';

export class TeacherGrade {
  @ApiProperty({ description: 'Teacher Grade assignment ID', example: 1 })
  teacherGradeId: number;

  @ApiProperty({ description: 'Teacher ID', example: 1 })
  teacherId: number;

  @ApiProperty({ description: 'Grade ID', example: 1 })
  gradeId: number;
}