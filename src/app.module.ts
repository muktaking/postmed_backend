import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { MulterModule } from "@nestjs/platform-express";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AuthModule } from "./auth/auth.module";
import { CategoriesModule } from "./categories/categories.module";
import { DashboardModule } from "./dashboard/dashboard.module";
import { ExamsModule } from "./exams/exams.module";
import { PostexamsModule } from "./postexams/postexams.module";
import { QuestionsModule } from "./questions/questions.module";
import { typeOrmConfig } from "./typeormconfig/typeorm.config";
import { UsersModule } from "./users/users.module";

@Module({
  imports: [
    ConfigModule.forRoot(),
    //TasksModule,
    TypeOrmModule.forRoot(typeOrmConfig),
    MulterModule.register({
      dest: "./uploads",
    }),
    AuthModule,
    UsersModule,
    CategoriesModule,
    QuestionsModule,
    ExamsModule,
    PostexamsModule,
    DashboardModule,
  ],
  //controllers: [DashboardController]
})
export class AppModule {}
