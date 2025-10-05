import { ApiProperty } from '@nestjs/swagger';
import {
  IsInt,
  IsPositive,
  IsString,
  IsNotEmpty,
  Min,
  Max,
  MaxLength,
} from 'class-validator';

export class CreateTeacherDto {
  @ApiProperty({
    description: 'User ID associated with this teacher',
    example: 1,
    minimum: 1,
  })
  @IsInt()
  @IsPositive()
  userId: number;

  @ApiProperty({
    description: 'Years of teaching experience',
    example: 5,
    minimum: 0,
    maximum: 50,
  })
  @IsInt()
  @Min(0)
  @Max(50)
  teacherExperienceYears: number;

  @ApiProperty({
    description: 'Professional teaching license number',
    example: 'LIC-2024-001234',
    maxLength: 50,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  teacherLicenseNumber: string;

  @ApiProperty({
    description: 'Weekly teaching hours assigned',
    example: 40,
    minimum: 1,
    maximum: 60,
  })
  @IsInt()
  @IsPositive()
  @Min(1)
  @Max(60)
  teacherHours: number;
}
