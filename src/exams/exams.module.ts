import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CategoriesModule } from "src/categories/categories.module";
import { CategoryRepository } from "src/categories/category.repository";
import { QuestionRepository } from "src/questions/question.repository";
import { UsersModule } from "src/users/users.module";
import { ExamRepository } from "./exam.repository";
import { ExamsController } from "./exams.controller";
import { ExamsService } from "./exams.service";
import { ExamProfileRepository } from "./profie.repository";

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ExamRepository,
      CategoryRepository,
      QuestionRepository,
      ExamProfileRepository,
    ]),
    CategoriesModule,
    UsersModule,
  ],
  controllers: [ExamsController],
  providers: [ExamsService],
  exports: [ExamsService],
})
export class ExamsModule {}
