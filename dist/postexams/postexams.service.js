"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const _ = require("lodash");
const courses_service_1 = require("../courses/courses.service");
const courseBasedExamProfile_repository_1 = require("../exams/courseBasedExamProfile.repository");
const courseBasedProfile_repository_1 = require("../exams/courseBasedProfile.repository");
const coursesProfile_repository_1 = require("../exams/coursesProfile.repository");
const exam_entity_1 = require("../exams/exam.entity");
const exam_model_1 = require("../exams/exam.model");
const exams_service_1 = require("../exams/exams.service");
const profie_repository_1 = require("../exams/profie.repository");
const profile_entity_1 = require("../exams/profile.entity");
const question_model_1 = require("../questions/question.model");
const question_repository_1 = require("../questions/question.repository");
const userExamprofile_service_1 = require("../userExamProfile/userExamprofile.service");
const users_service_1 = require("../users/users.service");
const utils_1 = require("../utils/utils");
const typeorm_2 = require("typeorm");
const moment = require('moment');
let PostexamsService = class PostexamsService {
    constructor(usersService, examProfileRepository, questionRepository, coursesProfileRepository, courseBasedProfileRepository, courseBasedExamProfileRepository, examService, courseService, userExamProfileService) {
        this.usersService = usersService;
        this.examProfileRepository = examProfileRepository;
        this.questionRepository = questionRepository;
        this.coursesProfileRepository = coursesProfileRepository;
        this.courseBasedProfileRepository = courseBasedProfileRepository;
        this.courseBasedExamProfileRepository = courseBasedExamProfileRepository;
        this.examService = examService;
        this.courseService = courseService;
        this.userExamProfileService = userExamProfileService;
        this.totalScore = 0;
        this.totalPenaltyMark = 0;
    }
    async postExamTasking(getAnswersDto, answersByStudent, user) {
        const { examId, timeTakenToComplete, questionIdsByOrder } = getAnswersDto;
        const exam = await this.examService.findExamById(examId);
        let profile = await this.examService.findProfileByUserEmail(user.email);
        let examStat = {
            id: null,
            title: '',
            type: null,
            attemptNumbers: null,
            averageScore: 0,
            totalMark: null,
            firstAttemptTime: null,
            lastAttemptTime: null,
        };
        this.singleQuestionMark = exam.singleQuestionMark;
        this.questionStemLength = exam.questionStemLength;
        this.singleStemMark = exam.singleStemMark;
        this.penaltyMark = exam.penaltyMark;
        this.timeLimit = exam.timeLimit;
        this.totalMark = Math.ceil(this.singleQuestionMark * exam.questions.length);
        if (!profile) {
            profile = new profile_entity_1.Profile();
            examStat.examId = examId;
            examStat.examTitle = exam.title;
            examStat.examType = exam.type;
            examStat.attemptNumbers = 1;
            examStat.totalMark = this.totalMark;
            examStat.firstAttemptTime = moment().format('YYYY-MM-DD HH:mm:ss');
            examStat.lastAttemptTime = moment().format('YYYY-MM-DD HH:mm:ss');
            profile.user = user.email;
            profile.exams = [];
        }
        else {
            [examStat] = profile.exams.filter((exam) => exam.examId === +examId);
            if (!examStat) {
                examStat = {
                    examId: +examId,
                    examTitle: exam.title,
                    examType: exam.type,
                    attemptNumbers: 1,
                    totalMark: this.totalMark,
                    firstAttemptTime: moment().format('YYYY-MM-DD HH:mm:ss'),
                    lastAttemptTime: moment().format('YYYY-MM-DD HH:mm:ss'),
                    averageScore: 0,
                };
            }
            else {
                examStat.totalMark = this.totalMark;
                examStat.attemptNumbers++;
                examStat.lastAttemptTime = moment().format('YYYY-MM-DD HH:mm:ss');
            }
        }
        answersByStudent = answersByStudent.filter((v) => v.stems.length > 0);
        answersByStudent = _.sortBy(answersByStudent, (o) => +o.id);
        const questionIds = answersByStudent.map((v) => v.id);
        const [err, questions] = await utils_1.to(this.questionRepository.find({
            where: { id: typeorm_2.In(questionIdsByOrder) },
        }));
        const answeredQuestions = questions.filter((question) => questionIds.includes(question.id.toString()));
        const nonAnsweredQuestions = questions.filter((question) => !questionIds.includes(question.id.toString()));
        if (err)
            throw new common_1.InternalServerErrorException();
        let resultArray = [];
        answeredQuestions.map((question, index) => {
            const particulars = {
                id: question.id,
                qText: question.qText,
                stems: question.stems,
                generalFeedback: question.generalFeedback,
                result: { mark: 0 },
            };
            if (question.qType === question_model_1.QType.Matrix) {
                particulars.result = this.matrixManipulator(this.answersExtractor(question), answersByStudent[index]);
            }
            else if (question.qType === question_model_1.QType.singleBestAnswer) {
                particulars.result = this.sbaManipulator(this.answersExtractor(question), answersByStudent[index]);
            }
            resultArray.push(particulars);
        });
        examStat.averageScore = this.totalScore;
        if (examStat.attemptNumbers == 1)
            profile.exams.push(examStat);
        const [error, result] = await utils_1.to(profile.save());
        if (error)
            throw new common_1.InternalServerErrorException();
        const totalScorePercentage = +(this.totalScore / this.totalMark).toFixed(2) * 100;
        nonAnsweredQuestions.forEach((question) => {
            const particulars = {
                id: question.id,
                qText: question.qText,
                stems: question.stems,
                generalFeedback: question.generalFeedback,
                result: { mark: 0 },
            };
            if (question.qType === question_model_1.QType.Matrix) {
                particulars.result = { stemResult: [question_model_1.QType.Matrix], mark: 0 };
            }
            else if (question.qType === question_model_1.QType.singleBestAnswer) {
                particulars.result = {
                    stemResult: [question_model_1.QType.singleBestAnswer, +question.stems[0].aStem[0]],
                    mark: 0,
                };
            }
            resultArray.push(particulars);
        });
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
    async postExamTaskingByCoursesProfile(getAnswersDto, answersByStudent, user) {
        const { examId, courseId, timeTakenToComplete, questionIdsByOrder, } = getAnswersDto;
        const [examError, exam] = await utils_1.to(this.examService.findExamById(examId));
        if (examError)
            throw new common_1.HttpException('Problems at retriving Exam', common_1.HttpStatus.SERVICE_UNAVAILABLE);
        const [courseError, course] = await utils_1.to(this.courseService.findCourseById(courseId));
        if (courseError)
            throw new common_1.HttpException('Problems at retriving Course', common_1.HttpStatus.SERVICE_UNAVAILABLE);
        this.singleQuestionMark = exam.singleQuestionMark;
        this.questionStemLength = exam.questionStemLength;
        this.singleStemMark = exam.singleStemMark;
        this.penaltyMark = exam.penaltyMark;
        this.timeLimit = exam.timeLimit;
        this.totalMark = Math.ceil(this.singleQuestionMark * exam.questions.length);
        answersByStudent = answersByStudent.filter((v) => v.stems.length > 0);
        answersByStudent = _.sortBy(answersByStudent, (o) => +o.id);
        const questionIds = answersByStudent.map((v) => v.id);
        const [err, questions] = await utils_1.to(this.questionRepository.find({
            where: { id: typeorm_2.In(questionIdsByOrder) },
        }));
        const answeredQuestions = questions.filter((question) => questionIds.includes(question.id.toString()));
        const nonAnsweredQuestions = questions.filter((question) => !questionIds.includes(question.id.toString()));
        if (err)
            throw new common_1.InternalServerErrorException();
        let resultArray = [];
        answeredQuestions.map((question, index) => {
            const particulars = {
                id: question.id,
                qText: question.qText,
                stems: question.stems,
                generalFeedback: question.generalFeedback,
                result: { mark: 0 },
            };
            if (question.qType === question_model_1.QType.Matrix) {
                particulars.result = this.matrixManipulator(this.answersExtractor(question), answersByStudent[index]);
            }
            else if (question.qType === question_model_1.QType.singleBestAnswer) {
                particulars.result = this.sbaManipulator(this.answersExtractor(question), answersByStudent[index]);
            }
            resultArray.push(particulars);
        });
        await this.userExamProfileService.manipulateProfile(user, {
            course,
            exam,
            score: this.totalScore,
        });
        const totalScorePercentage = +(this.totalScore / this.totalMark).toFixed(2) * 100;
        nonAnsweredQuestions.forEach((question) => {
            const particulars = {
                id: question.id,
                qText: question.qText,
                stems: question.stems,
                generalFeedback: question.generalFeedback,
                result: { mark: 0 },
            };
            if (question.qType === question_model_1.QType.Matrix) {
                particulars.result = { stemResult: [question_model_1.QType.Matrix], mark: 0 };
            }
            else if (question.qType === question_model_1.QType.singleBestAnswer) {
                particulars.result = {
                    stemResult: [question_model_1.QType.singleBestAnswer, +question.stems[0].aStem[0]],
                    mark: 0,
                };
            }
            resultArray.push(particulars);
        });
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
    async postExamTaskingForFree(getAnswersDto, answersByStudent) {
        const { examId, timeTakenToComplete, questionIdsByOrder } = getAnswersDto;
        const exam = await this.examService.findExamById(examId);
        this.singleQuestionMark = exam.singleQuestionMark;
        this.questionStemLength = exam.questionStemLength;
        this.singleStemMark = exam.singleStemMark;
        this.penaltyMark = exam.penaltyMark;
        this.timeLimit = exam.timeLimit;
        this.totalMark = Math.ceil(this.singleQuestionMark * exam.questions.length);
        answersByStudent = answersByStudent.filter((v) => v.stems.length > 0);
        answersByStudent = _.sortBy(answersByStudent, (o) => +o.id);
        const questionIds = answersByStudent.map((v) => v.id);
        const [err, questions] = await utils_1.to(this.questionRepository.find({
            where: { id: typeorm_2.In(questionIds) },
            order: { id: 'ASC' },
        }));
        if (err)
            throw new common_1.InternalServerErrorException();
        const resultArray = [];
        questions.map((question, index) => {
            const particulars = {
                id: question.id,
                qText: question.qText,
                stems: question.stems,
                generalFeedback: question.generalFeedback,
                result: { mark: 0 },
            };
            if (question.qType === question_model_1.QType.Matrix) {
                particulars.result = this.matrixManipulator(this.answersExtractor(question), answersByStudent[index]);
            }
            else if (question.qType === question_model_1.QType.singleBestAnswer) {
                particulars.result = this.sbaManipulator(this.answersExtractor(question), answersByStudent[index]);
            }
            resultArray.push(particulars);
        });
        const totalScorePercentage = +(this.totalScore / this.totalMark).toFixed(2) * 100;
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
    answersExtractor(question) {
        return question.stems.map((stem) => {
            return stem.aStem;
        });
    }
    async examRankById(id) {
        const exam = await this.examService.findExamById(id);
        const profiles = await this.examService.findAllProfile();
        let profileCurtailedByExamId = await Promise.all(profiles.map(async (profile) => ({
            user: await this.usersService.findOneUser(profile.user, true),
            exam: profile.exams
                .filter((exam) => exam.examId.toString() === id)
                .map((exam) => ({
                score: exam.averageScore,
                attempts: exam.attemptNumbers,
                totalMark: exam.totalMark,
            })),
        })));
        profileCurtailedByExamId = _.sortBy(profileCurtailedByExamId, (o) => o.exam.length > 0 ? o.exam[0].score : []);
        return { exam, rank: profileCurtailedByExamId.reverse() };
    }
    async examRankByIdConstrainByCourseId(examId, courseId) {
        let rankProfiles = [];
        const [error, courseProfiles] = await utils_1.to(this.userExamProfileService.findAllUserCourseProfilesByCourseId(courseId));
        if (error)
            throw new common_1.InternalServerErrorException(error);
        const [errorExam, exam] = await utils_1.to(this.examService.findExamById(examId));
        if (errorExam)
            throw new common_1.InternalServerErrorException(errorExam);
        if (courseProfiles) {
            for (const courseProfile of courseProfiles) {
                const [examProfile] = courseProfile.exams.filter((exam) => exam.examId === +examId);
                const [nameError, user] = await utils_1.to(this.usersService.findOneUserById(courseProfile.userExamProfile.id, true));
                if (nameError)
                    throw new common_1.InternalServerErrorException(nameError);
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
        rankProfiles = _.sortBy(rankProfiles, (o) => o.exam.length > 0 ? o.exam[0].score : []).reverse();
        return {
            exam,
            rank: rankProfiles,
        };
    }
    matrixManipulator(serverAns, studentAns) {
        console.log(serverAns, studentAns);
        const stemValidatedArray = serverAns.map((v, i) => {
            if (studentAns)
                if (v === studentAns.stems[i])
                    return exam_entity_1.answerStatus.True;
                else {
                    if (typeof studentAns.stems[i] === 'string')
                        return exam_entity_1.answerStatus.False;
                    return exam_entity_1.answerStatus.NotAnswered;
                }
        });
        const correct = stemValidatedArray.filter((v) => v === exam_entity_1.answerStatus.True)
            .length;
        const wrong = stemValidatedArray.filter((v) => v === exam_entity_1.answerStatus.False)
            .length;
        const mark = +(+(+this.singleStemMark * correct).toFixed(2) -
            Number((this.penaltyMark * wrong).toFixed(2))).toFixed(2);
        this.totalScore += mark;
        this.totalPenaltyMark += +(this.penaltyMark * wrong).toFixed(2);
        return { stemResult: [question_model_1.QType.Matrix, ...stemValidatedArray], mark };
    }
    sbaManipulator(serverAns, studentAns) {
        const mark = studentAns.stems[0] === serverAns[0]
            ? this.singleQuestionMark
            : this.penaltyMark === 0
                ? 0
                : -(this.penaltyMark * this.questionStemLength);
        this.totalScore += +mark.toFixed(2);
        if (mark < 0) {
            this.totalPenaltyMark += +(this.penaltyMark * this.questionStemLength).toFixed(2);
        }
        console.log(+studentAns.stems[0], studentAns.stems[0]);
        return {
            stemResult: [question_model_1.QType.singleBestAnswer, +serverAns[0], +studentAns.stems[0]],
            mark,
        };
    }
};
PostexamsService = __decorate([
    common_1.Injectable({ scope: common_1.Scope.REQUEST }),
    __param(1, typeorm_1.InjectRepository(profie_repository_1.ExamProfileRepository)),
    __param(2, typeorm_1.InjectRepository(question_repository_1.QuestionRepository)),
    __param(3, typeorm_1.InjectRepository(question_repository_1.QuestionRepository)),
    __param(4, typeorm_1.InjectRepository(question_repository_1.QuestionRepository)),
    __param(5, typeorm_1.InjectRepository(courseBasedExamProfile_repository_1.CourseBasedExamProfileRepository)),
    __metadata("design:paramtypes", [users_service_1.UsersService,
        profie_repository_1.ExamProfileRepository,
        question_repository_1.QuestionRepository,
        coursesProfile_repository_1.CoursesProfileRepository,
        courseBasedProfile_repository_1.CourseBasedProfileRepository,
        courseBasedExamProfile_repository_1.CourseBasedExamProfileRepository,
        exams_service_1.ExamsService,
        courses_service_1.CoursesService,
        userExamprofile_service_1.UserExamProfileService])
], PostexamsService);
exports.PostexamsService = PostexamsService;
//# sourceMappingURL=postexams.service.js.map