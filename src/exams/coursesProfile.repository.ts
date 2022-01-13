import { EntityRepository, Repository } from 'typeorm';
import { CoursesProfile } from './coursesProfile.entity';

@EntityRepository(CoursesProfile)
export class CoursesProfileRepository extends Repository<CoursesProfile> {}
