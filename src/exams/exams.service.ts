const shuffle = require('knuth-shuffle').knuthShuffle;

import {
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { jsPDF } from 'jspdf';
import * as _ from 'lodash';
import { CategoryRepository } from 'src/categories/category.repository';
import { CourseRepository } from 'src/courses/course.repository';
import { CoursesService } from 'src/courses/courses.service';
import { QuestionRepository } from 'src/questions/question.repository';
import { UserExamCourseProfileRepository } from 'src/userExamProfile/userExamCourseProfile.repository';
import { UserExamProfile } from 'src/userExamProfile/userExamProfile.entity';
import { UserExamProfileRepository } from 'src/userExamProfile/userExamProfile.repository';
import { RolePermitted, User } from 'src/users/user.entity';
import { UsersService } from 'src/users/users.service';
import { to } from 'src/utils/utils';
import { In, LessThan, LessThanOrEqual, Like, MoreThanOrEqual } from 'typeorm';
import { CreateExamDto } from './dto/exam.dto';
import { Exam, ExamType } from './exam.entity';
import { ExamRepository } from './exam.repository';
import { Feedback, Status } from './feedback.entity';
import { FeedbackRepository } from './feedback.repository';
import moment = require('moment');

@Injectable()
export class ExamsService {
  constructor(
    private readonly usersService: UsersService,
    private readonly coursesService: CoursesService,
    @InjectRepository(QuestionRepository)
    private questionRepository: QuestionRepository,

    @InjectRepository(CourseRepository)
    private courseRepository: CategoryRepository,

    @InjectRepository(CategoryRepository)
    private categoryRepository: CategoryRepository,

    @InjectRepository(ExamRepository)
    private examRepository: ExamRepository,

    @InjectRepository(FeedbackRepository)
    private feedbackRepository: FeedbackRepository,
    @InjectRepository(UserExamCourseProfileRepository)
    private userExamCourseProfileRepository: UserExamCourseProfileRepository,
    @InjectRepository(UserExamProfileRepository)
    private userExamProfileRepository: UserExamProfileRepository
  ) {
    this.freeCategoryId = this.getFreeCategoryId();
    this.featuredCategoryId = this.getFeaturedCategoryId();
    this.oneTimeAttemptTypeBar = ExamType.Term;
  }
  //user specific service
  private freeCategoryId;
  private oneTimeAttemptTypeBar;
  async getFreeCategoryId() {
    const [err, category] = await to(
      this.categoryRepository.findOne({ name: 'Free' })
    );
    if (err) throw new InternalServerErrorException();
    return category ? category.id : null;
  }

  private featuredCategoryId;

  async getFeaturedCategoryId() {
    const [err, category] = await to(
      this.categoryRepository.findOne({ name: 'Featured' })
    );
    if (err) throw new InternalServerErrorException();
    return category ? category.id : null;
  }

  async findUserExamInfo(id, courseId) {
    const examTotalNumber = await this.findExamTotalNumberByCourseId(+courseId);
    const examTotalTaken = await this.findTotalExamTakenByCourseId(
      +id,
      +courseId
    );
    const rank = await this.getUserRank(+id, +courseId); //need to implement later
    const totalStudent = await this.coursesService.findAllEnrolledStudentNumberByCourseId(
      +courseId
    ); //need to implement later
    const upcomingExam = await this.findLatestExamByCourseId(+courseId);
    const result = await this.getUserAvgResultByCourseId(+id, +courseId);

    return {
      totalExam: [examTotalNumber, examTotalTaken],
      rank: [rank, totalStudent],
      upcomingExam: [
        upcomingExam.title,
        upcomingExam.startDate,
        upcomingExam.id,
      ],
      result: result ? [...result] : [0, 0],
    };
  }

  async findUserExamStat(id, courseId) {
    const examIds = [];
    const stat = [];
    const examTitles = [];
    const [err, profile] = await to(
      this.userExamProfileRepository.findOne({
        where: { id: +id },
      })
    );
    if (err) throw new InternalServerErrorException();
    if (profile) {
      const [course] = profile.courses.filter((c) => c.courseId === +courseId);
      if (course) {
        course.exams.map((e) => {
          examIds.push(e.examId);
          examTitles.push({ title: e.examTitle, type: e.examType });
          stat.push({
            attemptNumbers: e.attemptNumbers,
            averageScore: e.score[0],
            totalMark: e.totalMark,
            lastAttemptTime: e.lastAttemptTime,
          });
        });
      }
    }

    return { examTitles: examTitles.reverse(), stat: stat.reverse() };
  }

  async findTotalExamTakenByCourseId(id, courseId) {
    const [err, profile] = await to(
      this.userExamProfileRepository.findOne({
        id: +id,
      })
    );
    if (err) throw new InternalServerErrorException();

    if (profile) {
      const [course] = profile.courses.filter((c) => c.courseId === +courseId);

      if (course) {
        return course.exams.length;
      }
    }
    return 0;
  }

  async findExamTotalNumber() {
    const [err, examTotal] = await to(this.examRepository.count());
    if (err) throw new InternalServerErrorException();
    return examTotal;
  }

  async findExamTotalNumberByCourseId(courseId) {
    const [err, exams] = await to(
      this.examRepository.find({
        where: [
          {
            courseIds: Like(courseId),
            startDate: LessThanOrEqual(new Date()),
          },
          {
            courseIds: Like('%,' + courseId + ',%'),
            startDate: LessThanOrEqual(new Date()),
          },
          {
            courseIds: Like(courseId + ',%'),
            startDate: LessThanOrEqual(new Date()),
          },
          {
            courseIds: Like('%,' + courseId),
            startDate: LessThanOrEqual(new Date()),
          },
        ],
      })
      // .getCount()
    );
    if (err)
      throw new InternalServerErrorException('Can not get total course number');
    return exams.length;
  }

  // Get all ongoing exams
  async findAllExams() {
    let [err, exams] = await to(
      this.examRepository.find({
        select: [
          'id',
          'title',
          'type',
          'description',
          'startDate',
          'endDate',
          //"categoryType",
        ],
        // where: {
        //   startDate: LessThanOrEqual(new Date()),
        //   endDate: MoreThanOrEqual(new Date()),
        // },
        relations: ['categoryType'],
        order: { endDate: 'DESC' },
      })
    );
    if (err) throw new InternalServerErrorException();

    exams = {
      assignment: _.filter(exams, (e) => e.type === ExamType.Assignment),
      weekly: _.filter(exams, (e) => e.type === ExamType.Weekly),
      monthly: _.filter(exams, (e) => e.type === ExamType.Monthly),
      assesment: _.filter(exams, (e) => e.type === ExamType.Assesment),
      term: _.filter(exams, (e) => e.type === ExamType.Term),
      test: _.filter(exams, (e) => e.type === ExamType.Test),
      final: _.filter(exams, (e) => e.type === ExamType.Final),
    };
    return exams;
  }

  async findAllExamsByCourseIds(courseId, stuIds: string) {
    const [error, course] = to(await this.courseRepository.findOne(+courseId));
    if (error) throw new InternalServerErrorException();

    if (course.length > 0) {
      if (course.enrolledStuIds && course.enrolledStuIds.includes(stuIds)) {
        let [err, exams] = await to(
          this.examRepository.find({
            select: [
              'id',
              'title',
              'type',
              'description',
              'startDate',
              'endDate',
              //"categoryType",
            ],
            // where: {
            //   startDate: LessThanOrEqual(new Date()),
            //   endDate: MoreThanOrEqual(new Date()),
            // },
            where: {
              where: [
                {
                  courseIds: Like(courseId),
                  startDate: LessThanOrEqual(new Date()),
                  //endDate: MoreThanOrEqual(new Date()),
                },
                {
                  courseIds: Like('%,' + courseId + ',%'),
                  startDate: LessThanOrEqual(new Date()),
                  //endDate: MoreThanOrEqual(new Date()),
                },
                {
                  courseIds: Like(courseId + ',%'),
                  startDate: LessThanOrEqual(new Date()),
                  //endDate: MoreThanOrEqual(new Date()),
                },
                {
                  courseIds: Like('%,' + courseId),
                  startDate: LessThanOrEqual(new Date()),
                  //endDate: MoreThanOrEqual(new Date()),
                },
              ],
            },
            relations: ['categoryType'],
            order: { endDate: 'DESC' },
          })
        );
        if (err) throw new InternalServerErrorException();

        exams = {
          assignment: _.filter(exams, (e) => e.type === ExamType.Assignment),
          weekly: _.filter(exams, (e) => e.type === ExamType.Weekly),
          monthly: _.filter(exams, (e) => e.type === ExamType.Monthly),
          assesment: _.filter(exams, (e) => e.type === ExamType.Assesment),
          term: _.filter(exams, (e) => e.type === ExamType.Term),
          test: _.filter(exams, (e) => e.type === ExamType.Test),
          final: _.filter(exams, (e) => e.type === ExamType.Final),
        };
        return exams;
      }
    } else {
      throw new UnauthorizedException(
        `Forbidden: Unauthorized Access: Please enroll for the required course.`
      );
    }
  }

  async findAllPlainExamsByCourseIds(courseId, filter = null) {
    const [error, course] = await to(
      this.courseRepository.findOne({
        where: { id: +courseId, endDate: MoreThanOrEqual(new Date()) },
      })
    );

    if (error) throw new InternalServerErrorException();

    if (course) {
      if (
        filter && // 👈 null and undefined check
        Object.keys(filter).length !== 0
      ) {
        const { text, examType } = filter;
        let [err, exams] = await to(
          this.examRepository.find({
            select: [
              'id',
              'title',
              'type',
              'description',
              'startDate',
              'endDate',
              //"categoryType",
            ],
            // where: {
            //   startDate: LessThanOrEqual(new Date()),
            //   endDate: MoreThanOrEqual(new Date()),
            // },
            where: [
              {
                courseIds: Like(courseId),
                title: Like('%' + text + '%'),
                type: In(examType),
                startDate: LessThanOrEqual(new Date()),
                //endDate: MoreThanOrEqual(new Date()),
              },
              {
                courseIds: Like('%,' + courseId + ',%'),
                title: Like('%' + text + '%'),
                type: In(examType),
                startDate: LessThanOrEqual(new Date()),
                //endDate: MoreThanOrEqual(new Date()),
              },
              {
                courseIds: Like(courseId + ',%'),
                title: Like('%' + text + '%'),
                type: In(examType),
                startDate: LessThanOrEqual(new Date()),
                //endDate: MoreThanOrEqual(new Date()),
              },
              {
                courseIds: Like('%,' + courseId),
                title: Like('%' + text + '%'),
                type: In(examType),
                startDate: LessThanOrEqual(new Date()),
                //endDate: MoreThanOrEqual(new Date()),
              },
            ],

            relations: ['categoryType'],
            order: { endDate: 'DESC' },
          })
        );

        if (err) throw new InternalServerErrorException();
        return exams;
      }
      let [err, exams] = await to(
        this.examRepository.find({
          select: [
            'id',
            'title',
            'type',
            'description',
            'startDate',
            'endDate',
            //"categoryType",
          ],
          // where: {
          //   startDate: LessThanOrEqual(new Date()),
          //   endDate: MoreThanOrEqual(new Date()),
          // },
          where: [
            {
              courseIds: Like(courseId),
              startDate: LessThanOrEqual(new Date()),
              //endDate: MoreThanOrEqual(new Date()),
            },
            {
              courseIds: Like('%,' + courseId + ',%'),
              startDate: LessThanOrEqual(new Date()),
              //endDate: MoreThanOrEqual(new Date()),
            },
            {
              courseIds: Like(courseId + ',%'),
              startDate: LessThanOrEqual(new Date()),
              //endDate: MoreThanOrEqual(new Date()),
            },
            {
              courseIds: Like('%,' + courseId),
              startDate: LessThanOrEqual(new Date()),
              //endDate: MoreThanOrEqual(new Date()),
            },
          ],

          relations: ['categoryType'],
          order: { endDate: 'DESC' },
        })
      );
      if (err) throw new InternalServerErrorException();
      // exams = {
      //   assignment: _.filter(exams, (e) => e.type === ExamType.Assignment),
      //   weekly: _.filter(exams, (e) => e.type === ExamType.Weekly),
      //   monthly: _.filter(exams, (e) => e.type === ExamType.Monthly),
      //   assesment: _.filter(exams, (e) => e.type === ExamType.Assesment),
      //   term: _.filter(exams, (e) => e.type === ExamType.Term),
      //   test: _.filter(exams, (e) => e.type === ExamType.Test),
      //   final: _.filter(exams, (e) => e.type === ExamType.Final),
      // };
      return exams;
    } else {
      throw new NotFoundException();
    }
  }

  async findAllPlainExamsByCourseIdsWithAuth(
    courseId,
    stuIds: string,
    filter = null
  ) {
    const [error, course] = await to(
      this.courseRepository.findOne({
        where: { id: +courseId, endDate: MoreThanOrEqual(new Date()) },
      })
    );

    if (error) throw new InternalServerErrorException();

    if (course) {
      // if (
      //   course.enrolledStuIds &&
      //   course.enrolledStuIds.includes(stuIds.toString())
      // ) {
      if (
        filter && // 👈 null and undefined check
        Object.keys(filter).length !== 0
      ) {
        const { text, examType } = filter;
        let [err, exams] = await to(
          this.examRepository.find({
            select: [
              'id',
              'title',
              'type',
              'description',
              'startDate',
              'endDate',
              //"categoryType",
            ],
            // where: {
            //   startDate: LessThanOrEqual(new Date()),
            //   endDate: MoreThanOrEqual(new Date()),
            // },
            where: [
              {
                courseIds: Like(courseId),
                title: Like('%' + text + '%'),
                type: In(examType),
                startDate: LessThanOrEqual(new Date()),
                //endDate: MoreThanOrEqual(new Date()),
              },
              {
                courseIds: Like('%,' + courseId + ',%'),
                title: Like('%' + text + '%'),
                type: In(examType),
                startDate: LessThanOrEqual(new Date()),
                //endDate: MoreThanOrEqual(new Date()),
              },
              {
                courseIds: Like(courseId + ',%'),
                title: Like('%' + text + '%'),
                type: In(examType),
                startDate: LessThanOrEqual(new Date()),
                //endDate: MoreThanOrEqual(new Date()),
              },
              {
                courseIds: Like('%,' + courseId),
                title: Like('%' + text + '%'),
                type: In(examType),
                startDate: LessThanOrEqual(new Date()),
                //endDate: MoreThanOrEqual(new Date()),
              },
            ],

            relations: ['categoryType'],
            order: { endDate: 'DESC' },
          })
        );

        if (err) throw new InternalServerErrorException();
        return exams;
      }
      let [err, exams] = await to(
        this.examRepository.find({
          select: [
            'id',
            'title',
            'type',
            'description',
            'startDate',
            'endDate',
            //"categoryType",
          ],
          // where: {
          //   startDate: LessThanOrEqual(new Date()),
          //   endDate: MoreThanOrEqual(new Date()),
          // },
          where: [
            {
              courseIds: Like(courseId),
              startDate: LessThanOrEqual(new Date()),
              //endDate: MoreThanOrEqual(new Date()),
            },
            {
              courseIds: Like('%,' + courseId + ',%'),
              startDate: LessThanOrEqual(new Date()),
              //endDate: MoreThanOrEqual(new Date()),
            },
            {
              courseIds: Like(courseId + ',%'),
              startDate: LessThanOrEqual(new Date()),
              //endDate: MoreThanOrEqual(new Date()),
            },
            {
              courseIds: Like('%,' + courseId),
              startDate: LessThanOrEqual(new Date()),
              //endDate: MoreThanOrEqual(new Date()),
            },
          ],

          relations: ['categoryType'],
          order: { endDate: 'DESC' },
        })
      );
      if (err) throw new InternalServerErrorException();
      // exams = {
      //   assignment: _.filter(exams, (e) => e.type === ExamType.Assignment),
      //   weekly: _.filter(exams, (e) => e.type === ExamType.Weekly),
      //   monthly: _.filter(exams, (e) => e.type === ExamType.Monthly),
      //   assesment: _.filter(exams, (e) => e.type === ExamType.Assesment),
      //   term: _.filter(exams, (e) => e.type === ExamType.Term),
      //   test: _.filter(exams, (e) => e.type === ExamType.Test),
      //   final: _.filter(exams, (e) => e.type === ExamType.Final),
      // };
      return exams;
      // } else {
      //   throw new UnauthorizedException(
      //     `Forbidden: Unauthorized Access: Please enroll for the required course.`
      //   );
      // }
    } else {
      throw new NotFoundException();
    }
  }

  // get all old exams
  async findAllOldExams() {
    let [err, exams] = await to(
      this.examRepository.find({
        select: [
          'id',
          'title',
          'type',
          'description',
          'startDate',
          'endDate',
          //"categoryType",
        ],
        where: {
          endDate: LessThan(new Date()),
        },
        relations: ['categoryType'],
        order: { endDate: 'DESC' },
      })
    );
    if (err) throw new InternalServerErrorException();

    exams = {
      assignment: _.filter(exams, (e) => e.type === ExamType.Assignment),
      weekly: _.filter(exams, (e) => e.type === ExamType.Weekly),
      monthly: _.filter(exams, (e) => e.type === ExamType.Monthly),
      assesment: _.filter(exams, (e) => e.type === ExamType.Assesment),
      term: _.filter(exams, (e) => e.type === ExamType.Term),
      test: _.filter(exams, (e) => e.type === ExamType.Test),
      final: _.filter(exams, (e) => e.type === ExamType.Final),
    };
    return exams;
  }

  async findAllRawExams() {
    let [err, exams] = await to(
      this.examRepository.find({
        select: [
          'id',
          'title',
          'type',
          'description',
          'startDate',
          'endDate',
          'createdAt',
          'courseIds',
          //"categoryType",
        ],
        relations: ['categoryType'],
        order: { createdAt: 'DESC' },
      })
    );

    if (err) throw new InternalServerErrorException();

    exams = {
      assignment: _.filter(exams, (e) => e.type === ExamType.Assignment),
      weekly: _.filter(exams, (e) => e.type === ExamType.Weekly),
      monthly: _.filter(exams, (e) => e.type === ExamType.Monthly),
      assesment: _.filter(exams, (e) => e.type === ExamType.Assesment),
      term: _.filter(exams, (e) => e.type === ExamType.Term),
      test: _.filter(exams, (e) => e.type === ExamType.Test),
      final: _.filter(exams, (e) => e.type === ExamType.Final),
    };
    return exams;
  }

  async findLatestExam() {
    const [err, [examLatest]] = await to(
      this.examRepository.find({
        select: ['id', 'title', 'description', 'type', 'startDate', 'endDate'],
        // where: {
        //   startDate: LessThanOrEqual(new Date()),
        //   endDate: MoreThanOrEqual(new Date()),
        // },
        relations: ['categoryType'],
        order: { startDate: 'DESC' },
        take: 1,
      })
    );

    if (err) throw new InternalServerErrorException();
    return examLatest;
  }

  async findLatestExamByCourseId(courseId) {
    this.findAllExamsByCourseIds;
    const [err, [examLatest]] = await to(
      this.examRepository.find({
        select: ['id', 'title', 'description', 'type', 'startDate', 'endDate'],
        where: [
          {
            courseIds: Like(courseId),
            startDate: LessThanOrEqual(new Date()),
            //endDate: MoreThanOrEqual(new Date()),
          },
          {
            courseIds: Like('%,' + courseId + ',%'),
            startDate: LessThanOrEqual(new Date()),
            //endDate: MoreThanOrEqual(new Date()),
          },
          {
            courseIds: Like(courseId + ',%'),
            startDate: LessThanOrEqual(new Date()),
            //endDate: MoreThanOrEqual(new Date()),
          },
          {
            courseIds: Like('%,' + courseId),
            startDate: LessThanOrEqual(new Date()),
            //endDate: MoreThanOrEqual(new Date()),
          },
        ],
        relations: ['categoryType'],
        order: { startDate: 'DESC' },
        take: 1,
      })
    );

    if (err) throw new InternalServerErrorException();
    return examLatest;
  }

  async findCurrentExam() {
    const [err, [examLatest]] = await to(
      this.examRepository.find({
        select: ['id', 'title', 'description', 'type', 'startDate', 'endDate'],
        where: {
          startDate: LessThanOrEqual(new Date()),
          endDate: MoreThanOrEqual(new Date()),
        },
        relations: ['categoryType'],
        order: { startDate: 'DESC' },
        take: 1,
      })
    );

    if (err) throw new InternalServerErrorException();
    return examLatest;
  }

  async getFeaturedExams(courseId = null) {
    if (courseId) {
      const [err, exams] = await to(
        this.examRepository.find({
          where: [
            {
              categoryIds: Like(
                '%,' + (await this.featuredCategoryId).toString() + ',%'
              ),
              startDate: LessThanOrEqual(new Date()),
            },
            {
              categoryIds: Like(
                (await this.featuredCategoryId).toString() + ',%'
              ),
              startDate: LessThanOrEqual(new Date()),
            },
            {
              categoryIds: Like(
                '%,' + (await this.featuredCategoryId).toString()
              ),
              startDate: LessThanOrEqual(new Date()),
            },
          ],
          relations: ['categoryType'],
          order: { endDate: 'DESC' },
          take: 4,
        })
      );

      if (err) throw new InternalServerErrorException();

      return exams.filter((exam) =>
        exam.courseIds.includes(courseId.toString())
      );
    }
    const [err, exams] = await to(
      this.examRepository.find({
        where: [
          {
            categoryIds: Like(
              '%,' + (await this.featuredCategoryId).toString() + ',%'
            ),
            startDate: LessThanOrEqual(new Date()),
          },
          {
            categoryIds: Like(
              (await this.featuredCategoryId).toString() + ',%'
            ),
            startDate: LessThanOrEqual(new Date()),
          },
          {
            categoryIds: Like(
              '%,' + (await this.featuredCategoryId).toString()
            ),
            startDate: LessThanOrEqual(new Date()),
          },
        ],
        relations: ['categoryType'],
        order: { endDate: 'DESC' },
        take: 4,
      })
    );

    if (err) throw new InternalServerErrorException();

    return exams;
  }

  async findExamById(
    examId: string,
    courseId = null,
    constraintByCategoryType = null,
    stuId = null
  ) {
    if (constraintByCategoryType) {
      const [err, exam] = await to(this.examRepository.findOne(+examId));

      if (err) throw new InternalServerErrorException();

      if (!exam) {
        throw new UnauthorizedException('Forbidden: Unauthorized Access.');
      } else if (
        !exam.categoryIds.includes(constraintByCategoryType.toString())
      ) {
        throw new UnauthorizedException(`Forbidden: Unauthorized Access.`);
      }

      return exam;
    }

    const [err, exam] = await to(this.examRepository.findOne(+examId));

    if (err) throw new InternalServerErrorException();

    if (stuId) {
      if (courseId) {
        const [err, course] = await to(
          this.courseRepository.find({
            where: [
              {
                id: +courseId,
                enrolledStuIds: Like(+stuId),
                endDate: MoreThanOrEqual(new Date()),
              },
              {
                id: +courseId,
                enrolledStuIds: Like('%,' + stuId + ',%'),
                endDate: MoreThanOrEqual(new Date()),
              },
              {
                id: +courseId,
                enrolledStuIds: Like(stuId + ',%'),
                endDate: MoreThanOrEqual(new Date()),
              },
              {
                id: +courseId,
                enrolledStuIds: Like('%,' + stuId),
                endDate: MoreThanOrEqual(new Date()),
              },
            ],
          })
        );
        if (err) throw new InternalServerErrorException();

        if (course.length < 1) {
          throw new UnauthorizedException(
            `Forbidden: Unauthorized Access. Please enroll for the required course or the course is ended.`
          );
        }
      }
    }

    return exam;
  }

  async findExamByCatId(id: string) {
    const [err, exams] = await to(
      this.examRepository.find({
        select: ['id', 'title', 'type', 'description', 'startDate', 'endDate'],
        where: [
          {
            categoryIds: Like(id),
            startDate: LessThanOrEqual(new Date()),
            //endDate: MoreThanOrEqual(new Date()),
          },
          {
            categoryIds: Like('%,' + id + ',%'),
            startDate: LessThanOrEqual(new Date()),
            //endDate: MoreThanOrEqual(new Date()),
          },
          {
            categoryIds: Like(id + ',%'),
            startDate: LessThanOrEqual(new Date()),
            //endDate: MoreThanOrEqual(new Date()),
          },
          {
            categoryIds: Like('%,' + id),
            startDate: LessThanOrEqual(new Date()),
            //endDate: MoreThanOrEqual(new Date()),
          },
        ],
        relations: ['categoryType'],
        order: { endDate: 'DESC' },
      })
    );
    if (err) throw new InternalServerErrorException();
    return exams;
  }

  async findOldExamByCatId(id: string) {
    const [err, exams] = await to(
      this.examRepository.find({
        select: ['id', 'title', 'description', 'startDate', 'endDate'],
        where: [
          {
            categoryIds: Like(id),
            endDate: LessThan(new Date()),
          },
          {
            categoryIds: Like('%,' + id + ',%'),
            endDate: LessThan(new Date()),
          },
          {
            categoryIds: Like(id + ',%'),
            endDate: LessThan(new Date()),
          },
          {
            categoryIds: Like('%,' + id),
            endDate: LessThan(new Date()),
          },
        ],
        relations: ['categoryType'],
        order: { endDate: 'DESC' },
      })
    );
    if (err) throw new InternalServerErrorException();
    return exams;
  }

  // // <--------------------->
  async findQuestionsByExamId(id: string, user) {
    const [examId, courseId] = id.split('_');
    const exam = await this.findExamById(examId, courseId, null, user.id);

    if (exam) {
      let [err, questions] = await to(
        this.questionRepository.find({
          //select: ["id", "qType", "qText"],
          where: { id: In(exam.questions.map((e) => +e)) },
        })
      );
      if (err) throw new InternalServerErrorException();

      questions.forEach((question) => {
        question.stems.map((stem, index) => {
          question.stems[index] = stem.qStem; //_.pick(stem, ["qStem"]);
        });
      });
      shuffle(questions);
      return {
        exam: {
          id: exam._id,
          singleQuestionMark: exam.singleQuestionMark,
          singleStemMark: exam.singleStemMark,
          penaltyMark: exam.penaltyMark,
          timeLimit: exam.timeLimit,
        },
        questions,
      };
    }
  }

  async findFreeQuestionsByExamId(id: string) {
    const exam = await this.findExamById(id, null, await this.freeCategoryId);
    if (exam) {
      let [err, questions] = await to(
        this.questionRepository
          // .createQueryBuilder("question")
          // .where({ id: In(exam.questions.map((e) => +e)) })
          // .select([
          //   "question.id",
          //   "question.qType",
          //   "question.qText",
          //   "question.stems",
          // ])
          // .leftJoin("question.stems", "stem")
          // .getMany()
          .find({
            //select: ["id", "qType", "qText"],
            where: { id: In(exam.questions.map((e) => +e)) },
          })
      );

      if (err) throw new InternalServerErrorException();

      questions.map((question) => {
        question.stems.map((stem, index) => {
          question.stems[index] = stem.qStem; //_.pick(stem, ["qStem"]);
        });
      });
      shuffle(questions);
      return {
        exam: {
          id: exam.id,
          singleQuestionMark: exam.singleQuestionMark,
          singleStemMark: exam.singleStemMark,
          penaltyMark: exam.penaltyMark,
          timeLimit: exam.timeLimit,
        },
        questions,
      };
    }
  }

  // // <----------------------->
  async findAllProfile(): Promise<UserExamProfile[]> {
    const [err, profiles] = await to(this.userExamProfileRepository.find());
    if (err) throw new InternalServerErrorException();
    return profiles;
  }

  async getUserAvgResultByCourseId(id, courseId) {
    const [err, profile] = await to(
      this.userExamProfileRepository.findOne({
        where: { id: +id },
        relations: ['courses'],
      })
    );

    if (err) throw new InternalServerErrorException();

    if (profile) {
      const [course] = profile.courses.filter((c) => c.courseId === +courseId);

      if (course) {
        return [course.totalScore, course.totalMark];
      }
    }
    return null;
  }

  async getUserRank(id, courseId) {
    let [error, courses] = await to(
      this.userExamCourseProfileRepository.find({
        where: { courseId: +courseId },
        relations: ['userExamProfile'],
      })
    );

    if (error) throw new InternalServerErrorException();

    courses = _.sortBy(courses, [(o) => +o.totalScore]).reverse();

    let rank = 0;
    courses.forEach((e, i) => {
      if (e.userExamProfile.id === +id) rank = i + 1;
      return;
    });

    // let totalAvgScore = 0;

    // const profilesModified = _.sortBy(
    //   profiles.map((profile) => ({
    //     user: profile.user,
    //     totalAvgScore: profile.exams
    //       .map((e) => (totalAvgScore += e.averageScore))
    //       .reverse()[0],
    //   })),
    //   (profile) => profile.totalAvgScore
    // ).reverse();
    // let rank = 0;
    // profilesModified.forEach((e, i) => {
    //   if (e.user === email) rank = i + 1;
    //   return;
    // });

    return rank;
  }

  //<-------------------------------->
  async createExam(createExamDto, creator: User) {
    const {
      title,
      type,
      categoryType,
      courseType,
      description,
      questions,
      startDate,
      endDate,
      singleQuestionMark,
      questionStemLength,
      penaltyMark,
      timeLimit,
    } = createExamDto;

    if (creator.role < RolePermitted.coordinator) {
      const [error, accessRight] = await to(
        this.usersService.getAccessRight(creator.id)
      );
      console.log(error, accessRight);
      if (error) throw new InternalServerErrorException(error.message);

      if (accessRight) {
        const accessableCourseIds = accessRight.accesableCourseIds;
        if (!accessableCourseIds.includes(courseType.toString())) {
          throw new UnauthorizedException();
        }
      } else {
        throw new UnauthorizedException();
      }
    }

    const exam = new Exam();

    exam.title = title;
    exam.type = type;
    exam.categoryIds = categoryType;
    exam.categoryType = [];
    exam.courseIds = courseType;
    exam.courseType = [];
    exam.description = description;
    exam.questions = questions;
    exam.startDate = startDate;
    exam.endDate = endDate;
    exam.singleQuestionMark = singleQuestionMark;
    exam.questionStemLength = questionStemLength;
    exam.penaltyMark = penaltyMark;
    exam.timeLimit = timeLimit;
    exam.creatorId = +creator.id;

    categoryType.forEach((e) => {
      exam.categoryType.push({ id: +e });
    });

    courseType.forEach((e) => {
      exam.courseType.push({ id: +e });
    });

    const [err, result] = await to(exam.save());
    if (err) {
      throw new InternalServerErrorException();
    }
    return result;
  }

  async updateExamById(id: string, createExamDto: CreateExamDto) {
    const {
      title,
      type,
      categoryType,
      courseType,
      description,
      questions,
      singleQuestionMark,
      questionStemLength,
      penaltyMark,
      timeLimit,
    } = createExamDto;

    const exam = await this.examRepository.findOne(+id).catch((e) => {
      throw new HttpException(
        'Could not able to fetch oldQuestion from database ',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    });

    exam.title = title;
    exam.type = type;
    exam.categoryIds = categoryType;
    exam.categoryType = [];
    exam.courseIds = courseType;
    exam.courseType = [];
    exam.description = description;
    exam.questions = questions;
    exam.singleQuestionMark = singleQuestionMark;
    exam.questionStemLength = questionStemLength;
    (exam.penaltyMark = penaltyMark), (exam.timeLimit = timeLimit);
    //exam.creatorId = +creator;
    //exam.createdAt = moment().format('YYYY-MM-DD HH=mm=sss');

    categoryType.forEach((e) => {
      exam.categoryType.push({ id: +e });
    });

    courseType.forEach((e) => {
      exam.courseType.push({ id: +e });
    });

    const [err, result] = await to(exam.save());
    if (err) {
      console.log(err);
      throw new InternalServerErrorException();
    }
    return result;
  }

  async deleteExam(...args) {
    return await this.examRepository.delete(args);
  }

  async createFeedback(createFeedbackDto) {
    const { examId, name, email, feedbackStatus, message } = createFeedbackDto;

    const feedback = new Feedback();
    feedback.examId = +examId;
    feedback.name = name;
    feedback.email = email;
    feedback.feedbackStatus = +feedbackStatus;
    feedback.message = message;

    const [err, oldFeedback] = await to(
      this.feedbackRepository.findOne({ email, examId })
    );
    if (err) {
      console.log(err);
      throw new InternalServerErrorException();
    }

    if (oldFeedback) return { message: 'You already submitted a feedback.' };

    const [error, result] = await to(feedback.save());

    if (error) {
      console.log(error);
      throw new InternalServerErrorException();
    }
    return { message: 'Your feedback is submitted successfuly.' };
  }

  async getFeedbackByExamId(examId) {
    const [err, feedbacks] = await to(
      this.feedbackRepository.find({
        select: ['name', 'feedbackStatus', 'message'],
        where: { examId, status: Status.Published },
      })
    );
    if (err) {
      console.log(err);
      throw new InternalServerErrorException();
    }

    return feedbacks;
  }

  async getPendingFeedback() {
    const [err, feedbacks] = await to(
      this.feedbackRepository.find({
        //select: ['id', 'name', 'feedbackStatus', 'message', 'examId'],
        where: { status: Status.Pending },
        relations: ['exam'],
      })
    );

    if (err) {
      console.log(err);
      throw new InternalServerErrorException();
    }

    return feedbacks;
  }

  async changePendingStatus(ids, deny = false) {
    if (deny) {
      const [err, results] = await to(
        this.feedbackRepository.delete({ id: In(ids) })
      );
      if (err) {
        throw new InternalServerErrorException();
      }
      return { message: 'Change Status to published successfully.' };
    }

    const [err, feedbacks] = await to(this.feedbackRepository.find(ids));

    if (err) {
      throw new InternalServerErrorException();
    }

    feedbacks.forEach((feedback) => {
      if (ids.includes(feedback.id)) {
        feedback.status = Status.Published;
      }
    });

    await this.feedbackRepository.save(feedbacks);

    return { message: 'Change Status to published successfully.' };
  }

  async getPdfByExamId(examId: string) {
    const doc = new jsPDF();
    doc.text('Hello world!', 10, 10);
    return doc.output(); // will save the file in the current working directory
  }
}
