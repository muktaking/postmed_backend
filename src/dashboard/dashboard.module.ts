import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CategoryRepository } from "src/categories/category.repository";
import { ExamRepository } from "src/exams/exam.repository";
import { ExamsModule } from "src/exams/exams.module";
import { UsersModule } from "src/users/users.module";
import { DashboardController } from "./dashboard.controller";
import { DashboardService } from "./dashboard.service";

@Module({
  controllers: [DashboardController],
  providers: [DashboardService],
  imports: [
    TypeOrmModule.forFeature([ExamRepository, CategoryRepository]),
    ExamsModule,
    UsersModule,
  ],
})
export class DashboardModule {}
