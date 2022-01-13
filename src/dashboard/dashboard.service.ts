import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CategoryRepository } from 'src/categories/category.repository';
import { CoursesService } from 'src/courses/courses.service';
import { ExamRepository } from 'src/exams/exam.repository';
import { ExamsService } from 'src/exams/exams.service';
import { UserExamProfileRepository } from 'src/userExamProfile/userExamProfile.repository';
import { RolePermitted } from 'src/users/user.entity';
import { UsersService } from 'src/users/users.service';
import { to } from 'src/utils/utils';

@Injectable()
export class DashboardService {
  constructor(
    private usersService: UsersService,
    @InjectRepository(CategoryRepository)
    private categoryRepository: CategoryRepository,
    @InjectRepository(ExamRepository)
    private examRepository: ExamRepository,
    @InjectRepository(UserExamProfileRepository)
    private userExamProfileRepository: UserExamProfileRepository,
    private readonly examService: ExamsService,
    private readonly courseService: CoursesService
  ) {
    this.featuredCategoryId = this.getFeaturedCategoryId();
  }

  private featuredCategoryId;

  async getFeaturedCategoryId() {
    const [err, category] = await to(
      this.categoryRepository.findOne({ name: 'Featured' })
    );
    if (err) throw new InternalServerErrorException();
    return category ? category.id : null;
  }

  async getStudentDashInfo(id) {
    const userDashExamInfo = [];

    const [error, enrolledCourses] = await to(
      this.courseService.findAllCoursesEnrolledByStudent(id)
    );
    if (error)
      throw new InternalServerErrorException(
        'Can not get all enrolled courses'
      );

    if (enrolledCourses) {
      for (const course of enrolledCourses) {
        const [errorUserExamProfile, userExamProfile] = await to(
          this.userExamProfileRepository.findOne({
            where: { id: +id },
            relations: ['courses'],
          })
        );
        if (errorUserExamProfile)
          throw new InternalServerErrorException(errorUserExamProfile);

        if (userExamProfile) {
          const userExamCourseProfile =
            userExamProfile.courses &&
            userExamProfile.courses.filter((e) => e.courseId === +course.id);

          if (userExamCourseProfile.length > 0) {
            const [err, userExamInfo] = await to(
              this.examService.findUserExamInfo(id, course.id)
            );

            if (err)
              throw new InternalServerErrorException(
                'Can not get user exam info. ' + err
              );
            const [err1, userExamStat] = await to(
              this.examService.findUserExamStat(id, course.id)
            );
            if (err1)
              throw new InternalServerErrorException(
                'Can not get user exam stat' + err1
              );

            const [err2, featuredExams] = await to(
              this.examService.getFeaturedExams(course.id)
            );
            if (err2)
              throw new InternalServerErrorException(
                'Can not get featured exams' + err2
              );

            userDashExamInfo.push({
              id: course.id,
              title: course.title,
              userExamInfo,
              userExamStat,
              featuredExams,
            });
          }
        }
      }
    }

    return userDashExamInfo.reverse();
  }

  async getAdminDashInfo(userRole) {
    let users = [];
    let exams = [];
    let feedbacks = [];
    let expectedEnrolled = [];
    let err = undefined;
    [err, users] = await to(this.usersService.findAllUsers(userRole));

    [err, exams] = await to(this.examService.findAllRawExams());

    if (userRole >= RolePermitted.mentor) {
      [err, feedbacks] = await to(this.examService.getPendingFeedback());
    }

    [err, expectedEnrolled] = await to(
      this.courseService.expectedEnrolledStuInfo()
    );

    return { users, exams, feedbacks, expectedEnrolled };
  }

  // async getFeaturedExams() {
  //   const [err, exams] = await to(
  //     this.examRepository.find({
  //       where: [
  //         {
  //           categoryIds: Like(
  //             '%,' + (await this.featuredCategoryId).toString() + ',%'
  //           ),
  //         },
  //         {
  //           categoryIds: Like(
  //             (await this.featuredCategoryId).toString() + ',%'
  //           ),
  //         },
  //         {
  //           categoryIds: Like(
  //             '%,' + (await this.featuredCategoryId).toString()
  //           ),
  //         },
  //       ],
  //       relations: ['categoryType'],
  //       order: { id: 'DESC' },
  //       take: 5,
  //     })
  //   );
  //   if (err) throw new InternalServerErrorException();

  //   return exams;
  //}
}
