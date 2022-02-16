import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MulterModule } from '@nestjs/platform-express';
import { ServeStaticModule } from '@nestjs/serve-static';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';
import { AuthModule } from './auth/auth.module';
import { CategoriesModule } from './categories/categories.module';
import { CoursesController } from './courses/courses.controller';
import { CoursesModule } from './courses/courses.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { ExamsModule } from './exams/exams.module';
import { PostexamsModule } from './postexams/postexams.module';
import { QuestionsModule } from './questions/questions.module';
import { RoutineModule } from './routine/routine.module';
import { typeOrmConfig } from './typeormconfig/typeorm.config';
import { UserExamProfileModule } from './userExamProfile/userExamProfile.module';
import { UsersModule } from './users/users.module';
import { PaymentModule } from './payment/payment.module';
import { NotificationModule } from './notification/notification.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    //TasksModule,
    TypeOrmModule.forRoot(typeOrmConfig),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'),
    }),
    MulterModule.register({
      dest: './uploads',
    }),
    AuthModule,
    UsersModule,
    CategoriesModule,
    QuestionsModule,
    ExamsModule,
    PostexamsModule,
    DashboardModule,
    RoutineModule,
    CoursesModule,
    UserExamProfileModule,
    PaymentModule,
    NotificationModule,
  ],
  controllers: [CoursesController],
  //controllers: [DashboardController]
})
export class AppModule {}
