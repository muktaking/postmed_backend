import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  Timestamp,
} from 'typeorm';
import { CoursesProfile } from './coursesProfile.entity';
import { ExamType } from './exam.entity';

function percentage(num, per) {
  return (num / 100) * per;
}

@Entity()
export class CourseBasedExamProfile extends BaseEntity {
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
  lastAttemptTime: Timestamp;

  @ManyToOne(
    () => CoursesProfile,
    (coursesProfile) => coursesProfile.exams
  )
  course: CoursesProfile;
}
