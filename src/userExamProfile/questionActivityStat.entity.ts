import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ExamActivityStat } from './examActivityStat.entity';
import { StemActivityStat } from './stemActivityStat.entity';

@Entity()
export class QuestionActivityStat extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  questionId: number;

  @Column({ type: 'float', default: 0 })
  score: number;

  @Column({ type: 'float', default: 0 })
  wrongScore: number;

  @Column({ type: 'float', default: 0 })
  penaltyScore: number;

  @Column({ type: 'integer', default: 0 })
  rightStems: number;

  @Column({ type: 'integer', default: 0 })
  wrongStems: number;

  @OneToMany(
    () => StemActivityStat,
    (stemActivityStat) => stemActivityStat.questionActivityStat,
    { cascade: true, eager: true }
  )
  stemActivityStat: StemActivityStat[];

  @ManyToOne(
    () => ExamActivityStat,
    (examActivityStat) => examActivityStat.questionActivityStat,
    { onUpdate: 'CASCADE', onDelete: 'CASCADE' }
  )
  examActivityStat: ExamActivityStat;
}
