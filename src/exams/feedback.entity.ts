import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Exam } from './exam.entity';

export enum FeedbackStatus {
  belowAverage = 1,
  average = 2,
  good = 3,
  best = 4,
}

export enum Status {
  Pending = 'pending',
  Published = 'published',
}

@Entity()
export class Feedback extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 30, nullable: false })
  name: string;

  @Column({ type: 'varchar', nullable: false })
  email: string;

  @Column()
  examId: number;

  @ManyToOne(() => Exam)
  exam: Exam;

  @Column({
    type: 'enum',
    enum: Status,
    default: Status.Pending,
  })
  status: Status;

  @Column({ type: 'enum', enum: FeedbackStatus })
  feedbackStatus: FeedbackStatus;

  @Column({ type: 'varchar', length: 255, nullable: true })
  message: string;
}
