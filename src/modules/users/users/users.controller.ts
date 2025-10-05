import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseIntPipe,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
  ApiBody,
} from '@nestjs/swagger';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { StatusFilterDto, SearchDto, PaginatedResponse } from '@shared';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @ApiOperation({
    summary: 'Create a new user',
    description:
      'Creates a new user in the system with the provided information',
  })
  @ApiBody({
    type: CreateUserDto,
    examples: {
      student: {
        summary: 'Create Student User',
        description: 'Example of creating a student user',
        value: {
          userFirstName: 'María',
          userSecondName: 'José',
          userFirstLastName: 'González',
          userSecondLastName: 'Rodríguez',
          userEmail: 'maria.gonzalez@example.com',
          userCI: 12345678,
          userPassword: 'SecurePass123',
          userDateOfBirth: '2005-03-15',
          userAddress: 'Av. Principal 123, Ciudad',
          userPhoneNumber: '+1234567890',
          userRoleId: 3,
        },
      },
      teacher: {
        summary: 'Create Teacher User',
        description: 'Example of creating a teacher user',
        value: {
          userFirstName: 'Carlos',
          userSecondName: 'Alberto',
          userFirstLastName: 'Martínez',
          userSecondLastName: 'López',
          userEmail: 'carlos.martinez@school.edu',
          userCI: 87654321,
          userPassword: 'TeacherPass456',
          userDateOfBirth: '1985-08-22',
          userAddress: 'Calle Educadores 456, Ciudad',
          userPhoneNumber: '+0987654321',
          userRoleId: 2,
        },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'User created successfully',
    type: User,
    examples: {
      success: {
        summary: 'User Created Successfully',
        value: {
          userId: 1,
          userFirstName: 'María',
          userSecondName: 'José',
          userFirstLastName: 'González',
          userSecondLastName: 'Rodríguez',
          userEmail: 'maria.gonzalez@example.com',
          userCI: 12345678,
          userPassword: '$2b$10$hashedPasswordExample123',
          userDateOfBirth: '2005-03-15T00:00:00.000Z',
          userAddress: 'Av. Principal 123, Ciudad',
          userPhoneNumber: '+1234567890',
          userRoleId: 3,
          userStatus: true,
          createdAt: '2024-01-15T10:30:00.000Z',
          updatedAt: '2024-01-15T10:30:00.000Z',
        },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid input data',
    examples: {
      validationError: {
        summary: 'Validation Error',
        value: {
          success: false,
          message: 'Validation failed',
          error: 'Bad Request',
          statusCode: 400,
          timestamp: '2024-01-15T10:30:00.000Z',
          path: '/users',
          details: {
            userEmail: 'Email already exists',
            userPassword: 'Password must be at least 8 characters',
          },
        },
      },
    },
  })
  create(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.usersService.create(createUserDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Get all users with optional status filter',
    description:
      'Retrieves all users from the system with optional status filtering',
  })
  @ApiQuery({
    name: 'status',
    required: false,
    enum: ['active', 'inactive', 'all'],
    description: 'Filter users by status. Default: all',
    examples: {
      active: {
        summary: 'Active Users Only',
        description: 'Get only active users',
        value: 'active',
      },
      inactive: {
        summary: 'Inactive Users Only',
        description: 'Get only inactive users',
        value: 'inactive',
      },
      all: {
        summary: 'All Users',
        description: 'Get all users regardless of status',
        value: 'all',
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Users retrieved successfully',
    type: [User],
    examples: {
      success: {
        summary: 'Users List',
        value: [
          {
            userId: 1,
            userFirstName: 'María',
            userSecondName: 'José',
            userFirstLastName: 'González',
            userSecondLastName: 'Rodríguez',
            userEmail: 'maria.gonzalez@example.com',
            userPassword: '$2b$10$hashedPasswordExample123',
            userDateOfBirth: '2005-03-15T00:00:00.000Z',
            userAddress: 'Av. Principal 123, Ciudad',
            userPhoneNumber: '+1234567890',
            userRoleId: 3,
            userStatus: true,
            createdAt: '2024-01-15T10:30:00.000Z',
            updatedAt: '2024-01-15T10:30:00.000Z',
          },
          {
            userId: 2,
            userFirstName: 'Carlos',
            userSecondName: 'Alberto',
            userFirstLastName: 'Martínez',
            userSecondLastName: 'López',
            userEmail: 'carlos.martinez@school.edu',
            userPassword: '$2b$10$hashedPasswordExample456',
            userDateOfBirth: '1985-08-22T00:00:00.000Z',
            userAddress: 'Calle Educadores 456, Ciudad',
            userPhoneNumber: '+0987654321',
            userRoleId: 2,
            userStatus: true,
            createdAt: '2024-01-14T08:45:00.000Z',
            updatedAt: '2024-01-14T08:45:00.000Z',
          },
        ],
      },
      empty: {
        summary: 'No Users Found',
        value: [],
      },
    },
  })
  findAll(
    @Query('status') status?: 'active' | 'inactive' | 'all',
  ): Promise<User[]> {
    return this.usersService.findAllByStatus(status);
  }

  @Get('search')
  @ApiOperation({
    summary: 'Search users with advanced filtering and pagination',
    description: 'Search users using multiple filters with pagination support',
  })
  @ApiQuery({
    name: 'search',
    required: false,
    description: 'Search term for name or email',
    example: 'maria',
  })
  @ApiQuery({
    name: 'status',
    required: false,
    enum: ['active', 'inactive', 'all'],
    description: 'Filter by user status',
    example: 'active',
  })
  @ApiQuery({
    name: 'roleId',
    required: false,
    type: 'number',
    description: 'Filter by role ID',
    example: 3,
  })
  @ApiQuery({
    name: 'page',
    required: false,
    type: 'number',
    description: 'Page number for pagination',
    example: 1,
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: 'number',
    description: 'Number of items per page',
    example: 10,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Users retrieved successfully with pagination',
    examples: {
      success: {
        summary: 'Paginated Users Search',
        value: {
          data: [
            {
              userId: 1,
              userFirstName: 'María',
              userSecondName: 'José',
              userFirstLastName: 'González',
              userSecondLastName: 'Rodríguez',
              userEmail: 'maria.gonzalez@example.com',
              userPassword: '$2b$10$hashedPasswordExample123',
              userDateOfBirth: '2005-03-15T00:00:00.000Z',
              userAddress: 'Av. Principal 123, Ciudad',
              userPhoneNumber: '+1234567890',
              userRoleId: 3,
              userStatus: true,
              createdAt: '2024-01-15T10:30:00.000Z',
              updatedAt: '2024-01-15T10:30:00.000Z',
            },
          ],
          pagination: {
            page: 1,
            limit: 10,
            totalItems: 1,
            totalPages: 1,
            hasNextPage: false,
            hasPreviousPage: false,
          },
        },
      },
    },
  })
  searchUsers(
    @Query() filters: StatusFilterDto & SearchDto,
  ): Promise<PaginatedResponse<User>> {
    return this.usersService.findAllAdvanced(filters);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get a user by ID',
    description: 'Retrieve a specific user by their unique ID',
  })
  @ApiParam({
    name: 'id',
    description: 'User unique identifier',
    example: 1,
    type: 'number',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'User found',
    type: User,
    examples: {
      success: {
        summary: 'User Found',
        value: {
          userId: 1,
          userFirstName: 'María',
          userSecondName: 'José',
          userFirstLastName: 'González',
          userSecondLastName: 'Rodríguez',
          userEmail: 'maria.gonzalez@example.com',
          userPassword: '$2b$10$hashedPasswordExample123',
          userDateOfBirth: '2005-03-15T00:00:00.000Z',
          userAddress: 'Av. Principal 123, Ciudad',
          userPhoneNumber: '+1234567890',
          userRoleId: 3,
          userStatus: true,
          createdAt: '2024-01-15T10:30:00.000Z',
          updatedAt: '2024-01-15T10:30:00.000Z',
        },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'User not found',
    examples: {
      notFound: {
        summary: 'User Not Found',
        value: {
          success: false,
          message: 'User not found',
          error: 'Not Found',
          statusCode: 404,
          timestamp: '2024-01-15T10:30:00.000Z',
          path: '/users/999',
        },
      },
    },
  })
  findOne(@Param('id', ParseIntPipe) id: number): Promise<User> {
    return this.usersService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Update a user by ID',
    description: 'Update specific fields of a user by their ID',
  })
  @ApiParam({
    name: 'id',
    description: 'User unique identifier',
    example: 1,
    type: 'number',
  })
  @ApiBody({
    type: UpdateUserDto,
    description: 'User update data',
    examples: {
      updateProfile: {
        summary: 'Update User Profile',
        value: {
          userFirstName: 'María Elena',
          userSecondName: 'José',
          userAddress: 'Nueva Dirección 456, Ciudad',
          userPhoneNumber: '+1987654321',
        },
      },
      updateEmail: {
        summary: 'Update Email Only',
        value: {
          userEmail: 'nuevo.email@example.com',
        },
      },
      changeRole: {
        summary: 'Change User Role',
        value: {
          userRoleId: 2,
        },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'User updated successfully',
    type: User,
    examples: {
      success: {
        summary: 'User Updated Successfully',
        value: {
          userId: 1,
          userFirstName: 'María Elena',
          userSecondName: 'José',
          userFirstLastName: 'González',
          userSecondLastName: 'Rodríguez',
          userEmail: 'maria.gonzalez@example.com',
          userPassword: '$2b$10$hashedPasswordExample123',
          userDateOfBirth: '2005-03-15T00:00:00.000Z',
          userAddress: 'Nueva Dirección 456, Ciudad',
          userPhoneNumber: '+1987654321',
          userRoleId: 3,
          userStatus: true,
          createdAt: '2024-01-15T10:30:00.000Z',
          updatedAt: '2024-01-15T12:45:00.000Z',
        },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'User not found',
    examples: {
      notFound: {
        summary: 'User Not Found',
        value: {
          success: false,
          message: 'User not found',
          error: 'Not Found',
          statusCode: 404,
          timestamp: '2024-01-15T10:30:00.000Z',
          path: '/users/999',
        },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid input data',
    examples: {
      validation: {
        summary: 'Validation Error',
        value: {
          success: false,
          message: ['userEmail must be a valid email'],
          error: 'Bad Request',
          statusCode: 400,
          timestamp: '2024-01-15T10:30:00.000Z',
          path: '/users/1',
        },
      },
    },
  })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<User> {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete a user by ID',
    description: 'Permanently delete a user from the system',
  })
  @ApiParam({
    name: 'id',
    description: 'User unique identifier',
    example: 1,
    type: 'number',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'User deleted successfully',
    type: User,
    examples: {
      success: {
        summary: 'User Deleted Successfully',
        value: {
          userId: 1,
          userFirstName: 'María',
          userSecondName: 'José',
          userFirstLastName: 'González',
          userSecondLastName: 'Rodríguez',
          userEmail: 'maria.gonzalez@example.com',
          userPassword: '$2b$10$hashedPasswordExample123',
          userDateOfBirth: '2005-03-15T00:00:00.000Z',
          userAddress: 'Av. Principal 123, Ciudad',
          userPhoneNumber: '+1234567890',
          userRoleId: 3,
          userStatus: true,
          createdAt: '2024-01-15T10:30:00.000Z',
          updatedAt: '2024-01-15T10:30:00.000Z',
        },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'User not found',
    examples: {
      notFound: {
        summary: 'User Not Found',
        value: {
          success: false,
          message: 'User not found',
          error: 'Not Found',
          statusCode: 404,
          timestamp: '2024-01-15T10:30:00.000Z',
          path: '/users/999',
        },
      },
    },
  })
  remove(@Param('id', ParseIntPipe) id: number): Promise<User> {
    return this.usersService.remove(id);
  }

  @Patch(':id/toggle-status')
  @ApiOperation({
    summary: 'Toggle the status of a user (active/inactive)',
    description:
      'Switch user status between active (true) and inactive (false)',
  })
  @ApiParam({
    name: 'id',
    description: 'User unique identifier',
    example: 1,
    type: 'number',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'User status toggled successfully',
    type: User,
    examples: {
      activateUser: {
        summary: 'User Activated - Previously inactive user is now activated',
        value: {
          userId: 1,
          userFirstName: 'María',
          userSecondName: 'José',
          userFirstLastName: 'González',
          userSecondLastName: 'Rodríguez',
          userEmail: 'maria.gonzalez@example.com',
          userPassword: '$2b$10$hashedPasswordExample123',
          userDateOfBirth: '2005-03-15T00:00:00.000Z',
          userAddress: 'Av. Principal 123, Ciudad',
          userPhoneNumber: '+1234567890',
          userRoleId: 3,
          userStatus: true,
          createdAt: '2024-01-15T10:30:00.000Z',
          updatedAt: '2024-01-15T14:20:00.000Z',
        },
      },
      deactivateUser: {
        summary: 'User Deactivated - Previously active user is now deactivated',
        value: {
          userId: 2,
          userFirstName: 'Carlos',
          userSecondName: 'Alberto',
          userFirstLastName: 'Pérez',
          userSecondLastName: 'López',
          userEmail: 'carlos.perez@example.com',
          userPassword: '$2b$10$hashedPasswordExample456',
          userDateOfBirth: '1985-08-20T00:00:00.000Z',
          userAddress: 'Calle Secundaria 789, Ciudad',
          userPhoneNumber: '+0987654321',
          userRoleId: 2,
          userStatus: false,
          createdAt: '2024-01-10T08:15:00.000Z',
          updatedAt: '2024-01-15T14:20:00.000Z',
        },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'User not found',
    examples: {
      notFound: {
        summary: 'User Not Found',
        value: {
          success: false,
          message: 'User not found',
          error: 'Not Found',
          statusCode: 404,
          timestamp: '2024-01-15T10:30:00.000Z',
          path: '/users/999/toggle-status',
        },
      },
    },
  })
  toggleStatus(@Param('id', ParseIntPipe) id: number): Promise<User> {
    return this.usersService.toggleStatus(id);
  }
}
