import { ApiProperty } from '@nestjs/swagger';

export class Student {
  @ApiProperty({ description: 'Student ID', example: 1 })
  studentId: number;

  @ApiProperty({
    description: 'User ID associated with this student',
    example: 1,
  })
  userId: number;

  @ApiProperty({ description: 'Grade ID for this student', example: 1 })
  gradeId: number;
}
