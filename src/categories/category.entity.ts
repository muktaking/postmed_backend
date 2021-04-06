import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Category extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "varchar", length: 25, nullable: false })
  name: string;

  @Column({ type: "varchar", unique: true, nullable: false })
  slug: string;

  @Column({ type: "varchar", length: 255, nullable: false })
  description: string;

  @Column({ type: "int", nullable: true, default: null })
  parentId: number;

  @Column({ type: "varchar", length: 255, nullable: false })
  imageUrl: string;

  @Column("int", { default: 1000 })
  order: number;

  // @ManyToOne(
  //   () => Exam,
  //   (exam) => exam.categoryType
  // )
  // exam: Exam;
}
