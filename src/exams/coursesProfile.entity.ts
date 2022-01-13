import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { CourseBasedExamProfile } from './courseBasedExamProfile.entity';
import { CourseBasedProfile } from './courseBasedProfile.entity';

function percentage(num, per) {
  return (num / 100) * per;
}

@Entity()
export class CoursesProfile extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  courseId: number;

  @Column()
  courseTitle: string;

  @Column()
  totalScore: number;

  @Column()
  totalMark: number;

  @ManyToOne(
    () => CourseBasedProfile,
    (courseBasedProfile) => courseBasedProfile.courses
  )
  profile: CourseBasedProfile;

  @OneToMany(
    () => CourseBasedExamProfile,
    (courseBasedExamProfile) => courseBasedExamProfile.course
  )
  exams: CourseBasedExamProfile[];
}
