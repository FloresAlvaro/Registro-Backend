import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { RolesModule } from './common/roles/roles.module';
import { GradesModule } from './common/grades/grades.module';
import { SubjectsModule } from './common/subjects/subjects.module';
import { UsersModule } from './common/users/users.module';
import { StudentsModule } from './common/students/students.module';
import { TeachersModule } from './common/teachers/teachers.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  // Swagger configuration
  const config = new DocumentBuilder()
    .setTitle('Report Card API')
    .setDescription(
      'API for managing users, students, teachers, grades, roles, and subjects in a report card system',
    )
    .setVersion('1.0')
    .addTag('Roles', 'Role management')
    .addTag('Grades', 'Grade management')
    .addTag('Subjects', 'Subject management')
    .addTag('Users', 'User management')
    .addTag('Students', 'Student management')
    .addTag('Teachers', 'Teacher management')
    .build();

  const document = SwaggerModule.createDocument(app, config, {
    include: [
      RolesModule,
      GradesModule,
      SubjectsModule,
      UsersModule,
      StudentsModule,
      TeachersModule,
    ],
  });
  SwaggerModule.setup('api', app, document);

  await app.listen(process.env.PORT ?? 3000);
  console.log(
    `Application is running on: http://localhost:${process.env.PORT ?? 3000}`,
  );
  console.log(
    `Swagger documentation available at: http://localhost:${process.env.PORT ?? 3000}/api`,
  );
}
bootstrap().catch((err) => console.error('Error starting application:', err));
