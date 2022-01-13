import { EntityRepository, Repository } from 'typeorm';
import { UserExamProfile } from './userExamProfile.entity';

@EntityRepository(UserExamProfile)
export class UserExamProfileRepository extends Repository<UserExamProfile> {}
