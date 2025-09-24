import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsPositive, IsOptional, IsString, IsDateString, IsBoolean } from 'class-validator';

export class UpdateStudentTeacherSubjectDto {
  @ApiProperty({
    description: 'Student ID',
    example: 1,
    required: false,
    minimum: 1,
  })
  @IsOptional()
  @IsInt()
  @IsPositive()
  studentId?: number;

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
    description: 'Academic period (e.g., "2024-Q1", "Spring 2024")',
    example: '2024-Q1',
    required: false,
    maxLength: 50,
  })
  @IsOptional()
  @IsString()
  academicPeriod?: string;

  @ApiProperty({
    description: 'Assignment date',
    example: '2024-09-01',
    required: false,
  })
  @IsOptional()
  @IsDateString()
  assignmentDate?: string;

  @ApiProperty({
    description: 'Active status',
    example: true,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}