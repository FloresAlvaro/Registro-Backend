import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsBoolean,
  IsOptional,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateRoleDto {
  @ApiProperty({
    description: 'The name of the role',
    example: 'Administrator',
    maxLength: 255,
    minLength: 1,
  })
  @IsString()
  @MinLength(1)
  @MaxLength(255)
  roleName: string;

  @ApiProperty({
    description: 'The status of the role',
    example: true,
    default: true,
  })
  @IsBoolean()
  @IsOptional()
  roleStatus?: boolean = true;
}
