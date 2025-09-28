import { ApiProperty } from '@nestjs/swagger';

export class User {
  @ApiProperty({
    description: 'User ID',
    example: 1,
  })
  userId: number;

  @ApiProperty({ description: 'User first name', example: 'Juan' })
  userFirstName: string;

  @ApiProperty({
    description: 'User second name',
    example: 'Carlos',
    required: false,
  })
  userSecondName?: string | null;

  @ApiProperty({ description: 'User first last name', example: 'Pérez' })
  userFirstLastName: string;

  @ApiProperty({
    description: 'User second last name',
    example: 'González',
    required: false,
  })
  userSecondLastName?: string | null;

  @ApiProperty({
    description: 'User email address',
    example: 'juan.perez@example.com',
  })
  userEmail: string;

  @ApiProperty({
    description: 'User identification number (Cédula de Identidad)',
    example: 12345678,
  })
  userCI: number;

  @ApiProperty({ description: 'User password', example: 'hashedPassword123' })
  userPassword: string;

  @ApiProperty({
    description: 'User date of birth',
    example: '1990-05-15T00:00:00.000Z',
  })
  userDateOfBirth: Date;

  @ApiProperty({
    description: 'User address',
    example: '123 Main Street, City, State',
    required: false,
  })
  userAddress?: string | null;

  @ApiProperty({
    description: 'User phone number',
    example: '+1-555-0123',
    required: false,
  })
  userPhoneNumber?: string | null;

  @ApiProperty({
    description: 'User role ID',
    example: 2,
  })
  userRoleId: number;

  @ApiProperty({
    description: 'User status (active/inactive)',
    example: true,
    default: true,
  })
  userStatus: boolean;

  @ApiProperty({
    description: 'Creation timestamp',
    example: '2024-01-15T10:30:00.000Z',
  })
  createdAt: Date | null;

  @ApiProperty({
    description: 'Last update timestamp',
    example: '2024-01-15T10:30:00.000Z',
  })
  updatedAt: Date | null;
}
