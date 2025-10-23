import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  MaxLength,
  MinLength,
  IsBoolean,
} from 'class-validator';

export class UpdateRoleDto {
  @ApiProperty({
    description: 'The name of the role',
    example: 'Administrator',
    maxLength: 255,
    minLength: 1,
    required: false,
  })
  @IsString()
  @IsOptional()
  @MinLength(1)
  @MaxLength(255)
  roleName?: string;

  @ApiProperty({
    description: 'The status of the role',
    example: true,
    required: false,
  })
  @IsBoolean()
  @IsOptional()
  roleStatus?: boolean;
}
