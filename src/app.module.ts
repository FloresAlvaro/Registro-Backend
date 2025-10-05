import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from '@prisma';

// Domain modules using path mappings
import {
  RolesModule,
  UsersModule,
  StudentsModule,
  TeachersModule,
} from '@users';

import {
  GradesModule,
  SubjectsModule,
  GradeRecordsModule,
  GradeSubjectsModule,
} from '@academic';

import {
  TeacherGradesModule,
  TeacherSubjectsModule,
  StudentTeacherSubjectsModule,
} from '@relationships';

// Configuration
import { appConfig } from '@config/app.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig],
    }),
    PrismaModule,
    // Users Domain
    RolesModule,
    UsersModule,
    StudentsModule,
    TeachersModule,
    // Academic Domain
    GradesModule,
    SubjectsModule,
    GradeRecordsModule,
    GradeSubjectsModule,
    // Relationships Domain
    TeacherGradesModule,
    TeacherSubjectsModule,
    StudentTeacherSubjectsModule,
  ],
})
export class AppModule {}
