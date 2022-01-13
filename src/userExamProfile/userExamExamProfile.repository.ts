import { EntityRepository, Repository } from 'typeorm';
import { UserExamExamProfile } from './userExamExamProfile.entity';

@EntityRepository(UserExamExamProfile)
export class UserExamExamProfileRepository extends Repository<
  UserExamExamProfile
> {}
