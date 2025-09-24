import { ApiProperty } from '@nestjs/swagger';
import {
  IsInt,
  IsPositive,
  IsNumber,
  IsString,
  IsOptional,
  IsDateString,
  MinLength,
  MaxLength,
  Min,
  Max,
} from 'class-validator';

export class UpdateGradeRecordDto {
  @ApiProperty({
    description: 'Score obtained',
    example: 85.5,
    required: false,
    minimum: 0,
    maximum: 999.99,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(999.99)
  score?: number;

  @ApiProperty({
    description: 'Maximum possible score',
    example: 100.0,
    required: false,
    minimum: 0,
    maximum: 999.99,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(999.99)
  maxScore?: number;

  @ApiProperty({
    description: 'Type of grade/evaluation',
    example: 'Exam',
    required: false,
    minLength: 1,
    maxLength: 50,
  })
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(50)
  gradeType?: string;

  @ApiProperty({
    description: 'Evaluation date (YYYY-MM-DD)',
    example: '2024-01-15',
    required: false,
  })
  @IsOptional()
  @IsDateString()
  evaluationDate?: string;

  @ApiProperty({
    description: 'Academic period',
    example: '2024-1',
    required: false,
    minLength: 1,
    maxLength: 50,
  })
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(50)
  academicPeriod?: string;

  @ApiProperty({
    description: 'Comments about the grade',
    example: 'Excellent performance in mathematics',
    required: false,
  })
  @IsOptional()
  @IsString()
  comments?: string;
}