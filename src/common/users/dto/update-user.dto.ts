import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsEmail,
  IsOptional,
  IsDateString,
  IsInt,
  IsPositive,
  MinLength,
  MaxLength,
} from 'class-validator';

export class UpdateUserDto {
  @ApiProperty({
    description: 'User first name',
    example: 'Juan',
    required: false,
    minLength: 1,
    maxLength: 255,
  })
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(255)
  userFirstName?: string;

  @ApiProperty({
    description: 'User second name',
    example: 'Carlos',
    required: false,
    maxLength: 255,
  })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  userSecondName?: string;

  @ApiProperty({
    description: 'User first last name',
    example: 'Pérez',
    required: false,
    minLength: 1,
    maxLength: 255,
  })
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(255)
  userFirstLastName?: string;

  @ApiProperty({
    description: 'User second last name',
    example: 'González',
    required: false,
    maxLength: 255,
  })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  userSecondLastName?: string;

  @ApiProperty({
    description: 'User email address',
    example: 'juan.perez@example.com',
    required: false,
    maxLength: 255,
  })
  @IsOptional()
  @IsEmail()
  @MaxLength(255)
  userEmail?: string;

  @ApiProperty({
    description: 'User password',
    example: 'SecurePassword123!',
    required: false,
    minLength: 8,
    maxLength: 255,
  })
  @IsOptional()
  @IsString()
  @MinLength(8)
  @MaxLength(255)
  userPassword?: string;

  @ApiProperty({
    description: 'User date of birth (YYYY-MM-DD)',
    example: '1990-05-15',
    required: false,
  })
  @IsOptional()
  @IsDateString()
  userDateOfBirth?: string;

  @ApiProperty({
    description: 'User address',
    example: '123 Main Street, City, State',
    required: false,
  })
  @IsOptional()
  @IsString()
  userAddress?: string;

  @ApiProperty({
    description: 'User phone number',
    example: '+1-555-0123',
    required: false,
    maxLength: 20,
  })
  @IsOptional()
  @IsString()
  @MaxLength(20)
  userPhoneNumber?: string;

  @ApiProperty({
    description: 'User role ID',
    example: 1,
    required: false,
    minimum: 1,
  })
  @IsOptional()
  @IsInt()
  @IsPositive()
  userRoleId?: number;
}
