import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsPositive, IsOptional } from 'class-validator';

export class UpdateGradeSubjectDto {
  @ApiProperty({
    description: 'Grade ID',
    example: 1,
    required: false,
    minimum: 1,
  })
  @IsOptional()
  @IsInt()
  @IsPositive()
  gradeId?: number;

  @ApiProperty({
    description: 'Subject ID',
    example: 1,
    required: false,
    minimum: 1,
  })
  @IsOptional()
  @IsInt()
  @IsPositive()
  subjectId?: number;
}
