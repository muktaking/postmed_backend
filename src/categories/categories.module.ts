import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { QuestionRepository } from "src/questions/question.repository";
import { QuestionsModule } from "src/questions/questions.module";
import { CategoriesController } from "./categories.controller";
import { CategoriesService } from "./categories.service";
import { CategoryRepository } from "./category.repository";

@Module({
  imports: [
    TypeOrmModule.forFeature([CategoryRepository, QuestionRepository]),
    QuestionsModule,
  ],
  controllers: [CategoriesController],
  providers: [CategoriesService],
})
export class CategoriesModule {}
