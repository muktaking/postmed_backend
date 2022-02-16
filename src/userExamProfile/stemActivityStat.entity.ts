import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { QuestionActivityStat } from './questionActivityStat.entity';

@Entity()
export class StemActivityStat extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 1, nullable: true })
  aStem: string;

  @Column({ type: 'varchar', length: 1, nullable: true })
  aStemStatus: string;

  @ManyToOne(
    () => QuestionActivityStat,
    (questionActivityStat) => questionActivityStat.stemActivityStat,
    {
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    }
  )
  questionActivityStat: QuestionActivityStat;
}
