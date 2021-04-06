import {
  BaseEntity,
  BeforeInsert,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  Timestamp,
} from "typeorm";
import { ExamType } from "./exam.entity";
import { Profile } from "./profile.entity";

function percentage(num, per) {
  return (num / 100) * per;
}

@Entity()
export class ExamProfile extends BaseEntity {
  @BeforeInsert()
  updateAvgScore(v) {
    if (!this.averageScore) return v;

    return +(
      (this.averageScore * (this.attemptNumbers - 1) +
        percentage(v, Math.floor(10 / (this.attemptNumbers - 1)))) /
      this.attemptNumbers
    ).toFixed(2);
  }
  // subcequent attempt will add very little number tp avg score (10/attempNumbers) % of attempt score
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  examId: number;

  @Column()
  examTitle: string;

  @Column({ type: "enum", enum: ExamType })
  examType: ExamType;

  @Column({ default: 1 })
  attemptNumbers: number;

  @Column({ type: "float", default: 0 })
  averageScore: number;

  @Column({ type: "float", default: 0 })
  totalMark: number;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  firstAttemptTime: Timestamp;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  lastAttemptTime: Timestamp;

  @ManyToOne(
    () => Profile,
    (profile) => profile.exams
  )
  profile: Profile;
}
