import { Module } from '@nestjs/common';
import { StudentTeacherSubjectsService } from './student-teacher-subjects.service';
import { StudentTeacherSubjectsController } from './student-teacher-subjects.controller';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [StudentTeacherSubjectsController],
  providers: [StudentTeacherSubjectsService],
  exports: [StudentTeacherSubjectsService],
})
export class StudentTeacherSubjectsModule {}