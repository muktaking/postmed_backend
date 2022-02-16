import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Role } from 'src/roles.decorator';
import { RolePermitted } from 'src/users/user.entity';
import { AddASyllabusDto } from './addASyllabus.dto';
import { RoutineService } from './routine.service';

@Controller('routine')
export class RoutineController {
  constructor(private readonly routineService: RoutineService) {}
  @Get()
  async getRoutine() {
    return await this.routineService.getRoutine();
  }

  @Get('/course/:id')
  async getRoutineByCourseId(@Param('id') id) {
    return await this.routineService.getRoutineByCourseId(id);
  }

  @Get('/raw')
  async getRawRoutine() {
    return await this.routineService.getRawRoutine();
  }

  @Get('/:id')
  async getSyllabusById(@Param('id') id) {
    return await this.routineService.getSyllabusById(id);
  }

  @Post()
  @UseGuards(AuthGuard('jwt'))
  @Role(RolePermitted.moderator)
  async addASyllabus(@Body() addASyllabus: AddASyllabusDto) {
    return await this.routineService.addASyllabus(addASyllabus);
  }

  @Put()
  @UseGuards(AuthGuard('jwt'))
  @Role(RolePermitted.moderator)
  async editASyllabus(@Body() addASyllabus: AddASyllabusDto) {
    return await this.routineService.editASyllabus(addASyllabus);
  }

  @Delete('/:id')
  @UseGuards(AuthGuard('jwt'))
  @Role(RolePermitted.moderator)
  async deleteASyllabus(@Param('id') id) {
    return await this.routineService.deleteASyllabus(id);
  }
}
