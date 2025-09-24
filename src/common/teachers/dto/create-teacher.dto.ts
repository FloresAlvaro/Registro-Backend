import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsPositive } from 'class-validator';

export class CreateTeacherDto {
  @ApiProperty({
    description: 'User ID associated with this teacher',
    example: 1,
    minimum: 1,
  })
  @IsInt()
  @IsPositive()
  userId: number;
}
