import { ApiProperty } from '@nestjs/swagger';

export class GradeSubject {
  @ApiProperty({ description: 'Grade Subject assignment ID', example: 1 })
  gradeSubjectId: number;

  @ApiProperty({ description: 'Grade ID', example: 1 })
  gradeId: number;

  @ApiProperty({ description: 'Subject ID', example: 1 })
  subjectId: number;
}
