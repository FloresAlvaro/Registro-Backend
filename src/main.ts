import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { apiReference } from '@scalar/nestjs-api-reference';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS
  app.enableCors({
    origin: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  // Enable validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // Swagger configuration
  const config = new DocumentBuilder()
    .setTitle('Report Card API')
    .setDescription(
      'Comprehensive Academic Management System API for managing users, students, teachers, grades, roles, subjects and complex academic relationships in a report card system',
    )
    .setVersion('2.0')
    .addTag('Roles', 'System roles and permissions management')
    .addTag('Grades', 'Academic grade levels and classifications')
    .addTag('Subjects', 'Academic subjects and curriculum management')
    .addTag('Users', 'User accounts and profile management')
    .addTag('Students', 'Student enrollment and academic records')
    .addTag('Teachers', 'Teacher profiles and assignments')
    .addTag(
      'Grade Records',
      'Academic performance tracking, evaluations and statistics',
    )
    .addTag('Teacher Grades', 'Teacher assignments to specific grade levels')
    .addTag(
      'Grade Subjects',
      'Subject curriculum assignments for each grade level',
    )
    .addTag(
      'Teacher Subjects',
      'Teacher specializations and subject assignments',
    )
    .addTag(
      'Student Teacher Subjects',
      'Complex three-way enrollment management for student-teacher-subject relationships',
    )
    .addBearerAuth()
    .addServer('http://localhost:3000', 'Development server')
    .setContact(
      'Development Team',
      'https://github.com/FloresAlvaro/Registro-Backend',
      'contact@reportcard.com',
    )
    .setLicense('MIT', 'https://opensource.org/licenses/MIT')
    .build();

  // Create Swagger document
  const document = SwaggerModule.createDocument(app, config);

  // Setup Swagger UI
  SwaggerModule.setup('api', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
      displayRequestDuration: true,
      docExpansion: 'none',
      filter: true,
      showRequestHeaders: true,
      tryItOutEnabled: true,
    },
    customSiteTitle: 'Report Card API Documentation',
    customfavIcon: '/favicon.ico',
    customJs: [
      'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui-bundle.min.js',
      'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui-standalone-preset.min.js',
    ],
    customCssUrl: [
      'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui.min.css',
    ],
  });

  // Setup Scalar API Documentation (Modern alternative)
  app.use(
    '/docs',
    apiReference({
      spec: {
        content: document,
      },
      theme: 'fastify',
      layout: 'modern',
      showSidebar: true,
      searchHotKey: 'k',
      hideDownloadButton: false,
      hideTestRequestButton: false,
      metaData: {
        title: 'Report Card API - Scalar Documentation',
        description:
          'Beautiful, interactive API documentation for the Academic Management System',
        ogDescription:
          'Comprehensive Academic Management System API Documentation',
        ogImage: '/api-preview.png',
      },
      servers: [
        {
          url: 'http://localhost:3000',
          description: 'Development server',
        },
        {
          url: 'https://api.reportcard.com',
          description: 'Production server',
        },
      ],
      customCss: `
        .scalar-api-reference {
          --scalar-color-1: #ffffff;
          --scalar-color-2: #ffffff;
          --scalar-color-3: #ffffff;
        }
        .scalar-api-reference .scalar-card {
          border-radius: 8px;
        }
      `,
    }),
  );

  // Start the application
  const port = process.env.PORT || 3000;
  await app.listen(port);

  console.log('🚀 Report Card API Server Started');
  console.log(`📡 Application running on: http://localhost:${port}`);
  console.log(`📚 Swagger documentation: http://localhost:${port}/api`);
  console.log(`✨ Scalar documentation: http://localhost:${port}/docs`);
  console.log(`🔧 Environment: ${process.env.NODE_ENV || 'development'}`);
}

bootstrap().catch((err) => {
  console.error('❌ Error starting application:', err);
  process.exit(1);
});
