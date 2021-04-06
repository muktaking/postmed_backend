import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ExamsModule } from "src/exams/exams.module";
import { ExamProfileRepository } from "src/exams/profie.repository";
import { QuestionRepository } from "src/questions/question.repository";
import { UsersModule } from "src/users/users.module";
import { PostexamsController } from "./postexams.controller";
import { PostexamsService } from "./postexams.service";

@Module({
  imports: [
    TypeOrmModule.forFeature([ExamProfileRepository, QuestionRepository]),
    ExamsModule,
    UsersModule,
  ],
  controllers: [PostexamsController],
  providers: [PostexamsService],
})
export class PostexamsModule {}
