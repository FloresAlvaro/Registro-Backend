import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsPositive, IsOptional } from 'class-validator';

export class UpdateTeacherSubjectDto {
  @ApiProperty({
    description: 'Teacher ID',
    example: 1,
    required: false,
    minimum: 1,
  })
  @IsOptional()
  @IsInt()
  @IsPositive()
  teacherId?: number;

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
