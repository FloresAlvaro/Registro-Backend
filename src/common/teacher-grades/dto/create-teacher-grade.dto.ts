import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsPositive } from 'class-validator';

export class CreateTeacherGradeDto {
  @ApiProperty({
    description: 'Teacher ID',
    example: 1,
    minimum: 1,
  })
  @IsInt()
  @IsPositive()
  teacherId: number;

  @ApiProperty({
    description: 'Grade ID',
    example: 1,
    minimum: 1,
  })
  @IsInt()
  @IsPositive()
  gradeId: number;
}