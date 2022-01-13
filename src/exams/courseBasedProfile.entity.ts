import { BaseEntity, Entity, OneToMany, PrimaryColumn } from 'typeorm';
import { CoursesProfile } from './coursesProfile.entity';
import { ExamType } from './exam.entity';

export interface ExamStatByCourseBasedProfile {
  id: string;
  title: string;
  type: ExamType;
  attemptNumbers: number;
  score: number[];
  totalMark: number;
  firstAttemptTime: number;
  lastAttemptTime: number;
}

@Entity()
export class CourseBasedProfile extends BaseEntity {
  @PrimaryColumn()
  id: number;

  @OneToMany(
    () => CoursesProfile,
    (coursesProfile) => coursesProfile.profile
  )
  courses: CoursesProfile[];
}
