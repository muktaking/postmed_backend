import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  PrimaryGeneratedColumn,
  Timestamp,
} from "typeorm";
import { Stem } from "./stem.entity";

export enum QType {
  singleBestAnswer = "sba",
  Matrix = "matrix",
}
// export enum QTypeNumber {
//   singleBestAnswer = 0,
//   Matrix = 1,
// }

// export interface Stem {
//   qStem: string;
//   aStem: string;
//   fbStem?: string;
// }

@Entity()
export class Question extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "varchar", length: 200, nullable: false })
  title: string;

  @Column()
  categoryId: number;

  @Column({ type: "enum", enum: QType, nullable: false })
  qType: QType;

  @Column({ type: "text" })
  qText: string;

  @OneToMany(
    () => Stem,
    (stem) => stem.question,
    { cascade: true, eager: true }
  )
  @JoinColumn({ name: "stems" })
  stems: Stem[];

  @Column({ type: "text", nullable: true })
  generalFeedback: string;

  @Column({ nullable: true })
  tags: string;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  createDate: Timestamp;

  @Column({ type: "timestamp" })
  modifiedDate: Timestamp | string;

  @Column()
  creatorId: number;

  @Column({ nullable: true })
  modifiedById: number;
}
