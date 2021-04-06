import { Category } from "src/categories/category.entity";
import {
  BaseEntity,
  BeforeInsert,
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
  Timestamp,
} from "typeorm";

export enum ExamType {
  Assignment = 0,
  Weekly = 1,
  Monthly = 2,
  Assesment = 3,
  Term = 4,
  Test = 5,
  Final = 6,
}

export enum answerStatus {
  True = 1,
  False = 0,
  NotAnswered = -1,
}

@Entity()
export class Exam extends BaseEntity {
  @BeforeInsert()
  singleStemMarkCalculator() {
    this.singleStemMark = +(
      this.singleQuestionMark / this.questionStemLength
    ).toFixed(2);
  }

  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "varchar", length: 200, nullable: false })
  title: string;

  @Column({ type: "enum", enum: ExamType })
  type: ExamType;

  @Column({ type: "simple-array" })
  categoryIds: string[];

  @ManyToMany(() => Category, { onUpdate: "CASCADE", onDelete: "CASCADE" })
  @JoinTable()
  categoryType: any;

  @Column({ type: "varchar", length: 255, nullable: false })
  description: string;

  @Column({ type: "simple-array" })
  questions: number[];

  @Column({ default: 1 })
  singleQuestionMark: number;

  @Column({ default: 5 })
  questionStemLength: number;

  @Column({ type: "float" })
  singleStemMark: number;

  @Column({ type: "float", default: 0 })
  penaltyMark: number;

  @Column({ default: 40 })
  timeLimit: number;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  createdAt: Timestamp | string;

  @Column()
  creatorId: number;
}
