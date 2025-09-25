import { Module } from '@nestjs/common';
import { GradeSubjectsService } from './grade-subjects.service';
import { GradeSubjectsController } from './grade-subjects.controller';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [GradeSubjectsController],
  providers: [GradeSubjectsService],
  exports: [GradeSubjectsService],
})
export class GradeSubjectsModule {}
