import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CoursesModule } from 'src/courses/courses.module';
import { ExamsModule } from 'src/exams/exams.module';
import { QuestionRepository } from 'src/questions/question.repository';
import { ExamActivityStatRepository } from 'src/userExamProfile/examActivityStat.repository';
import { QuestionActivityStatRepository } from 'src/userExamProfile/questionActivityStat.repository';
import { StemActivityStatRepository } from 'src/userExamProfile/stemActivityStat.repository';
import { UserExamProfileModule } from 'src/userExamProfile/userExamProfile.module';
import { UsersModule } from 'src/users/users.module';
import { PostexamsController } from './postexams.controller';
import { PostexamsService } from './postexams.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      QuestionRepository,
      ExamActivityStatRepository,
      QuestionActivityStatRepository,
      StemActivityStatRepository,
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
