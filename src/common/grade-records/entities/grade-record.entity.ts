import { ApiProperty } from '@nestjs/swagger';

export class GradeRecord {
  @ApiProperty({ description: 'Grade record ID', example: 1 })
  gradeRecordId: number;

  @ApiProperty({ description: 'Student ID', example: 1 })
  studentId: number;

  @ApiProperty({ description: 'Subject ID', example: 1 })
  subjectId: number;

  @ApiProperty({ description: 'Grade ID', example: 1 })
  gradeId: number;

  @ApiProperty({ description: 'Score obtained', example: 85.5 })
  score: number;

  @ApiProperty({
    description: 'Maximum possible score',
    example: 100.0,
    default: 100.0,
  })
  maxScore: number;

  @ApiProperty({ description: 'Type of grade/evaluation', example: 'Exam' })
  gradeType: string;

  @ApiProperty({ description: 'Evaluation date', example: '2024-01-15' })
  evaluationDate: Date;

  @ApiProperty({ description: 'Academic period', example: '2024-1' })
  academicPeriod: string;

  @ApiProperty({ description: 'Comments about the grade', required: false })
  comments?: string | null;

  @ApiProperty({ description: 'Record status', example: true, default: true })
  recordStatus: boolean;

  @ApiProperty({
    description: 'Creation timestamp',
    example: '2024-01-15T10:30:00.000Z',
  })
  createdAt: Date | null;

  @ApiProperty({
    description: 'Last update timestamp',
    example: '2024-01-15T10:30:00.000Z',
  })
  updatedAt: Date | null;
}
