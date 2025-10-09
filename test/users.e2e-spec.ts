import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from '../src/app.module';

const request = require('supertest');

describe('Users API - Educational System (TestSprite Generated)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('POST /users - Create User', () => {
    it('should create a new administrator user', async () => {
      const createUserDto = {
        userFirstName: 'TestSprite',
        userSecondName: 'Admin',
        userFirstLastName: 'User',
        userSecondLastName: 'Test',
        userEmail: 'testsprite.admin@edu.pe',
        userCI: 12345678,
        userPassword: 'TestPassword123!',
        userDateOfBirth: '1990-01-01',
        userAddress: 'TestSprite Address 123',
        userPhoneNumber: '987654321',
        userRoleId: 1,
      };

      const response = await request(app.getHttpServer())
        .post('/users')
        .send(createUserDto)
        .expect(201);

      expect(response.body).toHaveProperty('userId');
      expect(response.body.userFirstName).toBe(createUserDto.userFirstName);
      expect(response.body.userEmail).toBe(createUserDto.userEmail);
      expect(response.body.userStatus).toBe(true);
    });

    it('should create a teacher user', async () => {
      const createUserDto = {
        userFirstName: 'TestSprite',
        userSecondName: 'Teacher',
        userFirstLastName: 'Professor',
        userSecondLastName: 'Test',
        userEmail: 'testsprite.teacher@edu.pe',
        userCI: 87654321,
        userPassword: 'TeacherPass123!',
        userDateOfBirth: '1985-05-15',
        userAddress: 'Teacher Street 456',
        userPhoneNumber: '987654322',
        userRoleId: 2,
      };

      const response = await request(app.getHttpServer())
        .post('/users')
        .send(createUserDto)
        .expect(201);

      expect(response.body).toHaveProperty('userId');
      expect(response.body.userFirstName).toBe(createUserDto.userFirstName);
      expect(response.body.userRoleId).toBe(2);
    });

    it('should create a student user', async () => {
      const createUserDto = {
        userFirstName: 'TestSprite',
        userSecondName: 'Student',
        userFirstLastName: 'Pupil',
        userSecondLastName: 'Test',
        userEmail: 'testsprite.student@edu.pe',
        userCI: 11223344,
        userPassword: 'StudentPass123!',
        userDateOfBirth: '2010-03-20',
        userAddress: 'Student Avenue 789',
        userPhoneNumber: '987654323',
        userRoleId: 3,
      };

      const response = await request(app.getHttpServer())
        .post('/users')
        .send(createUserDto)
        .expect(201);

      expect(response.body).toHaveProperty('userId');
      expect(response.body.userRoleId).toBe(3);
    });

    it('should validate required fields', async () => {
      const invalidDto = {
        userFirstName: 'Test',
        // Missing required fields
      };

      await request(app.getHttpServer())
        .post('/users')
        .send(invalidDto)
        .expect(400);
    });

    it('should prevent duplicate email addresses', async () => {
      const duplicateEmailDto = {
        userFirstName: 'Duplicate',
        userSecondName: 'Email',
        userFirstLastName: 'Test',
        userSecondLastName: 'User',
        userEmail: 'duplicate@edu.pe',
        userCI: 99887766,
        userPassword: 'Password123!',
        userDateOfBirth: '1995-01-01',
        userAddress: 'Duplicate Address',
        userPhoneNumber: '987654999',
        userRoleId: 1,
      };

      // Create first user
      await request(app.getHttpServer())
        .post('/users')
        .send(duplicateEmailDto)
        .expect(201);

      // Try to create duplicate
      await request(app.getHttpServer())
        .post('/users')
        .send({
          ...duplicateEmailDto,
          userCI: 99887767, // Different CI
        })
        .expect(400);
    });

    it('should prevent duplicate CI numbers', async () => {
      const duplicateCIDto = {
        userFirstName: 'Duplicate',
        userSecondName: 'CI',
        userFirstLastName: 'Test',
        userSecondLastName: 'User',
        userEmail: 'unique.email@edu.pe',
        userCI: 55667788,
        userPassword: 'Password123!',
        userDateOfBirth: '1995-01-01',
        userAddress: 'Unique Address',
        userPhoneNumber: '987654888',
        userRoleId: 1,
      };

      // Create first user
      await request(app.getHttpServer())
        .post('/users')
        .send(duplicateCIDto)
        .expect(201);

      // Try to create duplicate CI
      await request(app.getHttpServer())
        .post('/users')
        .send({
          ...duplicateCIDto,
          userEmail: 'another.email@edu.pe', // Different email
        })
        .expect(400);
    });
  });

  describe('GET /users - List Users', () => {
    it('should return all users', async () => {
      const response = await request(app.getHttpServer())
        .get('/users')
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);

      // Verify user structure
      if (response.body.length > 0) {
        const user = response.body[0];
        expect(user).toHaveProperty('userId');
        expect(user).toHaveProperty('userFirstName');
        expect(user).toHaveProperty('userEmail');
        expect(user).toHaveProperty('userRoleId');
        expect(user).toHaveProperty('userStatus');
      }
    });

    it('should filter users by role', async () => {
      const response = await request(app.getHttpServer())
        .get('/users?role=2') // Teachers
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);

      // All returned users should be teachers (role 2)
      response.body.forEach((user: any) => {
        expect(user.userRoleId).toBe(2);
      });
    });

    it('should filter active users only', async () => {
      const response = await request(app.getHttpServer())
        .get('/users?status=active')
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);

      // All returned users should be active
      response.body.forEach((user: any) => {
        expect(user.userStatus).toBe(true);
      });
    });
  });

  describe('GET /users/:id - Get User by ID', () => {
    it('should return specific user by ID', async () => {
      // First create a user
      const createResponse = await request(app.getHttpServer())
        .post('/users')
        .send({
          userFirstName: 'TestSprite',
          userSecondName: 'Get',
          userFirstLastName: 'User',
          userSecondLastName: 'Test',
          userEmail: 'testsprite.get@edu.pe',
          userCI: 11111111,
          userPassword: 'GetTest123!',
          userDateOfBirth: '1992-01-01',
          userAddress: 'Get Test Address',
          userPhoneNumber: '987651111',
          userRoleId: 1,
        });

      const userId = createResponse.body.userId;

      const response = await request(app.getHttpServer())
        .get(`/users/${userId}`)
        .expect(200);

      expect(response.body.userId).toBe(userId);
      expect(response.body.userFirstName).toBe('TestSprite');
      expect(response.body.userEmail).toBe('testsprite.get@edu.pe');
    });

    it('should return 404 for non-existent user', async () => {
      const nonExistentId = 99999;

      await request(app.getHttpServer())
        .get(`/users/${nonExistentId}`)
        .expect(404);
    });
  });

  describe('PATCH /users/:id - Update User', () => {
    it('should update user information', async () => {
      // Create a user first
      const createResponse = await request(app.getHttpServer())
        .post('/users')
        .send({
          userFirstName: 'Update',
          userSecondName: 'Test',
          userFirstLastName: 'User',
          userSecondLastName: 'Original',
          userEmail: 'update.test@edu.pe',
          userCI: 22222222,
          userPassword: 'UpdateTest123!',
          userDateOfBirth: '1990-01-01',
          userAddress: 'Original Address',
          userPhoneNumber: '987652222',
          userRoleId: 1,
        });

      const userId = createResponse.body.userId;

      const updateDto = {
        userFirstName: 'Updated',
        userAddress: 'Updated Address by TestSprite',
        userPhoneNumber: '987659999',
      };

      const response = await request(app.getHttpServer())
        .patch(`/users/${userId}`)
        .send(updateDto)
        .expect(200);

      expect(response.body.userId).toBe(userId);
      expect(response.body.userFirstName).toBe('Updated');
      expect(response.body.userAddress).toBe('Updated Address by TestSprite');
      expect(response.body.userPhoneNumber).toBe('987659999');
    });
  });

  describe('DELETE /users/:id - Delete User', () => {
    it('should soft delete user successfully', async () => {
      // Create a user first
      const createResponse = await request(app.getHttpServer())
        .post('/users')
        .send({
          userFirstName: 'Delete',
          userSecondName: 'Test',
          userFirstLastName: 'User',
          userSecondLastName: 'ToDelete',
          userEmail: 'delete.test@edu.pe',
          userCI: 33333333,
          userPassword: 'DeleteTest123!',
          userDateOfBirth: '1990-01-01',
          userAddress: 'Delete Address',
          userPhoneNumber: '987653333',
          userRoleId: 1,
        });

      const userId = createResponse.body.userId;

      await request(app.getHttpServer()).delete(`/users/${userId}`).expect(200);

      // Verify user is soft deleted
      await request(app.getHttpServer()).get(`/users/${userId}`).expect(404);
    });
  });

  describe('User Validation & Business Logic', () => {
    it('should validate email format', async () => {
      const invalidEmailDto = {
        userFirstName: 'Invalid',
        userSecondName: 'Email',
        userFirstLastName: 'Test',
        userSecondLastName: 'User',
        userEmail: 'invalid-email-format',
        userCI: 44444444,
        userPassword: 'ValidPass123!',
        userDateOfBirth: '1990-01-01',
        userAddress: 'Test Address',
        userPhoneNumber: '987654444',
        userRoleId: 1,
      };

      await request(app.getHttpServer())
        .post('/users')
        .send(invalidEmailDto)
        .expect(400);
    });

    it('should validate CI number format (8 digits)', async () => {
      const invalidCIDto = {
        userFirstName: 'Invalid',
        userSecondName: 'CI',
        userFirstLastName: 'Test',
        userSecondLastName: 'User',
        userEmail: 'invalid.ci@edu.pe',
        userCI: 123, // Too short
        userPassword: 'ValidPass123!',
        userDateOfBirth: '1990-01-01',
        userAddress: 'Test Address',
        userPhoneNumber: '987654555',
        userRoleId: 1,
      };

      await request(app.getHttpServer())
        .post('/users')
        .send(invalidCIDto)
        .expect(400);
    });

    it('should create user with proper audit timestamps', async () => {
      const auditTestDto = {
        userFirstName: 'Audit',
        userSecondName: 'Test',
        userFirstLastName: 'User',
        userSecondLastName: 'Timestamps',
        userEmail: 'audit.test@edu.pe',
        userCI: 55555555,
        userPassword: 'AuditTest123!',
        userDateOfBirth: '1990-01-01',
        userAddress: 'Audit Address',
        userPhoneNumber: '987655555',
        userRoleId: 1,
      };

      const response = await request(app.getHttpServer())
        .post('/users')
        .send(auditTestDto)
        .expect(201);

      expect(response.body).toHaveProperty('createdAt');
      expect(response.body).toHaveProperty('updatedAt');
      expect(new Date(response.body.createdAt)).toBeInstanceOf(Date);
      expect(new Date(response.body.updatedAt)).toBeInstanceOf(Date);
    });

    it('should validate birth date format', async () => {
      const invalidDateDto = {
        userFirstName: 'Invalid',
        userSecondName: 'Date',
        userFirstLastName: 'Test',
        userSecondLastName: 'User',
        userEmail: 'invalid.date@edu.pe',
        userCI: 66666666,
        userPassword: 'ValidPass123!',
        userDateOfBirth: 'invalid-date-format',
        userAddress: 'Test Address',
        userPhoneNumber: '987656666',
        userRoleId: 1,
      };

      await request(app.getHttpServer())
        .post('/users')
        .send(invalidDateDto)
        .expect(400);
    });
  });
});
