import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, MaxLength, MinLength } from 'class-validator';

export class UpdateGradeDto {
  @ApiProperty({
    description: 'The grade level',
    example: '1st Grade',
    maxLength: 255,
    minLength: 1,
    required: false,
  })
  @IsString()
  @IsOptional()
  @MinLength(1)
  @MaxLength(255)
  gradeLevel?: string;

  @ApiProperty({
    description: 'The description of the grade',
    example: 'First grade elementary level',
    maxLength: 255,
    minLength: 1,
    required: false,
  })
  @IsString()
  @IsOptional()
  @MinLength(1)
  @MaxLength(255)
  gradeDescription?: string;
}
