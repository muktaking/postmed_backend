import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserExamExamProfile } from './userExamExamProfile.entity';
import { UserExamProfile } from './userExamProfile.entity';

function percentage(num, per) {
  return (num / 100) * per;
}

@Entity()
export class UserExamCourseProfile extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  courseId: number;

  @Column()
  courseTitle: string;

  @Column({ type: 'numeric', precision: 10, scale: 2 })
  totalScore: number;

  @Column()
  totalMark: number;

  @ManyToOne(
    () => UserExamProfile,
    (userExamProfile) => userExamProfile.courses
  )
  userExamProfile: UserExamProfile;

  @OneToMany(
    () => UserExamExamProfile,
    (userExamExamProfile) => userExamExamProfile.course,
    { cascade: true, eager: true }
  )
  exams: UserExamExamProfile[];
}
