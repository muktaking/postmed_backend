import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CoursesModule } from 'src/courses/courses.module';
import { CourseBasedExamProfile } from 'src/exams/courseBasedExamProfile.entity';
import { CourseBasedExamProfileRepository } from 'src/exams/courseBasedExamProfile.repository';
import { CourseBasedProfile } from 'src/exams/courseBasedProfile.entity';
import { CoursesProfile } from 'src/exams/coursesProfile.entity';
import { ExamsModule } from 'src/exams/exams.module';
import { ExamProfileRepository } from 'src/exams/profie.repository';
import { QuestionRepository } from 'src/questions/question.repository';
import { UserExamProfileModule } from 'src/userExamProfile/userExamProfile.module';
import { UsersModule } from 'src/users/users.module';
import { PostexamsController } from './postexams.controller';
import { PostexamsService } from './postexams.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ExamProfileRepository,
      QuestionRepository,
      CoursesProfile,
      CourseBasedProfile,
      CourseBasedExamProfile,
      CourseBasedExamProfileRepository,
    ]),
    ExamsModule,
    UsersModule,
    CoursesModule,
    UserExamProfileModule,
  ],
  controllers: [PostexamsController],
  providers: [PostexamsService],
})
export class PostexamsModule {}
