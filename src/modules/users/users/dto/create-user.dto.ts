import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsDateString,
  MinLength,
  MaxLength,
  Min,
  Max,
  IsInt,
  IsPositive,
} from 'class-validator';

export class CreateUserDto {
  @ApiProperty({
    description: 'User first name',
    example: 'Juan',
    minLength: 1,
    maxLength: 255,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  @MaxLength(255)
  userFirstName: string;

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
    minLength: 1,
    maxLength: 255,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  @MaxLength(255)
  userFirstLastName: string;

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
    maxLength: 255,
  })
  @IsEmail()
  @IsNotEmpty()
  @MaxLength(255)
  userEmail: string;

  @ApiProperty({
    description: 'User identification number (Cédula de Identidad)',
    example: 12345678,
    minimum: 1000000,
    maximum: 999999999,
  })
  @IsInt()
  @IsPositive()
  @Min(1000000)
  @Max(999999999)
  userCI: number;

  @ApiProperty({
    description: 'User password',
    example: 'SecurePassword123!',
    minLength: 8,
    maxLength: 255,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  @MaxLength(255)
  userPassword: string;

  @ApiProperty({
    description: 'User date of birth (YYYY-MM-DD)',
    example: '1990-05-15',
  })
  @IsDateString()
  @IsNotEmpty()
  userDateOfBirth: string;

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
    minimum: 1,
  })
  @IsInt()
  @IsPositive()
  userRoleId: number;
}
