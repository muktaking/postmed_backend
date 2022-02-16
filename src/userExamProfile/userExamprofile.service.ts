import {
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { to } from 'src/utils/utils';
import { UserExamCourseProfileRepository } from './userExamCourseProfile.repository';
import { UserExamExamProfileRepository } from './userExamExamProfile.repository';
import { UserExamProfile } from './userExamProfile.entity';
import { UserExamProfileRepository } from './userExamProfile.repository';
import moment = require('moment');

@Injectable()
export class UserExamProfileService {
  constructor(
    @InjectRepository(UserExamProfileRepository)
    private userExamProfileRepository: UserExamProfileRepository,
    @InjectRepository(UserExamCourseProfileRepository)
    private userExamCourseProfileRepository: UserExamCourseProfileRepository,
    @InjectRepository(UserExamExamProfileRepository)
    private userExamExamProfileRepository: UserExamExamProfileRepository
  ) {}

  async findCourseBasedProfileByUserID(
    id: string
    //examId: string
  ): Promise<UserExamProfile> {
    const [err, profile] = await to(
      this.userExamProfileRepository
        //   .findOne({
        //     id: +id,
        //   })
        //
        .createQueryBuilder('userExamProfile')
        .leftJoinAndSelect('userExamProfile.courses', 'courses')
        .leftJoinAndSelect('courses.exams', 'exams')
        .leftJoinAndSelect('exams.examActivityStat', 'eStat')
        .where({ id: +id })
        .getOne()
    );
    if (err)
      throw new HttpException(
        `Exam profile of user can not be retrieved.`,
        HttpStatus.SERVICE_UNAVAILABLE
      );
    return profile;
  }

  async manipulateProfile(user, examData) {
    const { course, exam, score } = examData;

    let [profileError, profile] = await to(
      this.findCourseBasedProfileByUserID(user.id)
    );

    if (profileError)
      throw new HttpException(
        'Problems at retriving Profile',
        HttpStatus.SERVICE_UNAVAILABLE
      );

    const totalMark = Math.ceil(
      exam.singleQuestionMark * exam.questions.length
    );

    let examProfile = this.userExamExamProfileRepository.create({
      // creating a null exam stat
      examId: +exam.id,
      examTitle: exam.title,
      examType: exam.type,
      attemptNumbers: 1,
      score: [],
      totalMark,
      firstAttemptTime: moment().format('YYYY-MM-DD HH:mm:ss'),
      lastAttemptTime: moment().format('YYYY-MM-DD HH:mm:ss'),
      examActivityStat: [],
    });
    //examProfile.examActivityStat.push(examData.examActivityStat);

    let courseProfile = this.userExamCourseProfileRepository.create({
      courseId: +course.id,
      courseTitle: course.title,
      totalMark,
      totalScore: 0,
      exams: [],
    });

    if (!profile) {
      examProfile.examActivityStat.push(examData.examActivityStat);
      courseProfile.exams.push(examProfile);

      profile = this.userExamProfileRepository.create({
        id: +user.id,
        courses: [],
      });
    } else {
      const [courseProfileExisted] = profile.courses.filter(
        (cour) => cour.courseId === +course.id
      );

      if (courseProfileExisted) {
        const [examProfileExisted] = courseProfileExisted.exams.filter(
          (examLocal) => examLocal.examId === +exam.id
        );

        if (examProfileExisted) {
          examProfileExisted.attemptNumbers++;
          examProfileExisted.lastAttemptTime = moment().format(
            'YYYY-MM-DD HH:mm:ss'
          );
          examProfileExisted.score.push(score);
          examProfileExisted.examActivityStat.push(examData.examActivityStat);
          const [error, result] = await to(examProfileExisted.save());
          console.log(error);
          if (error) throw new InternalServerErrorException();
          return result;
        } else {
          courseProfileExisted.totalMark += totalMark;
          courseProfileExisted.totalScore =
            +courseProfileExisted.totalScore + score;

          examProfile.score.push(score);
          examProfile.examActivityStat.push(examData.examActivityStat);

          courseProfileExisted.exams.push(examProfile);

          let [error, result] = await to(examProfile.save());
          if (error) throw new InternalServerErrorException();

          [error, result] = await to(courseProfileExisted.save());
          console.log(error);
          if (error) throw new InternalServerErrorException();
          return result;
        }
      } else {
        courseProfile.exams.push(examProfile);
      }
    }

    examProfile.score.push(score);
    courseProfile.totalScore = score;
    profile.courses.push(courseProfile);

    let [error, result] = await to(examProfile.save());
    if (error) throw new InternalServerErrorException();

    [error, result] = await to(courseProfile.save());
    if (error) throw new InternalServerErrorException();

    [error, result] = await to(profile.save());

    if (error) throw new InternalServerErrorException();

    return result;
  }

  // async findUserExamInfo(email: string) {
  //   const examTotalNumber = await this.findExamTotalNumber();
  //   const examTotalTaken = await this.findTotalExamTaken(email);
  //   const rank = await this.getUserRank(email); //need to implement later
  //   const totalStudent = await this.usersService.findAllStudentNumber(); //need to implement later
  //   const upcomingExam = await this.findLatestExam();
  //   const result = await this.getUserAvgResult(email);

  //   return {
  //     totalExam: [examTotalNumber, examTotalTaken],
  //     rank: [rank, totalStudent],
  //     upcomingExam: [
  //       upcomingExam.title,
  //       upcomingExam.startDate,
  //       upcomingExam.id,
  //     ],
  //     result: [...result],
  //   };
  // }

  async findAllUserCourseProfilesByCourseId(courseId) {
    const [err, userCourseProfiles] = await to(
      this.userExamCourseProfileRepository.find({
        where: { courseId: +courseId },
        relations: ['userExamProfile'],
      })
    );
    if (err) throw new InternalServerErrorException();
    return userCourseProfiles;
  }

  async findAllUserExamActivityStat(stuId = 69) {
    const [err, userExamProfile] = await to(
      this.userExamProfileRepository
        .createQueryBuilder('userEP')
        .leftJoinAndSelect('userEP.courses', 'courses')
        .leftJoinAndSelect('courses.exams', 'exams')
        .leftJoinAndSelect('exams.examActivityStat', 'eStat')
        .leftJoinAndSelect('eStat.questionActivityStat', 'qStat')
        .leftJoinAndSelect('qStat.stemActivityStat', 'sStat')
        .where('userEP.id = :id', { id: stuId })
        .andWhere('courses.courseId = :courseId', { courseId: 3 })
        .andWhere('exams.examId = :examId', { examId: 20 })
        .getMany()
    );
    console.log(err);
    if (err) throw new InternalServerErrorException();
    return userExamProfile;
  }

  async findAllUserExamActivityStatByCourseId(stuId, courseId) {
    const [err, userExamProfile] = await to(
      this.userExamProfileRepository
        .createQueryBuilder('userEP')
        .leftJoinAndSelect('userEP.courses', 'courses')
        .leftJoinAndSelect('courses.exams', 'exams')
        .leftJoinAndSelect('exams.examActivityStat', 'eStat')
        .leftJoinAndSelect('eStat.questionActivityStat', 'qStat')
        .leftJoinAndSelect('qStat.stemActivityStat', 'sStat')
        .where('userEP.id = :id', { id: stuId })
        .andWhere('courses.courseId = :courseId', { courseId: courseId })
        .getMany()
    );

    if (err) throw new InternalServerErrorException();
    return userExamProfile;
  }
}
