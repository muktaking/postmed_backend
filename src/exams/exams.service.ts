const shuffle = require('knuth-shuffle').knuthShuffle;

import {
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as _ from 'lodash';
import { CategoryRepository } from 'src/categories/category.repository';
import { QuestionRepository } from 'src/questions/question.repository';
import { UsersService } from 'src/users/users.service';
import { to } from 'src/utils/utils';
import { In, LessThan, LessThanOrEqual, Like, MoreThanOrEqual } from 'typeorm';
import { CreateExamDto } from './dto/exam.dto';
import { Exam, ExamType } from './exam.entity';
import { ExamRepository } from './exam.repository';
import { Feedback, Status } from './feedback.entity';
import { FeedbackRepository } from './feedback.repository';
import { ExamProfileRepository } from './profie.repository';
import { Profile } from './profile.entity';
import moment = require('moment');

@Injectable()
export class ExamsService {
  constructor(
    private readonly usersService: UsersService,
    @InjectRepository(QuestionRepository)
    private questionRepository: QuestionRepository,

    @InjectRepository(CategoryRepository)
    private categoryRepository: CategoryRepository,

    @InjectRepository(ExamRepository)
    private examRepository: ExamRepository,

    @InjectRepository(ExamProfileRepository)
    private examProfileRepository: ExamProfileRepository,

    @InjectRepository(FeedbackRepository)
    private feedbackRepository: FeedbackRepository
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

  async findUserExamInfo(email: string) {
    const examTotalNumber = await this.findExamTotalNumber();
    const examTotalTaken = await this.findTotalExamTaken(email);
    const rank = await this.getUserRank(email); //need to implement later
    const totalStudent = await this.usersService.findAllStudentNumber(); //need to implement later
    const upcomingExam = await this.findLatestExam();
    const result = await this.getUserAvgResult(email);

    return {
      totalExam: [examTotalNumber, examTotalTaken],
      rank: [rank, totalStudent],
      upcomingExam: [
        upcomingExam.title,
        upcomingExam.startDate,
        upcomingExam.id,
      ],
      result: [...result],
    };
  }

  async findUserExamStat(email: string) {
    const examIds = [];
    const stat = [];
    const examTitles = [];
    const [err, profile] = await to(
      this.examProfileRepository.findOne({
        user: email,
      })
    );
    if (err) throw new InternalServerErrorException();
    profile &&
      profile.exams.map((e) => {
        examIds.push(e.examId);
        examTitles.push({ title: e.examTitle, type: e.examType });
        stat.push({
          attemptNumbers: e.attemptNumbers,
          averageScore: e.averageScore,
          totalMark: e.totalMark,
          lastAttemptTime: e.lastAttemptTime,
        });
      });
    // const [err1, examTitles] = await to(
    //   this.examRepository.find({
    //     select: ["title", "type"],
    //     where: { id: In(examIds) },
    //   })
    // );
    // if (err1) throw new InternalServerErrorException();

    return { examTitles: examTitles.reverse(), stat: stat.reverse() };
  }

  async findTotalExamTaken(email: string) {
    const [err, profile] = await to(
      this.examProfileRepository.findOne({
        user: email,
      })
    );
    if (err) throw new InternalServerErrorException();
    if (profile) return profile.exams.length;
    return 0;
  }

  async findExamTotalNumber() {
    const [err, examTotal] = await to(this.examRepository.count());
    if (err) throw new InternalServerErrorException();
    return examTotal;
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

  async getFeaturedExams() {
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
    id: string,
    constraintByCategoryType = null,
    email = null
  ) {
    if (constraintByCategoryType) {
      const [err, exam] = await to(this.examRepository.findOne(+id));

      if (err) throw new InternalServerErrorException();

      if (!exam) {
        throw new UnauthorizedException('Forbidden: Unauthorized Access');
      } else if (
        !exam.categoryIds.includes(constraintByCategoryType.toString())
      ) {
        throw new UnauthorizedException(`Forbidden: Unauthorized Access`);
      }

      return exam;
    }

    const [err, exam] = await to(this.examRepository.findOne(id));
    if (err) throw new InternalServerErrorException();

    if (email) {
      if (exam.type >= this.oneTimeAttemptTypeBar) {
        const [err1, profile] = await to(
          this.examProfileRepository.findOne({
            user: email,
          })
        );
        if (err1) throw new InternalServerErrorException();

        const [examProfile] = profile.exams.filter(
          (exam) => exam.examId === +id
        );

        if (examProfile) {
          if (examProfile.attemptNumbers >= 1) {
            throw new UnauthorizedException(
              `Forbidden: Unauthorized Access: This Exam Can not be Attempt More Than One Time`
            );
          }
        }
      }
    }

    return exam;
  }

  async findExamByCatId(id: string) {
    const [err, exams] = await to(
      this.examRepository.find({
        select: ['id', 'title', 'description', 'startDate', 'endDate'],
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
  async findQuestionsByExamId(id: string, email) {
    const exam = await this.findExamById(id, null, email);
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
    const exam = await this.findExamById(id, await this.freeCategoryId);
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
  async findAllProfile(): Promise<Profile[]> {
    const [err, profiles] = await to(this.examProfileRepository.find());
    if (err) throw new InternalServerErrorException();
    return profiles;
  }
  async findProfileByUserEmail(
    email: string
    //examId: string
  ): Promise<Profile> {
    const [err, profile] = await to(
      this.examProfileRepository.findOne({
        user: email,
        // $and: [{ "exams._id": examId }, { user: email }],
      })
    );
    if (err) throw new InternalServerErrorException();
    return profile;
  }

  async getUserAvgResult(email: string) {
    const [err, profile] = await to(
      this.examProfileRepository.findOne({
        user: email,
      })
    );
    if (err) throw new InternalServerErrorException();
    let totalAvgScore = 0;
    let totalMark = 0;
    profile &&
      profile.exams.map((e) => {
        totalAvgScore += e.averageScore;
        totalMark += e.totalMark;
      });
    return [totalAvgScore.toFixed(2), totalMark.toFixed(2)];
  }

  async getUserRank(email: string) {
    const profiles = await this.findAllProfile();
    let totalAvgScore = 0;
    const profilesModified = _.sortBy(
      profiles.map((profile) => ({
        user: profile.user,
        totalAvgScore: profile.exams
          .map((e) => (totalAvgScore += e.averageScore))
          .reverse()[0],
      })),
      (profile) => profile.totalAvgScore
    ).reverse();
    let rank = 0;
    profilesModified.forEach((e, i) => {
      if (e.user === email) rank = i + 1;
      return;
    });

    return rank;
  }

  //<-------------------------------->
  async createExam(createExamDto, creator: string) {
    const {
      title,
      type,
      categoryType,
      description,
      questions,
      startDate,
      endDate,
      singleQuestionMark,
      questionStemLength,
      penaltyMark,
      timeLimit,
    } = createExamDto;

    const exam = new Exam();

    exam.title = title;
    exam.type = type;
    exam.categoryIds = categoryType;
    exam.description = description;
    exam.questions = questions;
    exam.startDate = startDate;
    exam.endDate = endDate;
    exam.singleQuestionMark = singleQuestionMark;
    exam.questionStemLength = questionStemLength;
    exam.penaltyMark = penaltyMark;
    exam.timeLimit = timeLimit;
    exam.creatorId = +creator;
    exam.categoryIds = categoryType;
    exam.categoryType = [];

    categoryType.forEach((e) => {
      exam.categoryType.push({ id: +e });
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
      description,
      questions,
      singleQuestionMark,
      questionStemLength,
      penaltyMark,
      timeLimit,
    } = createExamDto;

    const exam = await this.examRepository.findOne(+id).catch((e) => {
      console.log(e);
      throw new HttpException(
        'Could not able to fetch oldQuestion from database ',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    });

    exam.title = title;
    exam.type = type;
    exam.categoryIds = categoryType;
    exam.description = description;
    exam.questions = questions;
    exam.singleQuestionMark = singleQuestionMark;
    exam.questionStemLength = questionStemLength;
    (exam.penaltyMark = penaltyMark), (exam.timeLimit = timeLimit);
    //exam.creatorId = +creator;
    exam.categoryIds = categoryType;
    exam.categoryType = [];
    exam.createdAt = moment().format('YYYY-MM-DD HH=mm=sss');

    categoryType.forEach((e) => {
      exam.categoryType.push({ id: +e });
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
        select: ['id', 'name', 'feedbackStatus', 'message', 'examId'],
        where: { status: Status.Pending },
      })
    );
    if (err) {
      console.log(err);
      throw new InternalServerErrorException();
    }

    return feedbacks;
  }

  async changePendingStatus(ids) {
    const [err, feedbacks] = await to(this.feedbackRepository.find(ids));

    if (err) {
      console.log(err);
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
}
