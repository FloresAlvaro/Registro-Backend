import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsPositive } from 'class-validator';

export class CreateStudentDto {
  @ApiProperty({
    description: 'User ID associated with this student',
    example: 1,
    minimum: 1,
  })
  @IsInt()
  @IsPositive()
  userId: number;

  @ApiProperty({
    description: 'Grade ID for this student',
    example: 1,
    minimum: 1,
  })
  @IsInt()
  @IsPositive()
  gradeId: number;
}
