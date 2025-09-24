import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, MaxLength, MinLength } from 'class-validator';

export class UpdateSubjectDto {
  @ApiProperty({
    description: 'The name of the subject',
    example: 'Mathematics',
    maxLength: 255,
    minLength: 1,
    required: false,
  })
  @IsString()
  @IsOptional()
  @MinLength(1)
  @MaxLength(255)
  subjectName?: string;

  @ApiProperty({
    description: 'The description of the subject',
    example: 'Basic mathematics for elementary students',
    maxLength: 255,
    minLength: 1,
    required: false,
  })
  @IsString()
  @IsOptional()
  @MinLength(1)
  @MaxLength(255)
  subjectDescription?: string;
}
