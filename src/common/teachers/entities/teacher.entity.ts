import { ApiProperty } from '@nestjs/swagger';

export class Teacher {
  @ApiProperty({ description: 'Teacher ID', example: 1 })
  teacherId: number;

  @ApiProperty({
    description: 'User ID associated with this teacher',
    example: 1,
  })
  userId: number;
}
