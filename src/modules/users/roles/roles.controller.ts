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
import { RolesService } from './roles.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { Role } from './entities/role.entity';

@ApiTags('Roles')
@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Post()
  @ApiOperation({
    summary: 'Create a new role',
    description: 'Create a new user role in the system',
  })
  @ApiBody({
    type: CreateRoleDto,
    description: 'Role creation data',
    examples: {
      adminRole: {
        summary: 'Administrator Role',
        value: {
          roleName: 'Administrator',
        },
      },
      teacherRole: {
        summary: 'Teacher Role',
        value: {
          roleName: 'Teacher',
        },
      },
      studentRole: {
        summary: 'Student Role',
        value: {
          roleName: 'Student',
        },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Role created successfully',
    type: Role,
    examples: {
      success: {
        summary: 'Role Created Successfully',
        value: {
          roleId: 4,
          roleName: 'Administrator',
          roleStatus: true,
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
          message: ['roleName must be unique', 'roleName must not be empty'],
          error: 'Bad Request',
          statusCode: 400,
          timestamp: '2024-01-15T10:30:00.000Z',
          path: '/roles',
        },
      },
    },
  })
  create(@Body() createRoleDto: CreateRoleDto): Promise<Role> {
    return this.rolesService.create(createRoleDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Get all roles with optional status filter',
    description: 'Retrieve all system roles with optional status filtering',
  })
  @ApiQuery({
    name: 'status',
    required: false,
    enum: ['active', 'inactive', 'all'],
    description: 'Filter roles by status. Default: all',
    example: 'active',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Roles retrieved successfully',
    type: [Role],
    examples: {
      allRoles: {
        summary: 'All System Roles',
        value: [
          {
            roleId: 1,
            roleName: 'Administrador',
            roleStatus: true,
          },
          {
            roleId: 2,
            roleName: 'Profesor',
            roleStatus: true,
          },
          {
            roleId: 3,
            roleName: 'Estudiante',
            roleStatus: true,
          },
        ],
      },
      activeOnly: {
        summary: 'Active Roles Only',
        value: [
          {
            roleId: 1,
            roleName: 'Administrador',
            roleStatus: true,
          },
          {
            roleId: 2,
            roleName: 'Profesor',
            roleStatus: true,
          },
        ],
      },
    },
  })
  findAll(
    @Query('status') status?: 'active' | 'inactive' | 'all',
  ): Promise<Role[]> {
    // Normalize the status parameter: if it's not 'active' or 'inactive', treat as 'all'
    const normalizedStatus =
      status && ['active', 'inactive'].includes(status) ? status : 'all';
    return this.rolesService.findAll(normalizedStatus);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a role by ID' })
  @ApiParam({ name: 'id', description: 'Role ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Role found',
    type: Role,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Role not found',
  })
  findOne(@Param('id', ParseIntPipe) id: number): Promise<Role> {
    return this.rolesService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a role by ID' })
  @ApiParam({ name: 'id', description: 'Role ID' })
  @ApiBody({ type: UpdateRoleDto })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Role updated successfully',
    type: Role,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Role not found',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid input data',
  })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateRoleDto: UpdateRoleDto,
  ): Promise<Role> {
    return this.rolesService.update(id, updateRoleDto);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Soft delete a role by ID',
    description:
      'Deactivate a role by setting its status to false (soft delete)',
  })
  @ApiParam({ name: 'id', description: 'Role ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Role deactivated successfully (soft delete)',
    type: Role,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Role not found',
  })
  remove(@Param('id', ParseIntPipe) id: number): Promise<Role> {
    return this.rolesService.remove(id);
  }

  @Patch(':id/toggle-status')
  @ApiOperation({ summary: 'Toggle the status of a role (active/inactive)' })
  @ApiParam({ name: 'id', description: 'Role ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Role status toggled successfully',
    type: Role,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Role not found',
  })
  toggleStatus(@Param('id', ParseIntPipe) id: number): Promise<Role> {
    return this.rolesService.toggleStatus(id);
  }
}
