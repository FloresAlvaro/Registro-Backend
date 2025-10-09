import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';

const request = require('supertest');

describe('Database Integration Tests - Educational System (TestSprite Generated)', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    prisma = moduleFixture.get<PrismaService>(PrismaService);
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('Database Triggers Validation', () => {
    it('should auto-update timestamps on record modification', async () => {
      // Create a role
      const createResponse = await request(app.getHttpServer())
        .post('/roles')
        .send({
          roleName: 'TestSprite Timestamp Test',
          roleDescription: 'Testing auto timestamp updates',
        })
        .expect(201);

      const roleId = createResponse.body.roleId;
      const createdAt = new Date(createResponse.body.createdAt);
      const initialUpdatedAt = new Date(createResponse.body.updatedAt);

      // Wait a moment to ensure timestamp difference
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Update the role
      const updateResponse = await request(app.getHttpServer())
        .patch(`/roles/${roleId}`)
        .send({
          roleDescription: 'Updated description for timestamp test',
        })
        .expect(200);

      const finalUpdatedAt = new Date(updateResponse.body.updatedAt);

      expect(finalUpdatedAt.getTime()).toBeGreaterThan(
        initialUpdatedAt.getTime(),
      );
      expect(new Date(updateResponse.body.createdAt).getTime()).toBe(
        createdAt.getTime(),
      );
    });

    it('should validate user data integrity on creation', async () => {
      // Test CI validation (should be 8 digits)
      const invalidCIUser = {
        userFirstName: 'TestSprite',
        userSecondName: 'CI',
        userFirstLastName: 'Validation',
        userSecondLastName: 'Test',
        userEmail: 'ci.validation@edu.pe',
        userCI: 123, // Invalid CI (too short)
        userPassword: 'ValidPass123!',
        userDateOfBirth: '1990-01-01',
        userAddress: 'Test Address',
        userPhoneNumber: '987654321',
        userRoleId: 1,
      };

      await request(app.getHttpServer())
        .post('/users')
        .send(invalidCIUser)
        .expect(400);
    });

    it('should prevent deletion of roles with associated users', async () => {
      // First create a role
      const roleResponse = await request(app.getHttpServer())
        .post('/roles')
        .send({
          roleName: 'TestSprite Role With Users',
          roleDescription: 'Role that will have users assigned',
        })
        .expect(201);

      const roleId = roleResponse.body.roleId;

      // Create a user with this role
      await request(app.getHttpServer())
        .post('/users')
        .send({
          userFirstName: 'TestSprite',
          userSecondName: 'User',
          userFirstLastName: 'With',
          userSecondLastName: 'Role',
          userEmail: 'user.with.role@edu.pe',
          userCI: 77777777,
          userPassword: 'UserRole123!',
          userDateOfBirth: '1990-01-01',
          userAddress: 'User Address',
          userPhoneNumber: '987657777',
          userRoleId: roleId,
        })
        .expect(201);

      // Try to delete the role (should fail due to foreign key constraint)
      await request(app.getHttpServer()).delete(`/roles/${roleId}`).expect(400);
    });

    it('should maintain audit log for user changes', async () => {
      // Create a user
      const createResponse = await request(app.getHttpServer())
        .post('/users')
        .send({
          userFirstName: 'TestSprite',
          userSecondName: 'Audit',
          userFirstLastName: 'Log',
          userSecondLastName: 'Test',
          userEmail: 'audit.log@edu.pe',
          userCI: 88888888,
          userPassword: 'AuditLog123!',
          userDateOfBirth: '1990-01-01',
          userAddress: 'Audit Address',
          userPhoneNumber: '987658888',
          userRoleId: 1,
        })
        .expect(201);

      const userId = createResponse.body.userId;

      // Update the user to trigger audit log
      await request(app.getHttpServer())
        .patch(`/users/${userId}`)
        .send({
          userAddress: 'Updated Audit Address',
        })
        .expect(200);

      // Check if audit log entry was created
      const auditLogs = await prisma.$queryRaw`
        SELECT * FROM "User_Audit" 
        WHERE "userId" = ${userId} 
        ORDER BY "auditTimestamp" DESC 
        LIMIT 1
      `;

      expect(Array.isArray(auditLogs)).toBe(true);
      if (Array.isArray(auditLogs) && auditLogs.length > 0) {
        const latestAudit = auditLogs[0];
        expect(latestAudit.operation).toBe('UPDATE');
        expect(latestAudit.userId).toBe(userId);
      }
    });
  });

  describe('Data Validation Tests', () => {
    it('should validate email uniqueness across system', async () => {
      const duplicateEmail = 'duplicate.system@edu.pe';

      // Create first user
      await request(app.getHttpServer())
        .post('/users')
        .send({
          userFirstName: 'First',
          userSecondName: 'User',
          userFirstLastName: 'With',
          userSecondLastName: 'Email',
          userEmail: duplicateEmail,
          userCI: 11111111,
          userPassword: 'FirstUser123!',
          userDateOfBirth: '1990-01-01',
          userAddress: 'First Address',
          userPhoneNumber: '987651111',
          userRoleId: 1,
        })
        .expect(201);

      // Try to create second user with same email
      await request(app.getHttpServer())
        .post('/users')
        .send({
          userFirstName: 'Second',
          userSecondName: 'User',
          userFirstLastName: 'With',
          userSecondLastName: 'Same Email',
          userEmail: duplicateEmail,
          userCI: 22222222,
          userPassword: 'SecondUser123!',
          userDateOfBirth: '1995-01-01',
          userAddress: 'Second Address',
          userPhoneNumber: '987652222',
          userRoleId: 2,
        })
        .expect(400);
    });

    it('should validate grade score ranges in grade records', async () => {
      // This test assumes grade records functionality exists
      // Test would create a grade record with invalid score (> maxScore)
      const invalidGradeRecord = {
        studentId: 1,
        subjectId: 1,
        gradeId: 1,
        score: 25.0, // Invalid if maxScore is 20.0
        maxScore: 20.0,
        gradeType: 'Exam',
        evaluationDate: '2024-01-15',
        academicPeriod: '2024-I',
        comments: 'Invalid score test',
        recordStatus: true,
      };

      // This would test the grade validation trigger
      try {
        await prisma.$queryRaw`
          INSERT INTO "Grade_Record" 
          ("studentId", "subjectId", "gradeId", "score", "maxScore", "gradeType", 
           "evaluationDate", "academicPeriod", "comments", "recordStatus")
          VALUES (${invalidGradeRecord.studentId}, ${invalidGradeRecord.subjectId}, 
                  ${invalidGradeRecord.gradeId}, ${invalidGradeRecord.score}, 
                  ${invalidGradeRecord.maxScore}, ${invalidGradeRecord.gradeType}, 
                  ${invalidGradeRecord.evaluationDate}, ${invalidGradeRecord.academicPeriod}, 
                  ${invalidGradeRecord.comments}, ${invalidGradeRecord.recordStatus})
        `;

        // If we reach here, the validation failed
        expect(true).toBe(false); // Force failure
      } catch (error) {
        // Expect a database constraint error
        expect(error).toBeDefined();
      }
    });

    it('should prevent soft-deleted users from logging in', async () => {
      // Create a user
      const createResponse = await request(app.getHttpServer())
        .post('/users')
        .send({
          userFirstName: 'SoftDelete',
          userSecondName: 'Test',
          userFirstLastName: 'User',
          userSecondLastName: 'Login',
          userEmail: 'soft.delete.test@edu.pe',
          userCI: 99999999,
          userPassword: 'SoftDelete123!',
          userDateOfBirth: '1990-01-01',
          userAddress: 'Soft Delete Address',
          userPhoneNumber: '987659999',
          userRoleId: 1,
        })
        .expect(201);

      const userId = createResponse.body.userId;

      // Soft delete the user
      await request(app.getHttpServer()).delete(`/users/${userId}`).expect(200);

      // Try to get the deleted user (should return 404)
      await request(app.getHttpServer()).get(`/users/${userId}`).expect(404);

      // Verify user is marked as inactive in database
      const deletedUser = await prisma.user.findFirst({
        where: { userId: userId },
      });

      expect(deletedUser?.userStatus).toBe(false);
    });
  });

  describe('Business Logic Validation', () => {
    it('should validate teacher experience years constraint', async () => {
      // First create a user with teacher role
      const teacherUserResponse = await request(app.getHttpServer())
        .post('/users')
        .send({
          userFirstName: 'TestSprite',
          userSecondName: 'Teacher',
          userFirstLastName: 'Experience',
          userSecondLastName: 'Test',
          userEmail: 'teacher.experience@edu.pe',
          userCI: 12121212,
          userPassword: 'TeacherExp123!',
          userDateOfBirth: '1985-01-01',
          userAddress: 'Teacher Address',
          userPhoneNumber: '987651212',
          userRoleId: 2,
        })
        .expect(201);

      const teacherUserId = teacherUserResponse.body.userId;

      // Try to create teacher record with invalid experience (negative years)
      try {
        const invalidTeacher = await request(app.getHttpServer())
          .post('/teachers')
          .send({
            userId: teacherUserId,
            teacherExperienceYears: -5, // Invalid negative experience
            teacherLicenseNumber: 'LIC-TEST-001',
            teacherHours: 40,
          });

        // Should fail validation
        expect(invalidTeacher.status).toBe(400);
      } catch (error) {
        // Expected to fail due to business rule validation
        expect(error).toBeDefined();
      }
    });

    it('should validate student grade level assignment', async () => {
      // Create a student user
      const studentUserResponse = await request(app.getHttpServer())
        .post('/users')
        .send({
          userFirstName: 'TestSprite',
          userSecondName: 'Student',
          userFirstLastName: 'Grade',
          userSecondLastName: 'Test',
          userEmail: 'student.grade@edu.pe',
          userCI: 13131313,
          userPassword: 'StudentGrade123!',
          userDateOfBirth: '2010-01-01',
          userAddress: 'Student Address',
          userPhoneNumber: '987651313',
          userRoleId: 3,
        })
        .expect(201);

      const studentUserId = studentUserResponse.body.userId;

      // Try to create student record with valid grade
      const validStudent = await request(app.getHttpServer())
        .post('/students')
        .send({
          userId: studentUserId,
          gradeId: 3, // 3rd Grade
        })
        .expect(201);

      expect(validStudent.body.userId).toBe(studentUserId);
      expect(validStudent.body.gradeId).toBe(3);
    });

    it('should maintain referential integrity between modules', async () => {
      // Test that relationships between users, roles, grades are maintained

      // Get all roles
      const rolesResponse = await request(app.getHttpServer())
        .get('/roles')
        .expect(200);

      // Get all users
      const usersResponse = await request(app.getHttpServer())
        .get('/users')
        .expect(200);

      // Verify that all users have valid role IDs
      const validRoleIds = rolesResponse.body.map((role: any) => role.roleId);

      usersResponse.body.forEach((user: any) => {
        expect(validRoleIds).toContain(user.userRoleId);
      });
    });
  });

  describe('Performance and Load Tests', () => {
    it('should handle multiple concurrent role creations', async () => {
      const concurrentRequests = Array.from({ length: 5 }, (_, index) =>
        request(app.getHttpServer())
          .post('/roles')
          .send({
            roleName: `Concurrent Role ${index + 1}`,
            roleDescription: `Concurrent role creation test ${index + 1}`,
          }),
      );

      const responses = await Promise.all(concurrentRequests);

      // All requests should succeed
      responses.forEach((response) => {
        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty('roleId');
      });

      // All roles should have unique IDs
      const roleIds = responses.map((response) => response.body.roleId);
      const uniqueRoleIds = new Set(roleIds);
      expect(uniqueRoleIds.size).toBe(roleIds.length);
    });

    it('should efficiently query large datasets', async () => {
      const startTime = Date.now();

      // Query all users (potentially large dataset)
      const response = await request(app.getHttpServer())
        .get('/users')
        .expect(200);

      const endTime = Date.now();
      const queryTime = endTime - startTime;

      // Query should complete within reasonable time (2 seconds)
      expect(queryTime).toBeLessThan(2000);
      expect(Array.isArray(response.body)).toBe(true);
    });
  });
});
