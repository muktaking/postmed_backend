import {
  Injectable,
  InternalServerErrorException,
  Scope,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import * as _ from "lodash";
import { answerStatus } from "src/exams/exam.entity";
import { Exam } from "src/exams/exam.model";
import { ExamsService } from "src/exams/exams.service";
import { ExamProfileRepository } from "src/exams/profie.repository";
import { ExamStat, Profile } from "src/exams/profile.entity";
import { QType, Question } from "src/questions/question.model";
import { QuestionRepository } from "src/questions/question.repository";
import { UsersService } from "src/users/users.service";
import { to } from "src/utils/utils";
import { In } from "typeorm";
import { GetAnswersDto } from "./dto/get-answers.dto";
import { Particulars, Result, StudentAnswer } from "./postexam.model";
const moment = require("moment");

@Injectable({ scope: Scope.REQUEST })
export class PostexamsService {
  constructor(
    private readonly usersService: UsersService,
    @InjectRepository(ExamProfileRepository)
    private examProfileRepository: ExamProfileRepository,
    @InjectRepository(QuestionRepository)
    private questionRepository: QuestionRepository,
    private readonly examService: ExamsService
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

  //an object should pass from front--> {examId,[],timeTakenToComplete,user}

  async postExamTasking(
    getAnswersDto: GetAnswersDto,
    answersByStudent: Array<StudentAnswer>,
    user
  ) {
    /// answersByStudent[{id,stems[],type}] // stems[0/1/undefined]
    const { examId, timeTakenToComplete, questionIdsByOrder } = getAnswersDto;

    const exam: Exam = await this.examService.findExamById(examId); //1. Get the exam details by id
    let profile: Profile = await this.examService.findProfileByUserEmail(
      //2. get the exam profile of user
      user.email
      //examId
    );

    let examStat: ExamStat | any = {
      // creating a null exam stat
      id: null,
      title: "",
      type: null,
      attemptNumbers: null,
      averageScore: 0,
      totalMark: null,
      firstAttemptTime: null,
      lastAttemptTime: null,
    };
    // populate some Global variables
    this.singleQuestionMark = exam.singleQuestionMark;
    this.questionStemLength = exam.questionStemLength;
    this.singleStemMark = exam.singleStemMark;
    this.penaltyMark = exam.penaltyMark;
    this.timeLimit = exam.timeLimit;
    this.totalMark = Math.ceil(this.singleQuestionMark * exam.questions.length); // simple math
    //this.totalScore = 0;

    //exam profile starts

    if (!profile) {
      // if user has no profile && has no previous attempt to this exam
      profile = new Profile(); // then, create a new exam profile & exam stat
      examStat.examId = examId;
      examStat.examTitle = exam.title;
      examStat.examType = exam.type;
      examStat.attemptNumbers = 1;
      examStat.totalMark = this.totalMark;
      examStat.firstAttemptTime = moment().format("YYYY-MM-DD HH:mm:ss");
      examStat.lastAttemptTime = moment().format("YYYY-MM-DD HH:mm:ss");
      profile.user = user.email;
      profile.exams = [];
      // average score have to add later, so exams key of profile will be added later
    } else {
      [examStat] = profile.exams.filter((exam) => exam.examId === +examId); // if user previously attempted
      if (!examStat) {
        examStat = {
          examId: +examId,
          examTitle: exam.title,
          examType: exam.type,
          attemptNumbers: 1,
          totalMark: this.totalMark,
          firstAttemptTime: moment().format("YYYY-MM-DD HH:mm:ss"),
          lastAttemptTime: moment().format("YYYY-MM-DD HH:mm:ss"),
          averageScore: 0,
        };
      } else {
        examStat.totalMark = this.totalMark;
        examStat.attemptNumbers++;
        examStat.lastAttemptTime = moment().format("YYYY-MM-DD HH:mm:ss");
      }
    }

    //answer manipulation is started here
    // console.log(answersByStudent);
    answersByStudent = answersByStudent.filter((v) => v.stems.length > 0); //the empty stems answer object are rejected
    answersByStudent = _.sortBy(answersByStudent, (o) => o.id); // sort answer by ids,
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
          answersByStudent[index]
        );
      } else if (question.qType === QType.singleBestAnswer) {
        particulars.result = this.sbaManipulator(
          this.answersExtractor(question),
          answersByStudent[index]
        );
      }
      resultArray.push(particulars);
    });

    examStat.averageScore = this.totalScore;

    if (examStat.attemptNumbers == 1) profile.exams.push(examStat);

    const [error, result] = await to(profile.save());

    if (error) throw new InternalServerErrorException();

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

    return {
      resultArray,
      totalMark: this.totalMark,
      totalScore: this.totalScore,
      totalPenaltyMark: this.totalPenaltyMark,
      totalScorePercentage,
      timeTakenToComplete,
    };
  }

  async postExamTaskingForFree(
    getAnswersDto: GetAnswersDto,
    answersByStudent: Array<StudentAnswer>
  ) {
    /// answersByStudent[{id,stems[],type}] // stems[0/1/undefined]
    const { examId, timeTakenToComplete, questionIdsByOrder } = getAnswersDto;
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
        order: { id: "ASC" },
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
        particulars.result = this.matrixManipulator(
          this.answersExtractor(question),
          answersByStudent[index]
        );
      } else if (question.qType === QType.singleBestAnswer) {
        particulars.result = this.sbaManipulator(
          this.answersExtractor(question),
          answersByStudent[index]
        );
      }
      resultArray.push(particulars);
    });

    const totalScorePercentage =
      +(this.totalScore / this.totalMark).toFixed(2) * 100;
    return {
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

  async examRankById(id: string) {
    const exam = await this.examService.findExamById(id);
    const profiles: Profile[] = await this.examService.findAllProfile();
    let profileCurtailedByExamId = await Promise.all(
      profiles.map(async (profile) => ({
        user: await this.usersService.findOneUser(profile.user, true),
        exam: profile.exams
          .filter((exam) => exam.examId.toString() === id)
          .map((exam) => ({
            score: exam.averageScore,
            attempts: exam.attemptNumbers,
            totalMark: exam.totalMark,
          })),
      }))
    );
    profileCurtailedByExamId = _.sortBy(profileCurtailedByExamId, (o) =>
      o.exam.length > 0 ? o.exam[0].score : []
    );

    return { exam, rank: profileCurtailedByExamId.reverse() };
  }

  //ends

  //starts
  private matrixManipulator(
    serverAns: Array<string>,
    studentAns: StudentAnswer
  ): Result {
    const stemValidatedArray = serverAns.map((v, i) => {
      if (studentAns)
        if (v === studentAns.stems[i]) return answerStatus.True;
        else {
          if (typeof studentAns.stems[i] === "string")
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

  //ends

  //starts
  private sbaManipulator(
    serverAns: Array<string>,
    studentAns: StudentAnswer
  ): Result {
    console.log(studentAns);
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
