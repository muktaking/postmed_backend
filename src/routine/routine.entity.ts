import {
  BaseEntity,
  Column,
  Entity,
  PrimaryGeneratedColumn,
  Timestamp,
} from 'typeorm';

@Entity()
export class Routine extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text' })
  syllabus: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  startDate: Timestamp;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  endDate: Timestamp;

  @Column()
  courseId: number;
}
