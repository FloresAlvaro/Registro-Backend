import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsBoolean,
  IsOptional,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateSubjectDto {
  @ApiProperty({
    description: 'The name of the subject',
    example: 'Mathematics',
    maxLength: 255,
    minLength: 1,
  })
  @IsString()
  @MinLength(1)
  @MaxLength(255)
  subjectName: string;

  @ApiProperty({
    description: 'The description of the subject',
    example: 'Basic mathematics for elementary students',
    maxLength: 255,
    minLength: 1,
  })
  @IsString()
  @MinLength(1)
  @MaxLength(255)
  subjectDescription: string;

  @ApiProperty({
    description: 'The status of the subject',
    example: true,
    default: true,
  })
  @IsBoolean()
  @IsOptional()
  subjectStatus?: boolean = true;
}
