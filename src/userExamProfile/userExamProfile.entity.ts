import { BaseEntity, Entity, OneToMany, PrimaryColumn } from 'typeorm';
import { UserExamCourseProfile } from './userExamCourseProfile.entity';

export interface UserExamProfileData {
  courseId: string;
  examId: string;
  score: number;
}

@Entity()
export class UserExamProfile extends BaseEntity {
  @PrimaryColumn()
  id: number;

  @OneToMany(
    () => UserExamCourseProfile,
    (userExamCourseProfile) => userExamCourseProfile.userExamProfile,
    { cascade: true, eager: true }
  )
  courses: UserExamCourseProfile[];
}
