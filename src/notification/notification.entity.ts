import {
  BaseEntity,
  Column,
  Entity,
  PrimaryGeneratedColumn,
  Timestamp,
} from 'typeorm';

export enum NotificationType {
  Promotional = 1,
  General = 2,
}

export enum PriorityType {
  Urgent = 1,
  Immediate = 2,
  Normal = 3,
}

@Entity()
export class Notification extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 200, nullable: false })
  title: string;

  @Column({ type: 'enum', enum: NotificationType })
  type: NotificationType;

  @Column({ type: 'enum', enum: PriorityType })
  priority: PriorityType;

  @Column({ nullable: true })
  courseId: number;

  @Column({ type: 'simple-array' })
  alreadySeenIds: string[];

  @Column({ type: 'varchar', length: 255, nullable: false })
  description: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Timestamp;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  startDate: Timestamp;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  endDate: Timestamp;

  @Column()
  creatorId: number;

  @Column({ nullable: true })
  modifiedBy: number;
}
