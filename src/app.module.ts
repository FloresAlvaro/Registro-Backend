import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RoleModule } from './common/role/role.module';
import { RolesModule } from './common/roles/roles.module';
import { GradesModule } from './common/grades/grades.module';
import { SubjectsModule } from './common/subjects/subjects.module';

@Module({
  imports: [RoleModule, RolesModule, GradesModule, SubjectsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
