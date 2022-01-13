import { EntityRepository, Repository } from 'typeorm';
import { CourseBasedProfile } from './courseBasedProfile.entity';

@EntityRepository(CourseBasedProfile)
export class CourseBasedProfileRepository extends Repository<
  CourseBasedProfile
> {}
