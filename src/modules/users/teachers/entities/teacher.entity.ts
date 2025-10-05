import { ApiProperty } from '@nestjs/swagger';

export class Teacher {
  @ApiProperty({
    description: 'Teacher ID',
    example: 1,
  })
  teacherId: number;

  @ApiProperty({
    description: 'User ID associated with this teacher',
    example: 1,
  })
  userId: number;

  @ApiProperty({
    description: 'Years of teaching experience',
    example: 5,
    minimum: 0,
  })
  teacherExperienceYears: number;

  @ApiProperty({
    description: 'Professional teaching license number',
    example: 'LIC-2024-001234',
  })
  teacherLicenseNumber: string;

  @ApiProperty({
    description: 'Weekly teaching hours assigned',
    example: 40,
    minimum: 1,
    maximum: 60,
  })
  teacherHours: number;
}
