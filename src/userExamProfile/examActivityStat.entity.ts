import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Timestamp,
} from 'typeorm';
import { QuestionActivityStat } from './questionActivityStat.entity';
import { UserExamExamProfile } from './userExamExamProfile.entity';

@Entity()
export class ExamActivityStat extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'float', default: 0 })
  totalScore: number;

  @Column({ type: 'float', default: 0 })
  totalWrongScore: number;

  @Column({ type: 'float', default: 0 })
  totalPenaltyScore: number;

  @Column({ type: 'integer', default: 0 })
  totalRightStems: number;

  @Column({ type: 'integer', default: 0 })
  totalWrongStems: number;

  @Column({ type: 'integer', default: 0 })
  totalRightSbaQuestions: number;

  @Column({ type: 'integer', default: 0 })
  totalWrongSbaQuestions: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  attemptTime: Timestamp | string;

  @OneToMany(
    () => QuestionActivityStat,
    (questionActivityStat) => questionActivityStat.examActivityStat,
    { cascade: true, eager: true }
  )
  questionActivityStat: QuestionActivityStat[];

  @ManyToOne(
    () => UserExamExamProfile,
    (userExamExamProfile) => userExamExamProfile.examActivityStat,
    { onUpdate: 'CASCADE', onDelete: 'CASCADE' }
  )
  userExamExamProfile: UserExamExamProfile;
}
