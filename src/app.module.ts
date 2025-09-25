import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { RolesModule } from './common/roles/roles.module';
import { GradesModule } from './common/grades/grades.module';
import { SubjectsModule } from './common/subjects/subjects.module';
import { UsersModule } from './common/users/users.module';
import { StudentsModule } from './common/students/students.module';
import { TeachersModule } from './common/teachers/teachers.module';
import { GradeRecordsModule } from './common/grade-records/grade-records.module';
import { TeacherGradesModule } from './common/teacher-grades/teacher-grades.module';
import { GradeSubjectsModule } from './common/grade-subjects/grade-subjects.module';
import { TeacherSubjectsModule } from './common/teacher-subjects/teacher-subjects.module';
import { StudentTeacherSubjectsModule } from './common/student-teacher-subjects/student-teacher-subjects.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    RolesModule,
    GradesModule,
    SubjectsModule,
    UsersModule,
    StudentsModule,
    TeachersModule,
    GradeRecordsModule,
    TeacherGradesModule,
    GradeSubjectsModule,
    TeacherSubjectsModule,
    StudentTeacherSubjectsModule,
  ],
})
export class AppModule {}
