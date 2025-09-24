import { Module } from '@nestjs/common';
import { GradeRecordsService } from './grade-records.service';
import { GradeRecordsController } from './grade-records.controller';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [GradeRecordsController],
  providers: [GradeRecordsService],
  exports: [GradeRecordsService],
})
export class GradeRecordsModule {}