import { EntityRepository, Repository } from 'typeorm';
import { CourseBasedExamProfile } from './courseBasedExamProfile.entity';

@EntityRepository(CourseBasedExamProfile)
export class CourseBasedExamProfileRepository extends Repository<
  CourseBasedExamProfile
> {}
