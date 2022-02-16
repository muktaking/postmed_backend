import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class AccessRight extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'simple-array' })
  accessableCourseIds: number[];

  @Column()
  canCreateExam: boolean;
}

//AccessableCourseIds, canCreateExam,
