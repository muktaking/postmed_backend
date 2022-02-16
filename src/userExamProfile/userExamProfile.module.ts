import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExamActivityStatRepository } from './examActivityStat.repository';
import { QuestionActivityStatRepository } from './questionActivityStat.repository';
import { StemActivityStatRepository } from './stemActivityStat.repository';
import { UserExamCourseProfileRepository } from './userExamCourseProfile.repository';
import { UserExamExamProfileRepository } from './userExamExamProfile.repository';
import { UserExamProfileController } from './userExamProfile.controller';
import { UserExamProfileRepository } from './userExamProfile.repository';
import { UserExamProfileService } from './userExamprofile.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UserExamProfileRepository,
      UserExamCourseProfileRepository,
      UserExamExamProfileRepository,
      ExamActivityStatRepository,
      QuestionActivityStatRepository,
      StemActivityStatRepository,
    ]),
  ],
  controllers: [UserExamProfileController],
  providers: [UserExamProfileService],
  exports: [UserExamProfileService],
})
export class UserExamProfileModule {}
