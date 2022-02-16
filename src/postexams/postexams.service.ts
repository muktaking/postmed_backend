import {
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  Scope,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as _ from 'lodash';
import { CoursesService } from 'src/courses/courses.service';
import { answerStatus } from 'src/exams/exam.entity';
import { Exam } from 'src/exams/exam.model';
import { ExamsService } from 'src/exams/exams.service';
import { QType, Question } from 'src/questions/question.model';
import { QuestionRepository } from 'src/questions/question.repository';
import { ExamActivityStatRepository } from 'src/userExamProfile/examActivityStat.repository';
import { QuestionActivityStat } from 'src/userExamProfile/questionActivityStat.entity';
import { QuestionActivityStatRepository } from 'src/userExamProfile/questionActivityStat.repository';
import { StemActivityStatRepository } from 'src/userExamProfile/stemActivityStat.repository';
import { UserExamProfileService } from 'src/userExamProfile/userExamprofile.service';
import { UsersService } from 'src/users/users.service';
import { to } from 'src/utils/utils';
import { In } from 'typeorm';
import { GetAnswersDto, GetFreeAnswersDto } from './dto/get-answers.dto';
import { Particulars, Result, StudentAnswer } from './postexam.model';
const moment = require('moment');

@Injectable({ scope: Scope.REQUEST })
export class PostexamsService {
  constructor(
    private readonly usersService: UsersService,
    @InjectRepository(QuestionRepository)
    private questionRepository: QuestionRepository,
    @InjectRepository(ExamActivityStatRepository)
    private examActivityStatRepository: ExamActivityStatRepository,
    @InjectRepository(QuestionActivityStatRepository)
    private questionActivityStatRepository: QuestionActivityStatRepository,
    @InjectRepository(StemActivityStatRepository)
    private stemActivityStatRepository: StemActivityStatRepository,
    private readonly examService: ExamsService,
    private readonly courseService: CoursesService,
    private readonly userExamProfileService: UserExamProfileService
  ) {}

  //Gobal
  private singleQuestionMark: number; //mark of each questions in a paper
  private questionStemLength: number;
  private singleStemMark: number; //mark of each stem in a stem
  private penaltyMark: number; // mark for each wrong stem
  private timeLimit: number;
  private totalMark: number; // total mark for the exam
  private totalScore: number = 0; // examinee aqired score
  private totalPenaltyMark = 0;
  private totalWrongScore = 0;
  private totalWrongStems = 0;
  private totalRightStems = 0;
  private totalRightSbaQuestions = 0;
  private totalWrongSbaQuestions = 0;

  //an object should pass from front--> {examId,[],timeTakenToComplete,user}

  async postExamTaskingByCoursesProfile(
    getAnswersDto: GetAnswersDto,
    answersByStudent: Array<StudentAnswer>,
    user
  ) {
    /// answersByStudent[{id,stems[],type}] // stems[0/1/undefined]
    const {
      examId,
      courseId,
      timeTakenToComplete,
      questionIdsByOrder,
    } = getAnswersDto;

    const examActivityStat = this.examActivityStatRepository.create({
      questionActivityStat: [],
    });

    const [examError, exam] = await to(this.examService.findExamById(examId)); //1. Get the exam details by id
    if (examError)
      throw new HttpException(
        'Problems at retriving Exam',
        HttpStatus.SERVICE_UNAVAILABLE
      );
    const [courseError, course] = await to(
      this.courseService.findCourseById(courseId)
    );

    if (courseError)
      throw new HttpException(
        'Problems at retriving Course',
        HttpStatus.SERVICE_UNAVAILABLE
      );

    // populate some Global variables
    this.singleQuestionMark = exam.singleQuestionMark;
    this.questionStemLength = exam.questionStemLength;
    this.singleStemMark = exam.singleStemMark;
    this.penaltyMark = exam.penaltyMark;
    this.timeLimit = exam.timeLimit;
    this.totalMark = Math.ceil(this.singleQuestionMark * exam.questions.length); // simple math
    //this.totalScore = 0;

    //answer manipulation is started here
    // console.log(answersByStudent);
    answersByStudent = answersByStudent.filter((v) => v.stems.length > 0); //the empty stems answer object are rejected
    answersByStudent = _.sortBy(answersByStudent, (o) => +o.id); // sort answer by ids,
    // answersByStudent is sorted by id. Because we will match these answers with database saved answer that is also
    //sorted by id
    const questionIds = answersByStudent.map((v) => v.id); // get the questions ids that is also answer id

    const [err, questions] = await to(
      //fetch the questions
      this.questionRepository.find({
        //where: { id: In(questionIds.map((e) => +e)) },
        where: { id: In(questionIdsByOrder) },
      })
    );

    const answeredQuestions = questions.filter((question) =>
      questionIds.includes(question.id.toString())
    );

    const nonAnsweredQuestions = questions.filter(
      (question) => !questionIds.includes(question.id.toString())
    );

    if (err) throw new InternalServerErrorException();

    //const answersByServer = this.answersExtractor(questions);

    let resultArray: Array<Particulars> = []; //result array will hold the total result

    //main algorithm starts

    answeredQuestions.map((question, index) => {
      // mapping questions to validate answer and make marksheet

      const questionActivityStat = this.questionActivityStatRepository.create({
        questionId: question.id,
        stemActivityStat: [],
      });

      examActivityStat.questionActivityStat.push(questionActivityStat);

      const particulars: Particulars = {
        // particulars is the block of data passed to forntend to show result
        id: question.id,
        qText: question.qText,
        stems: question.stems,
        generalFeedback: question.generalFeedback,
        result: { mark: 0 },
      };

      if (question.qType === QType.Matrix) {
        particulars.result = this.matrixManipulator(
          this.answersExtractor(question),
          answersByStudent[index],
          questionActivityStat
        );
      } else if (question.qType === QType.singleBestAnswer) {
        particulars.result = this.sbaManipulator(
          this.answersExtractor(question),
          answersByStudent[index],
          questionActivityStat
        );
      }
      resultArray.push(particulars);
    });

    examActivityStat.totalScore = this.totalScore;
    examActivityStat.totalPenaltyScore = this.penaltyMark;
    examActivityStat.totalWrongScore = this.totalWrongScore;
    examActivityStat.totalRightStems = this.totalRightStems;
    examActivityStat.totalWrongStems = this.totalWrongStems;
    examActivityStat.totalRightSbaQuestions = this.totalRightSbaQuestions;
    examActivityStat.totalWrongSbaQuestions = this.totalWrongSbaQuestions;

    const [userExamProfileError, userExamProfileRes] = await to(
      this.userExamProfileService.manipulateProfile(user, {
        course,
        exam,
        score: this.totalScore,
        examActivityStat,
      })
    );
    //console.log(userExamProfileError);
    if (userExamProfileError)
      throw new InternalServerErrorException(userExamProfileError.message);

    const totalScorePercentage =
      +(this.totalScore / this.totalMark).toFixed(2) * 100;

    nonAnsweredQuestions.forEach((question) => {
      const particulars: Particulars = {
        // particulars is the block of data passed to forntend to show result
        id: question.id,
        qText: question.qText,
        stems: question.stems,
        generalFeedback: question.generalFeedback,
        result: { mark: 0 },
      };

      if (question.qType === QType.Matrix) {
        particulars.result = { stemResult: [QType.Matrix], mark: 0 };
      } else if (question.qType === QType.singleBestAnswer) {
        particulars.result = {
          stemResult: [QType.singleBestAnswer, +question.stems[0].aStem[0]],
          mark: 0,
        };
      }
      resultArray.push(particulars);
    });
    resultArray.sort(
      (a, b) =>
        questionIdsByOrder.indexOf(+a.id) - questionIdsByOrder.indexOf(+b.id)
    );

    return {
      examId,
      resultArray,
      totalMark: this.totalMark,
      totalScore: this.totalScore,
      totalPenaltyMark: this.totalPenaltyMark,
      totalScorePercentage,
      timeTakenToComplete,
    };
  }

  async postExamTaskingForFree(
    getFreeAnswersDto: GetFreeAnswersDto,
    answersByStudent: Array<StudentAnswer>
  ) {
    /// answersByStudent[{id,stems[],type}] // stems[0/1/undefined]
    const {
      examId,
      timeTakenToComplete,
      questionIdsByOrder,
    } = getFreeAnswersDto;
    const exam: Exam = await this.examService.findExamById(examId); //1. Get the exam details by id

    // populate some Global variables
    this.singleQuestionMark = exam.singleQuestionMark;
    this.questionStemLength = exam.questionStemLength;
    this.singleStemMark = exam.singleStemMark;
    this.penaltyMark = exam.penaltyMark;
    this.timeLimit = exam.timeLimit;
    this.totalMark = Math.ceil(this.singleQuestionMark * exam.questions.length); // simple math
    //this.totalScore = 0;

    //answer manipulation is started here
    // console.log(answersByStudent);
    answersByStudent = answersByStudent.filter((v) => v.stems.length > 0); //the empty stems answer object are rejected
    answersByStudent = _.sortBy(answersByStudent, (o) => +o.id); // sort answer by ids,
    // answersByStudent is sorted by id. Because we will match these answers with database saved answer that is also
    //sorted by id
    const questionIds = answersByStudent.map((v) => v.id); // get the questions ids that is also answer id

    const [err, questions] = await to(
      //fetch the questions
      this.questionRepository.find({
        where: { id: In(questionIds) },
        order: { id: 'ASC' },
      })
    );
    if (err) throw new InternalServerErrorException();

    //const answersByServer = this.answersExtractor(questions);

    const resultArray: Array<Particulars> = []; //result array will hold the total result

    //main algorithm starts
    questions.map((question, index) => {
      // mapping questions to validate answer and make marksheet
      const particulars: Particulars = {
        // particulars is the block of data passed to forntend to show result
        id: question.id,
        qText: question.qText,
        stems: question.stems,
        generalFeedback: question.generalFeedback,
        result: { mark: 0 },
      };
      if (question.qType === QType.Matrix) {
        particulars.result = this.matrixManipulatorForFree(
          this.answersExtractor(question),
          answersByStudent[index]
        );
      } else if (question.qType === QType.singleBestAnswer) {
        particulars.result = this.sbaManipulatorForFree(
          this.answersExtractor(question),
          answersByStudent[index]
        );
      }
      resultArray.push(particulars);
    });

    const totalScorePercentage =
      +(this.totalScore / this.totalMark).toFixed(2) * 100;

    return {
      examId,
      resultArray,
      totalMark: this.totalMark,
      totalScore: this.totalScore,
      totalPenaltyMark: this.totalPenaltyMark,
      totalScorePercentage,
      timeTakenToComplete,
    };
  }

  private answersExtractor(question: Question): Array<string> {
    return question.stems.map((stem) => {
      return stem.aStem;
    });
  }

  async examRankByIdConstrainByCourseId(examId: string, courseId: string) {
    let rankProfiles = [];
    const [error, courseProfiles] = await to(
      this.userExamProfileService.findAllUserCourseProfilesByCourseId(courseId)
    );
    if (error) throw new InternalServerErrorException(error);

    const [errorExam, exam] = await to(this.examService.findExamById(examId));
    if (errorExam) throw new InternalServerErrorException(errorExam);

    if (courseProfiles) {
      for (const courseProfile of courseProfiles) {
        const [examProfile] = courseProfile.exams.filter(
          (exam) => exam.examId === +examId
        );
        const [nameError, user] = await to(
          this.usersService.findOneUserById(
            courseProfile.userExamProfile.id,
            true
          )
        );
        if (nameError) throw new InternalServerErrorException(nameError);
        //console.log(user);
        if (examProfile) {
          rankProfiles.push({
            user: user,
            exam: [
              {
                score: examProfile.score[0],
                attempts: examProfile.attemptNumbers,
                totalMark: examProfile.totalMark,
              },
            ],
          });
        }
      }
    }

    rankProfiles = _.sortBy(rankProfiles, (o) =>
      o.exam.length > 0 ? o.exam[0].score : []
    ).reverse();

    return {
      exam,
      rank: rankProfiles,
    };
  }

  //ends

  //starts
  private matrixManipulator(
    serverAns: Array<string>,
    studentAns: StudentAnswer,
    questionActivityStat: QuestionActivityStat
  ): Result {
    //console.log(serverAns, studentAns);
    const stemValidatedArray = serverAns.map((v, i) => {
      const stemActivityStat = this.stemActivityStatRepository.create({
        aStem: studentAns.stems[i],
      });
      questionActivityStat.stemActivityStat.push(stemActivityStat);

      if (studentAns)
        if (v === studentAns.stems[i]) {
          stemActivityStat.aStemStatus = answerStatus.True.toString();
          return answerStatus.True;
        } else {
          if (typeof studentAns.stems[i] === 'string') {
            stemActivityStat.aStemStatus = answerStatus.False.toString();
            return answerStatus.False;
          }
          return answerStatus.NotAnswered;
        }
      //return studentAns.stems[i] !== null ? v === studentAns.stems[i] : false;
    });

    const correct = stemValidatedArray.filter((v) => v === answerStatus.True)
      .length;
    const wrong = stemValidatedArray.filter((v) => v === answerStatus.False)
      .length;
    const mark = +(
      +(+this.singleStemMark * correct).toFixed(2) -
      Number((this.penaltyMark * wrong).toFixed(2))
    ).toFixed(2);
    this.totalScore += mark;
    this.totalPenaltyMark += +(this.penaltyMark * wrong).toFixed(2);
    this.totalWrongScore += +(+this.singleStemMark * wrong).toFixed(2);
    this.totalWrongStems += wrong;
    this.totalRightStems += correct;

    questionActivityStat.score = mark;
    questionActivityStat.wrongScore = +(+this.singleStemMark * wrong).toFixed(
      2
    );
    questionActivityStat.penaltyScore = Number(
      (this.penaltyMark * wrong).toFixed(2)
    );
    questionActivityStat.rightStems = correct;
    questionActivityStat.wrongStems = wrong;

    return { stemResult: [QType.Matrix, ...stemValidatedArray], mark }; // [Qtype,answerStatus...]
  }

  //ends

  private matrixManipulatorForFree(
    serverAns: Array<string>,
    studentAns: StudentAnswer
  ): Result {
    //console.log(serverAns, studentAns);
    const stemValidatedArray = serverAns.map((v, i) => {
      if (studentAns)
        if (v === studentAns.stems[i]) return answerStatus.True;
        else {
          if (typeof studentAns.stems[i] === 'string')
            return answerStatus.False;
          return answerStatus.NotAnswered;
        }
      //return studentAns.stems[i] !== null ? v === studentAns.stems[i] : false;
    });

    const correct = stemValidatedArray.filter((v) => v === answerStatus.True)
      .length;
    const wrong = stemValidatedArray.filter((v) => v === answerStatus.False)
      .length;
    const mark = +(
      +(+this.singleStemMark * correct).toFixed(2) -
      Number((this.penaltyMark * wrong).toFixed(2))
    ).toFixed(2);
    this.totalScore += mark;
    this.totalPenaltyMark += +(this.penaltyMark * wrong).toFixed(2);

    return { stemResult: [QType.Matrix, ...stemValidatedArray], mark }; // [Qtype,answerStatus...]
  }

  //starts
  private sbaManipulator(
    serverAns: Array<string>,
    studentAns: StudentAnswer,
    questionActivityStat: QuestionActivityStat
  ): Result {
    //console.log(studentAns);
    const stemActivityStat = this.stemActivityStatRepository.create({
      aStem: studentAns.stems[0],
      aStemStatus: studentAns.stems[0] === serverAns[0] ? '1' : '0',
    });
    questionActivityStat.stemActivityStat.push(stemActivityStat);
    const mark =
      studentAns.stems[0] === serverAns[0]
        ? this.singleQuestionMark
        : this.penaltyMark === 0
        ? 0
        : -(this.penaltyMark * this.questionStemLength);

    this.totalScore += +mark.toFixed(2);

    if (mark < 0) {
      this.totalPenaltyMark += +(
        this.penaltyMark * this.questionStemLength
      ).toFixed(2);
    }

    this.totalWrongScore +=
      studentAns.stems[0] !== serverAns[0] ? this.singleQuestionMark : 0;

    this.totalWrongSbaQuestions += studentAns.stems[0] !== serverAns[0] ? 1 : 0;
    this.totalRightSbaQuestions += studentAns.stems[0] === serverAns[0] ? 1 : 0;

    questionActivityStat.score = mark;
    questionActivityStat.wrongScore =
      studentAns.stems[0] !== serverAns[0] ? this.singleQuestionMark : 0;
    questionActivityStat.penaltyScore = -(
      this.penaltyMark * this.questionStemLength
    );

    return {
      stemResult: [QType.singleBestAnswer, +serverAns[0], +studentAns.stems[0]], // [Qtype,number,number]
      mark,
    };
  }

  private sbaManipulatorForFree(
    serverAns: Array<string>,
    studentAns: StudentAnswer
  ): Result {
    //console.log(studentAns);
    const mark =
      studentAns.stems[0] === serverAns[0]
        ? this.singleQuestionMark
        : this.penaltyMark === 0
        ? 0
        : -(this.penaltyMark * this.questionStemLength);

    this.totalScore += +mark.toFixed(2);

    if (mark < 0) {
      this.totalPenaltyMark += +(
        this.penaltyMark * this.questionStemLength
      ).toFixed(2);
    }

    console.log(+studentAns.stems[0], studentAns.stems[0]);

    return {
      stemResult: [QType.singleBestAnswer, +serverAns[0], +studentAns.stems[0]], // [Qtype,number,number]
      mark,
    };
  }
}
