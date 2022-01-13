import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
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
    ]),
  ],
  controllers: [UserExamProfileController],
  providers: [UserExamProfileService],
  exports: [UserExamProfileService],
})
export class UserExamProfileModule {}
