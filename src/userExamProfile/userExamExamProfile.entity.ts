import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Timestamp,
} from 'typeorm';
import { ExamType } from '../exams/exam.entity';
import { ExamActivityStat } from './examActivityStat.entity';
import { UserExamCourseProfile } from './userExamCourseProfile.entity';

export interface ExamStat {
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
export class UserExamExamProfile extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  examId: number;

  @Column()
  examTitle: string;

  @Column({ type: 'enum', enum: ExamType })
  examType: ExamType;

  @Column({ default: 1 })
  attemptNumbers: number;

  @Column({ type: 'simple-array', default: 0 })
  score: number[];

  @Column({ type: 'float', default: 0 })
  totalMark: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  firstAttemptTime: Timestamp;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  lastAttemptTime: Timestamp | string;

  @ManyToOne(
    () => UserExamCourseProfile,
    (userExamcourseProfile) => userExamcourseProfile.exams
  )
  course: UserExamCourseProfile;

  @OneToMany(
    () => ExamActivityStat,
    (examActivityStat) => examActivityStat.userExamExamProfile,
    { cascade: true }
  )
  examActivityStat: ExamActivityStat[];
}
