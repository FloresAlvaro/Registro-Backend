import { ApiProperty } from '@nestjs/swagger';
import {
  IsInt,
  IsPositive,
  IsString,
  IsOptional,
  Min,
  Max,
  MaxLength,
} from 'class-validator';

export class UpdateTeacherDto {
  @ApiProperty({
    description: 'Years of teaching experience',
    example: 6,
    minimum: 0,
    maximum: 50,
    required: false,
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(50)
  teacherExperienceYears?: number;

  @ApiProperty({
    description: 'Professional teaching license number',
    example: 'LIC-2025-001234',
    maxLength: 50,
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  teacherLicenseNumber?: string;

  @ApiProperty({
    description: 'Weekly teaching hours assigned',
    example: 35,
    minimum: 1,
    maximum: 60,
    required: false,
  })
  @IsOptional()
  @IsInt()
  @IsPositive()
  @Min(1)
  @Max(60)
  teacherHours?: number;
}
