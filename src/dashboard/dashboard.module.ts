import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoryRepository } from 'src/categories/category.repository';
import { CoursesModule } from 'src/courses/courses.module';
import { ExamRepository } from 'src/exams/exam.repository';
import { ExamsModule } from 'src/exams/exams.module';
import { UserExamProfileModule } from 'src/userExamProfile/userExamProfile.module';
import { UserExamProfileRepository } from 'src/userExamProfile/userExamProfile.repository';
import { UsersModule } from 'src/users/users.module';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';

@Module({
  controllers: [DashboardController],
  providers: [DashboardService],
  imports: [
    TypeOrmModule.forFeature([
      ExamRepository,
      CategoryRepository,
      UserExamProfileRepository,
    ]),
    ExamsModule,
    UsersModule,
    CoursesModule,
    UserExamProfileModule,
  ],
})
export class DashboardModule {}
