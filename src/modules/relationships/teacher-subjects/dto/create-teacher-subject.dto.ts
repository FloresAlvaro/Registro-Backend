import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsPositive } from 'class-validator';

export class CreateTeacherSubjectDto {
  @ApiProperty({
    description: 'Teacher ID',
    example: 1,
    minimum: 1,
  })
  @IsInt()
  @IsPositive()
  teacherId: number;

  @ApiProperty({
    description: 'Subject ID',
    example: 1,
    minimum: 1,
  })
  @IsInt()
  @IsPositive()
  subjectId: number;
}
