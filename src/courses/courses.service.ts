import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from 'src/users/user.repository';
import { to } from 'src/utils/utils';
import { In, Like } from 'typeorm';
import { Course } from './course.entity';
import { CourseRepository } from './course.repository';
import { CreateCourseDto } from './dto/course.dto';

@Injectable()
export class CoursesService {
  constructor(
    @InjectRepository(CourseRepository)
    private courseRepository: CourseRepository,
    @InjectRepository(UserRepository)
    private userRepository: UserRepository
  ) {}

  async createCourse(createCourseDto, creator: string) {
    const { title, description, startDate, endDate } = createCourseDto;

    const course = new Course();

    course.title = title;
    course.description = description;
    course.startDate = startDate;
    course.endDate = endDate;
    course.creatorId = +creator;

    const [err, result] = await to(course.save());
    if (err) {
      throw new InternalServerErrorException();
    }
    return result;
  }

  async findAllCourses() {
    const [err, courses] = await to(this.courseRepository.find());
    if (err) throw new InternalServerErrorException();
    return courses;
  }

  async findAllCoursesEnrolledByStudent(stuId) {
    const [err, courses] = await to(
      this.courseRepository.find({
        where: [
          {
            enrolledStuIds: Like(stuId),
          },
          {
            enrolledStuIds: Like('%,' + stuId + ',%'),
          },
          {
            enrolledStuIds: Like(stuId + ',%'),
          },
          {
            enrolledStuIds: Like('%,' + stuId),
          },
        ],
      })
    );
    console.log(err);
    if (err) throw new InternalServerErrorException();
    return courses;
  }

  async findCourseById(id: string) {
    const [err, course] = await to(this.courseRepository.findOne({ id: +id }));
    if (err) throw new InternalServerErrorException();
    return course;
  }

  async updateCourseById(courseUpdated: CreateCourseDto, id: string) {
    const { title, description, startDate, endDate } = courseUpdated;

    const [err, course] = await to(this.courseRepository.findOne({ id: +id }));
    if (err) throw new InternalServerErrorException();

    course.title = title;
    course.description = description;
    course.startDate = startDate;
    course.endDate = endDate;

    const [err1, result] = await to(course.save());
    if (err1) throw new InternalServerErrorException();

    return result;
  }

  async deleteCourseById(id: string) {
    const [err, result] = await to(this.courseRepository.delete({ id: +id }));
    if (err) throw new InternalServerErrorException();

    return result;
  }

  async enrollmentRequestedByStudent(courseId: string, stuId: string) {
    const course = await this.findCourseById(courseId);

    if (course) {
      if (
        course.enrolledStuIds &&
        course.enrolledStuIds.includes(stuId.toString())
      ) {
        return {
          message: 'You have already enrolled. Please enjoy the exam.',
        };
      }
      if (
        course.expectedEnrolledStuIds &&
        course.expectedEnrolledStuIds.includes(stuId.toString())
      ) {
        return {
          message:
            'You have already requested for enrollment. Please wait for the admin approval.',
        };
      } else
        course.expectedEnrolledStuIds
          ? course.expectedEnrolledStuIds.push(+stuId)
          : (course.expectedEnrolledStuIds = [+stuId]);
    }

    const [err, result] = await to(course.save());
    if (err) throw new InternalServerErrorException();
    return {
      message:
        'Your enrollment order is placed. Please wait for the admin approval.',
    };
  }

  async expectedEnrolledStuByCourseId(courseId: string) {
    const course = await this.findCourseById(courseId);
    if (course) {
      const expectedEnrolledStuIds = course.expectedEnrolledStuIds;

      const [err, stuInfos] = await to(
        this.userRepository.find({
          select: [
            'id',
            'firstName',
            'lastName',
            'email',
            'institution',
            'faculty',
          ],
          where: { id: In(expectedEnrolledStuIds) },
        })
      );
      if (err) throw new InternalServerErrorException();
      return stuInfos;
    }
  }

  async expectedEnrolledStuInfo() {
    const [err, courses] = await to(
      this.courseRepository.find({
        select: [
          'id',
          'title',
          'startDate',
          'endDate',
          'expectedEnrolledStuIds',
        ],
      })
    );
    if (err) throw new InternalServerErrorException();

    if (courses) {
      const coursesWithStuInfos = [];
      for (const course of courses) {
        const expectedEnrolledStuIds = course.expectedEnrolledStuIds;
        const [err, stuInfos] = await to(
          this.userRepository.find({
            select: [
              'id',
              'firstName',
              'lastName',
              'email',
              'institution',
              'faculty',
            ],
            where: { id: In(expectedEnrolledStuIds) },
          })
        );
        if (err) throw new InternalServerErrorException();

        coursesWithStuInfos.push({
          id: course.id,
          title: course.title,
          startDate: course.startDate,
          endDate: course.endDate,
          stuInfos,
        });
      }

      return coursesWithStuInfos;
    }
  }

  async approveOrDenyEnrollment(
    courseId: string,
    stuIds: [string],
    deny = false
  ) {
    const [err, course] = await to(this.findCourseById(courseId));
    if (err) throw new InternalServerErrorException();

    stuIds.forEach((element) => {
      if (!deny) {
        course.enrolledStuIds
          ? course.enrolledStuIds.push(element)
          : (course.enrolledStuIds = [element]);
      }

      const index = course.expectedEnrolledStuIds.indexOf(element.toString());
      if (index > -1) {
        course.expectedEnrolledStuIds.splice(index, 1);
      }
    });

    const [err1, result] = await to(course.save());
    if (err1) throw new InternalServerErrorException();
    return {
      message: deny ? 'Enrollment denied' : 'Enrollment successful',
    };
  }
}
