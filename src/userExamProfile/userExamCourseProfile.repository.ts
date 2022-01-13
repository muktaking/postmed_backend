import { EntityRepository, Repository } from 'typeorm';
import { UserExamCourseProfile } from './userExamCourseProfile.entity';

@EntityRepository(UserExamCourseProfile)
export class UserExamCourseProfileRepository extends Repository<
  UserExamCourseProfile
> {}
