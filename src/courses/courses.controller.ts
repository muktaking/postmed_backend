import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { Role } from 'src/roles.decorator';
import { RolesGuard } from 'src/roles.guard';
import { RolePermitted } from 'src/users/user.entity';
import {
  editFileName,
  imageFileFilter,
  imageResizer,
} from 'src/utils/file-uploading.utils';
import { CoursesService } from './courses.service';
import { CreateCourseDto } from './dto/course.dto';

@Controller('courses')
export class CoursesController {
  constructor(private readonly courseService: CoursesService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Role(RolePermitted.coordinator)
  @UsePipes(ValidationPipe)
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './uploads/images/courses',
        filename: editFileName,
      }),
      fileFilter: imageFileFilter,
    })
  )
  async createCourse(
    @Body() createCourseDto: CreateCourseDto,
    @Req() req,
    @UploadedFile() image
  ) {
    let imagePath = null;

    if (image) {
      try {
        imagePath = await imageResizer(image, 'courses');
      } catch (error) {
        console.log(error.message);
      }
    }
    return await this.courseService.createCourse(
      createCourseDto,
      imagePath,
      req.user.id
    );
  }

  @Get()
  async getAllCourses() {
    return await this.courseService.findAllCourses();
  }

  @Get('/auth')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Role(RolePermitted.student)
  async getAllCoursesWithAuth(@Req() req) {
    return await this.courseService.findAllCourses(req.user);
  }

  @Get('/raw')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Role(RolePermitted.coordinator)
  async getAllRawCourses() {
    return await this.courseService.findAllRawCourses();
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
  @Role(RolePermitted.moderator)
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
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Role(RolePermitted.coordinator)
  @UsePipes(ValidationPipe)
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './uploads/images/courses',
        filename: editFileName,
      }),
      fileFilter: imageFileFilter,
    })
  )
  async updateCourseById(
    @Body() createCourseDto: CreateCourseDto,
    @UploadedFile() image,
    @Param('id') id
  ) {
    let imagePath = null;

    if (image) {
      try {
        imagePath = await imageResizer(image, 'courses');
      } catch (error) {
        console.log(error.message);
      }
    }
    return await this.courseService.updateCourseById(
      createCourseDto,
      id,
      imagePath
    );
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Role(RolePermitted.coordinator)
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
