import { ApiProperty } from '@nestjs/swagger';

export class TeacherSubject {
  @ApiProperty({
    description: 'Unique identifier for teacher-subject assignment',
    example: 1,
  })
  id: number;

  @ApiProperty({
    description: 'Teacher ID',
    example: 1,
  })
  teacherId: number;

  @ApiProperty({
    description: 'Subject ID',
    example: 1,
  })
  subjectId: number;

  @ApiProperty({
    description: 'Creation timestamp',
    example: '2024-01-01T00:00:00.000Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Last update timestamp',
    example: '2024-01-01T00:00:00.000Z',
  })
  updatedAt: Date;
}