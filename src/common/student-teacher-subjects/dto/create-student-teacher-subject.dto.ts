import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsPositive, IsString, IsDateString, IsOptional, IsBoolean } from 'class-validator';

export class CreateStudentTeacherSubjectDto {
  @ApiProperty({
    description: 'Student ID',
    example: 1,
    minimum: 1,
  })
  @IsInt()
  @IsPositive()
  studentId: number;

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

  @ApiProperty({
    description: 'Grade ID',
    example: 1,
    minimum: 1,
  })
  @IsInt()
  @IsPositive()
  gradeId: number;

  @ApiProperty({
    description: 'Academic period (e.g., "2024-Q1", "Spring 2024")',
    example: '2024-Q1',
    maxLength: 50,
  })
  @IsString()
  academicPeriod: string;

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
    default: true,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}