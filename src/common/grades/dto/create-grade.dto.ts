import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsBoolean,
  IsOptional,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateGradeDto {
  @ApiProperty({
    description: 'The grade level',
    example: '1st Grade',
    maxLength: 255,
    minLength: 1,
  })
  @IsString()
  @MinLength(1)
  @MaxLength(255)
  gradeLevel: string;

  @ApiProperty({
    description: 'The description of the grade',
    example: 'First grade elementary level',
    maxLength: 255,
    minLength: 1,
  })
  @IsString()
  @MinLength(1)
  @MaxLength(255)
  gradeDescription: string;

  @ApiProperty({
    description: 'The status of the grade',
    example: true,
    default: true,
  })
  @IsBoolean()
  @IsOptional()
  gradeStatus?: boolean = true;
}
