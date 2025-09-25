import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';

// Users Domain
import { RolesModule } from './modules/users/roles/roles.module';
import { UsersModule } from './modules/users/users/users.module';
import { StudentsModule } from './modules/users/students/students.module';
import { TeachersModule } from './modules/users/teachers/teachers.module';

// Academic Domain
import { GradesModule } from './modules/academic/grades/grades.module';
import { SubjectsModule } from './modules/academic/subjects/subjects.module';
import { GradeRecordsModule } from './modules/academic/grade-records/grade-records.module';
import { GradeSubjectsModule } from './modules/academic/grade-subjects/grade-subjects.module';

// Relationships Domain
import { TeacherGradesModule } from './modules/relationships/teacher-grades/teacher-grades.module';
import { TeacherSubjectsModule } from './modules/relationships/teacher-subjects/teacher-subjects.module';
import { StudentTeacherSubjectsModule } from './modules/relationships/student-teacher-subjects/student-teacher-subjects.module';

// Configuration
import { appConfig } from './config/app.config';

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
