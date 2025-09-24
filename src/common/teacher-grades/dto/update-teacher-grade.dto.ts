import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsPositive, IsOptional } from 'class-validator';

export class UpdateTeacherGradeDto {
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
    description: 'Grade ID',
    example: 1,
    required: false,
    minimum: 1,
  })
  @IsOptional()
  @IsInt()
  @IsPositive()
  gradeId?: number;
}