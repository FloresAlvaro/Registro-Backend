import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from '../src/app.module';

const request = require('supertest');

describe('Roles API - Educational System (TestSprite Generated)', () => {
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

  describe('POST /roles - Create Role', () => {
    it('should create a new administrator role', async () => {
      const createRoleDto = {
        roleName: 'TestSprite Admin',
        roleDescription: 'Administrator role created by TestSprite',
      };

      const response = await request(app.getHttpServer())
        .post('/roles')
        .send(createRoleDto)
        .expect(201);

      expect(response.body).toHaveProperty('roleId');
      expect(response.body.roleName).toBe(createRoleDto.roleName);
      expect(response.body.roleDescription).toBe(createRoleDto.roleDescription);
      expect(response.body.roleStatus).toBe(true);
    });

    it('should create a teacher role', async () => {
      const createRoleDto = {
        roleName: 'TestSprite Teacher',
        roleDescription: 'Teacher role with academic permissions',
      };

      const response = await request(app.getHttpServer())
        .post('/roles')
        .send(createRoleDto)
        .expect(201);

      expect(response.body).toHaveProperty('roleId');
      expect(response.body.roleName).toBe(createRoleDto.roleName);
      expect(response.body.roleStatus).toBe(true);
    });

    it('should validate required fields', async () => {
      const invalidDto = {
        roleDescription: 'Missing role name',
      };

      await request(app.getHttpServer())
        .post('/roles')
        .send(invalidDto)
        .expect(400);
    });
  });

  describe('GET /roles - List Roles', () => {
    it('should return all roles', async () => {
      const response = await request(app.getHttpServer())
        .get('/roles')
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);

      // Verify role structure
      if (response.body.length > 0) {
        const role = response.body[0];
        expect(role).toHaveProperty('roleId');
        expect(role).toHaveProperty('roleName');
        expect(role).toHaveProperty('roleDescription');
        expect(role).toHaveProperty('roleStatus');
      }
    });

    it('should filter active roles only', async () => {
      const response = await request(app.getHttpServer())
        .get('/roles?status=active')
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);

      // All returned roles should be active
      response.body.forEach((role: any) => {
        expect(role.roleStatus).toBe(true);
      });
    });
  });

  describe('GET /roles/:id - Get Role by ID', () => {
    it('should return specific role by ID', async () => {
      // First create a role to get its ID
      const createResponse = await request(app.getHttpServer())
        .post('/roles')
        .send({
          roleName: 'TestSprite Get Role',
          roleDescription: 'Role created for GET test',
        });

      const roleId = createResponse.body.roleId;

      const response = await request(app.getHttpServer())
        .get(`/roles/${roleId}`)
        .expect(200);

      expect(response.body.roleId).toBe(roleId);
      expect(response.body.roleName).toBe('TestSprite Get Role');
    });

    it('should return 404 for non-existent role', async () => {
      const nonExistentId = 99999;

      await request(app.getHttpServer())
        .get(`/roles/${nonExistentId}`)
        .expect(404);
    });
  });

  describe('PATCH /roles/:id - Update Role', () => {
    it('should update role successfully', async () => {
      // Create a role first
      const createResponse = await request(app.getHttpServer())
        .post('/roles')
        .send({
          roleName: 'TestSprite Update Role',
          roleDescription: 'Original description',
        });

      const roleId = createResponse.body.roleId;

      const updateDto = {
        roleName: 'Updated TestSprite Role',
        roleDescription: 'Updated by TestSprite automation',
      };

      const response = await request(app.getHttpServer())
        .patch(`/roles/${roleId}`)
        .send(updateDto)
        .expect(200);

      expect(response.body.roleId).toBe(roleId);
      expect(response.body.roleName).toBe(updateDto.roleName);
      expect(response.body.roleDescription).toBe(updateDto.roleDescription);
    });
  });

  describe('DELETE /roles/:id - Delete Role', () => {
    it('should soft delete role successfully', async () => {
      // Create a role first
      const createResponse = await request(app.getHttpServer())
        .post('/roles')
        .send({
          roleName: 'TestSprite Delete Role',
          roleDescription: 'This role will be deleted',
        });

      const roleId = createResponse.body.roleId;

      await request(app.getHttpServer()).delete(`/roles/${roleId}`).expect(200);

      // Verify role is soft deleted
      await request(app.getHttpServer()).get(`/roles/${roleId}`).expect(404);
    });
  });

  describe('Role Validation & Business Logic', () => {
    it('should create role with audit timestamps', async () => {
      const createRoleDto = {
        roleName: 'TestSprite Audit Role',
        roleDescription: 'Testing audit functionality',
      };

      const response = await request(app.getHttpServer())
        .post('/roles')
        .send(createRoleDto)
        .expect(201);

      expect(response.body).toHaveProperty('createdAt');
      expect(response.body).toHaveProperty('updatedAt');
      expect(new Date(response.body.createdAt)).toBeInstanceOf(Date);
    });

    it('should prevent duplicate role names', async () => {
      const duplicateDto = {
        roleName: 'TestSprite Duplicate',
        roleDescription: 'First role',
      };

      // Create first role
      await request(app.getHttpServer())
        .post('/roles')
        .send(duplicateDto)
        .expect(201);

      // Try to create duplicate
      await request(app.getHttpServer())
        .post('/roles')
        .send({
          roleName: 'TestSprite Duplicate',
          roleDescription: 'Duplicate role attempt',
        })
        .expect(400);
    });
  });
});
