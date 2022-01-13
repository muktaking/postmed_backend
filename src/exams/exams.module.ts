import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoriesModule } from 'src/categories/categories.module';
import { CategoryRepository } from 'src/categories/category.repository';
import { CourseRepository } from 'src/courses/course.repository';
import { CoursesModule } from 'src/courses/courses.module';
import { QuestionRepository } from 'src/questions/question.repository';
import { UserExamCourseProfileRepository } from 'src/userExamProfile/userExamCourseProfile.repository';
import { UserExamProfileRepository } from 'src/userExamProfile/userExamProfile.repository';
import { UsersModule } from 'src/users/users.module';
import { CourseBasedExamProfile } from './courseBasedExamProfile.entity';
import { CourseBasedProfile } from './courseBasedProfile.entity';
import { CoursesProfile } from './coursesProfile.entity';
import { ExamRepository } from './exam.repository';
import { ExamsController } from './exams.controller';
import { ExamsService } from './exams.service';
import { FeedbackRepository } from './feedback.repository';
import { ExamProfileRepository } from './profie.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ExamRepository,
      CourseRepository,
      CategoryRepository,
      QuestionRepository,
      ExamProfileRepository,
      FeedbackRepository,
      CoursesProfile,
      CourseBasedProfile,
      CourseBasedExamProfile,
      UserExamProfileRepository,
      UserExamCourseProfileRepository,
    ]),
    CoursesModule,
    CategoriesModule,
    UsersModule,
  ],
  controllers: [ExamsController],
  providers: [ExamsService],
  exports: [ExamsService],
})
export class ExamsModule {}
