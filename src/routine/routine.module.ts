import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoutineController } from './routine.controller';
import { RoutineRepository } from './routine.repository';
import { RoutineService } from './routine.service';

@Module({
  imports: [TypeOrmModule.forFeature([RoutineRepository])],
  controllers: [RoutineController],
  providers: [RoutineService],
})
export class RoutineModule {}
