import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { RolesModule } from './common/roles/roles.module';
import { GradesModule } from './common/grades/grades.module';
import { SubjectsModule } from './common/subjects/subjects.module';
import { UsersModule } from './common/users/users.module';
import { StudentsModule } from './common/students/students.module';
import { TeachersModule } from './common/teachers/teachers.module';

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
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
