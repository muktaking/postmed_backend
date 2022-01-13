import {
  Injectable,
  InternalServerErrorException,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from 'src/roles.decorator';
import { RolePermitted } from 'src/users/user.entity';
import { to } from 'src/utils/utils';
import { MoreThanOrEqual } from 'typeorm';
import { Routine } from './routine.entity';
import { RoutineRepository } from './routine.repository';

@Injectable()
export class RoutineService {
  constructor(
    @InjectRepository(RoutineRepository)
    private routineRepository: RoutineRepository
  ) {}

  async getRoutine() {
    const [err, routine] = await to(
      this.routineRepository.find({
        where: {
          endDate: MoreThanOrEqual(new Date()),
        },
      })
    );
    if (err) {
      console.log(err);
      throw new InternalServerErrorException();
    }

    return routine;
  }

  async getRoutineByCourseId(id) {
    const [err, routine] = await to(
      this.routineRepository.find({
        where: {
          courseId: +id,
          //endDate: MoreThanOrEqual(new Date()),
        },
      })
    );
    if (err) {
      console.log(err);
      throw new InternalServerErrorException();
    }

    return routine.reverse();
  }

  @UseGuards(AuthGuard('jwt'))
  @Role(RolePermitted.admin)
  async getRawRoutine() {
    const [err, routine] = await to(this.routineRepository.find());
    if (err) {
      console.log(err);
      throw new InternalServerErrorException();
    }

    return routine;
  }

  @UseGuards(AuthGuard('jwt'))
  @Role(RolePermitted.admin)
  async getSyllabusById(id) {
    const [err, syllabus] = await to(this.routineRepository.findOne(+id));
    if (err) {
      console.log(err);
      throw new InternalServerErrorException();
    }

    return syllabus;
  }

  @UseGuards(AuthGuard('jwt'))
  @Role(RolePermitted.admin)
  async addASyllabus(addASyllabusDto) {
    const { startDate, endDate, syllabus, courseId } = addASyllabusDto;

    const routine = new Routine();
    routine.startDate = startDate;
    routine.endDate = endDate;
    routine.syllabus = syllabus;
    routine.courseId = courseId;

    const [err, result] = await to(routine.save());
    if (err) {
      console.log(err);
      throw new InternalServerErrorException();
    }

    return { message: 'Syllabus added successfully' };
  }

  @UseGuards(AuthGuard('jwt'))
  @Role(RolePermitted.admin)
  async editASyllabus(addASyllabusDto) {
    const { id, startDate, endDate, syllabus, courseId } = addASyllabusDto;

    const [error, routine] = await to(this.routineRepository.findOne(+id));
    if (error) {
      console.log(error);
      throw new InternalServerErrorException();
    }

    routine.startDate = startDate;
    routine.endDate = endDate;
    routine.syllabus = syllabus;
    routine.courseId = courseId;

    const [err, result] = await to(routine.save());
    if (err) {
      console.log(err);
      throw new InternalServerErrorException();
    }

    return { message: 'Syllabus edited successfully' };
  }

  @UseGuards(AuthGuard('jwt'))
  @Role(RolePermitted.admin)
  async deleteASyllabus(id) {
    const [err, result] = await to(this.routineRepository.delete(+id));
    if (err) {
      console.log(err);
      throw new InternalServerErrorException();
    }
    return { message: 'Syllabus deleted successfully' };
  }
}
