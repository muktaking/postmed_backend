import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Question } from "./question.entity";

@Entity()
export class Stem extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "text", nullable: false })
  qStem: string;

  @Column({ type: "varchar", length: 1, nullable: true })
  aStem: string;

  @Column({ type: "text", nullable: true })
  fbStem?: string;

  @ManyToOne(
    () => Question,
    (question) => question.stems,
    {
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    }
  )
  question: Question;
}
