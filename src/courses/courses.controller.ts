import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Role } from 'src/roles.decorator';
import { RolesGuard } from 'src/roles.guard';
import { RolePermitted } from 'src/users/user.entity';
import { CoursesService } from './courses.service';
import { CreateCourseDto } from './dto/course.dto';

@Controller('courses')
export class CoursesController {
  constructor(private readonly courseService: CoursesService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Role(RolePermitted.admin)
  @UsePipes(ValidationPipe)
  async createExam(@Body() createCourseDto: CreateCourseDto, @Req() req) {
    return await this.courseService.createCourse(createCourseDto, req.user.id);
  }

  @Get()
  async getAllCourses() {
    return await this.courseService.findAllCourses();
  }

  @Get('enrolled/courses')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Role(RolePermitted.student)
  async getAllCoursesEnrolledByStudent(@Req() req) {
    return await this.courseService.findAllCoursesEnrolledByStudent(
      req.user.id
    );
  }
  @Patch('enrolled')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Role(RolePermitted.admin)
  async approveEnrollment(@Body() course) {
    return await this.courseService.approveOrDenyEnrollment(
      course.id,
      course.stuIds,
      Boolean(course.deny)
    );
  }

  @Get(':id')
  async getCourseById(@Param('id') id) {
    return await this.courseService.findCourseById(id);
  }

  @Patch(':id')
  async updateCourseById(
    @Body() createCourseDto: CreateCourseDto,
    @Param('id') id
  ) {
    return await this.courseService.updateCourseById(createCourseDto, id);
  }

  @Delete(':id')
  async deleteCourseById(@Param('id') id) {
    return await this.courseService.deleteCourseById(id);
  }

  @Patch('enroll/:id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Role(RolePermitted.student)
  async enrollmentRequestedByStudent(@Param('id') courseId, @Req() req) {
    return await this.courseService.enrollmentRequestedByStudent(
      courseId,
      req.user.id
    );
  }
}
