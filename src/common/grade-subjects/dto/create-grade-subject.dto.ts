import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsPositive } from 'class-validator';

export class CreateGradeSubjectDto {
  @ApiProperty({
    description: 'Grade ID',
    example: 1,
    minimum: 1,
  })
  @IsInt()
  @IsPositive()
  gradeId: number;

  @ApiProperty({
    description: 'Subject ID',
    example: 1,
    minimum: 1,
  })
  @IsInt()
  @IsPositive()
  subjectId: number;
}
