import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RolePermitted, User } from 'src/users/user.entity';
import { UserRepository } from 'src/users/user.repository';
import { deleteImageFile, to } from 'src/utils/utils';
import { In, Like, MoreThanOrEqual } from 'typeorm';
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

  async createCourse(createCourseDto, imagePath, creator: string) {
    const { title, description, price, startDate, endDate } = createCourseDto;

    const course = new Course();

    course.title = title;
    course.description = description;
    course.price = price ? +price : null;
    course.imageUrl = imagePath;
    course.startDate = startDate;
    course.endDate = endDate;
    course.creatorId = +creator;

    const [err, result] = await to(course.save());
    if (err) {
      throw new InternalServerErrorException();
    }
    return { message: 'Created Course Successfully' };
  }

  async findAllCourses(user: User = null) {
    if (
      user &&
      (user.role === RolePermitted.mentor ||
        user.role === RolePermitted.moderator)
    ) {
      const [error, userDetails] = await to(
        this.userRepository.findOne({
          where: { id: user.id },
          relations: ['accessRight'],
        })
      );
      if (error) throw new InternalServerErrorException(error.message);

      if (userDetails.accessRight) {
        const accessableCourseIds = userDetails.accessRight.accessableCourseIds;
        const [err, courses] = await to(
          this.courseRepository.find({
            where: {
              id: In(accessableCourseIds),
              endDate: MoreThanOrEqual(new Date()),
            },
            order: { startDate: 'DESC' },
          })
        );
        if (err) throw new InternalServerErrorException(err.message);
        return courses;
      }
      return null;
    }
    const [err, courses] = await to(
      this.courseRepository.find({
        where: { endDate: MoreThanOrEqual(new Date()) },
        order: { startDate: 'DESC' },
      })
    );
    if (err) throw new InternalServerErrorException();
    return courses;
  }

  async findAllRawCourses() {
    const [err, courses] = await to(
      this.courseRepository.find({
        order: { startDate: 'DESC' },
      })
    );
    if (err) throw new InternalServerErrorException();
    return courses;
  }

  async findAllCoursesEnrolledByStudent(stuId) {
    const [err, courses] = await to(
      this.courseRepository.find({
        where: [
          {
            enrolledStuIds: Like(stuId),
            //endDate: MoreThanOrEqual(new Date()),
          },
          {
            enrolledStuIds: Like('%,' + stuId + ',%'),
            //endDate: MoreThanOrEqual(new Date()),
          },
          {
            enrolledStuIds: Like(stuId + ',%'),
            //endDate: MoreThanOrEqual(new Date()),
          },
          {
            enrolledStuIds: Like('%,' + stuId),
            //endDate: MoreThanOrEqual(new Date()),
          },
        ],
        order: { startDate: 'DESC' },
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

  async updateCourseById(
    courseUpdated: CreateCourseDto,
    id: string,
    imagePath
  ) {
    const { title, description, price, startDate, endDate } = courseUpdated;

    const [err, course] = await to(this.courseRepository.findOne({ id: +id }));
    if (err) throw new InternalServerErrorException(err.message);

    course.title = title;
    course.description = description;
    course.price = price;
    course.startDate = startDate;
    course.endDate = endDate;
    if (imagePath) {
      const [delImageErr, delImageRes] = await to(
        deleteImageFile(course.imageUrl)
      );
      if (delImageErr)
        throw new InternalServerErrorException(delImageErr.message);

      if (delImageRes) {
        course.imageUrl = imagePath;
      }

      // fs.unlink(`./uploads/${course.imageUrl}`, (err) => {
      //   if (err) {
      //     console.log(err);
      //   }
      // });
    }

    const [err1, result] = await to(course.save());

    if (err1) throw new InternalServerErrorException(err1.message);

    return { message: 'Successfuly Edited the course' };
  }

  async deleteCourseById(id: string) {
    const [err, course] = await to(this.courseRepository.findOne({ id: +id }));
    if (err) throw new InternalServerErrorException();

    const [delImageErr, delImageRes] = await to(
      deleteImageFile(course.imageUrl)
    );
    if (delImageErr)
      throw new InternalServerErrorException(delImageErr.message);

    if (delImageRes) {
      const [error, result] = await to(
        this.courseRepository.delete({ id: +id })
      );
      if (error) throw new InternalServerErrorException();
      return { message: 'Successfuly deleted the course' };
    }
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
      }
      //auto enrollment logic
      if (!course.price) {
        if (course.enrolledStuIds) {
          course.enrolledStuIds.push(+stuId);
        } else {
          course.enrolledStuIds = [+stuId];
        }
        const [err, result] = await to(course.save());
        if (err) throw new InternalServerErrorException();
        return {
          message: 'You have successfully enrolled. Please enjoy the exam.',
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

  async expectedEnrolledStuInfo(user: User) {
    let accessableCourseIds = null;
    let courses = null;
    let err = null;

    if (user.role === RolePermitted.moderator) {
      const [error, userDetails] = await to(
        this.userRepository.findOne({
          where: { id: user.id },
          relations: ['accessRight'],
        })
      );
      if (error) throw new InternalServerErrorException(error.message);

      if (userDetails.accessRight) {
        accessableCourseIds = userDetails.accessRight.accessableCourseIds;
        [err, courses] = await to(
          this.courseRepository.find({
            select: [
              'id',
              'title',
              'startDate',
              'endDate',
              'expectedEnrolledStuIds',
            ],
            where: { id: In(accessableCourseIds) },
            order: { startDate: 'DESC' },
          })
        );
        if (err) throw new InternalServerErrorException();
      } else {
        return [];
      }
    } else {
      [err, courses] = await to(
        this.courseRepository.find({
          select: [
            'id',
            'title',
            'startDate',
            'endDate',
            'expectedEnrolledStuIds',
          ],
          order: { startDate: 'DESC' },
        })
      );
      if (err) throw new InternalServerErrorException();
    }

    if (courses) {
      const coursesWithStuInfos = [];

      for (const course of courses) {
        const expectedEnrolledStuIds = course.expectedEnrolledStuIds
          ? course.expectedEnrolledStuIds
          : [];
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
      //console.log(coursesWithStuInfos);
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

  async findAllEnrolledStudentNumberByCourseId(
    courseId
  ): Promise<number | InternalServerErrorException> {
    //const [err, result] = await to(this.userRepository.count());
    const [err, course] = await to(this.findCourseById(courseId));

    if (err)
      throw new InternalServerErrorException(
        'All Enrolled Student Number Can Not Be Counted'
      );

    return course.enrolledStuIds.length;
  }

  async findAllEnrolledStudentByCourseId(courseId) {
    const [err, course] = await to(this.findCourseById(courseId));

    if (err)
      throw new InternalServerErrorException(
        'All Enrolled Student Number Can Not Be Counted'
      );

    return course.enrolledStuIds;
  }

  // async findAllEnrolledStudentByMentorId(user){

  //   const stuIds = [];

  //   if (user.role <= RolePermitted.moderator) {
  //     const [error, userDetails] = await to(
  //       this.userRepository.findOne({
  //         where: { id: user.id },
  //         relations: ['accessRight'],
  //       })
  //     );
  //     if (error) throw new InternalServerErrorException(error.message);

  //     if(userDetails.accessRight){
  //       const accessableCourseIds = userDetails.accessRight.accessableCourseIds
  //       const [err, courses] = await to(this.courseRepository.find({
  //         where: {id: In(accessableCourseIds)}
  //       }));
  //       if (err) throw new InternalServerErrorException(err.message);

  //       if(courses){
  //         courses.forEach(element => {
  //           stuIds.push
  //         });
  //       }
  //     } else{
  //       return []
  //     }
  //   }
  // }
}
