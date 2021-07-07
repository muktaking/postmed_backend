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
const shuffle = require('knuth-shuffle').knuthShuffle;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const _ = require("lodash");
const category_repository_1 = require("../categories/category.repository");
const question_repository_1 = require("../questions/question.repository");
const users_service_1 = require("../users/users.service");
const utils_1 = require("../utils/utils");
const typeorm_2 = require("typeorm");
const exam_entity_1 = require("./exam.entity");
const exam_repository_1 = require("./exam.repository");
const feedback_entity_1 = require("./feedback.entity");
const feedback_repository_1 = require("./feedback.repository");
const profie_repository_1 = require("./profie.repository");
const moment = require("moment");
let ExamsService = class ExamsService {
    constructor(usersService, questionRepository, categoryRepository, examRepository, examProfileRepository, feedbackRepository) {
        this.usersService = usersService;
        this.questionRepository = questionRepository;
        this.categoryRepository = categoryRepository;
        this.examRepository = examRepository;
        this.examProfileRepository = examProfileRepository;
        this.feedbackRepository = feedbackRepository;
        this.freeCategoryId = this.getFreeCategoryId();
        this.featuredCategoryId = this.getFeaturedCategoryId();
        this.oneTimeAttemptTypeBar = exam_entity_1.ExamType.Term;
    }
    async getFreeCategoryId() {
        const [err, category] = await utils_1.to(this.categoryRepository.findOne({ name: 'Free' }));
        if (err)
            throw new common_1.InternalServerErrorException();
        return category ? category.id : null;
    }
    async getFeaturedCategoryId() {
        const [err, category] = await utils_1.to(this.categoryRepository.findOne({ name: 'Featured' }));
        if (err)
            throw new common_1.InternalServerErrorException();
        return category ? category.id : null;
    }
    async findUserExamInfo(email) {
        const examTotalNumber = await this.findExamTotalNumber();
        const examTotalTaken = await this.findTotalExamTaken(email);
        const rank = await this.getUserRank(email);
        const totalStudent = await this.usersService.findAllStudentNumber();
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
    async findUserExamStat(email) {
        const examIds = [];
        const stat = [];
        const examTitles = [];
        const [err, profile] = await utils_1.to(this.examProfileRepository.findOne({
            user: email,
        }));
        if (err)
            throw new common_1.InternalServerErrorException();
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
        return { examTitles: examTitles.reverse(), stat: stat.reverse() };
    }
    async findTotalExamTaken(email) {
        const [err, profile] = await utils_1.to(this.examProfileRepository.findOne({
            user: email,
        }));
        if (err)
            throw new common_1.InternalServerErrorException();
        if (profile)
            return profile.exams.length;
        return 0;
    }
    async findExamTotalNumber() {
        const [err, examTotal] = await utils_1.to(this.examRepository.count());
        if (err)
            throw new common_1.InternalServerErrorException();
        return examTotal;
    }
    async findAllExams() {
        let [err, exams] = await utils_1.to(this.examRepository.find({
            select: [
                'id',
                'title',
                'type',
                'description',
                'startDate',
                'endDate',
            ],
            relations: ['categoryType'],
            order: { endDate: 'DESC' },
        }));
        if (err)
            throw new common_1.InternalServerErrorException();
        exams = {
            assignment: _.filter(exams, (e) => e.type === exam_entity_1.ExamType.Assignment),
            weekly: _.filter(exams, (e) => e.type === exam_entity_1.ExamType.Weekly),
            monthly: _.filter(exams, (e) => e.type === exam_entity_1.ExamType.Monthly),
            assesment: _.filter(exams, (e) => e.type === exam_entity_1.ExamType.Assesment),
            term: _.filter(exams, (e) => e.type === exam_entity_1.ExamType.Term),
            test: _.filter(exams, (e) => e.type === exam_entity_1.ExamType.Test),
            final: _.filter(exams, (e) => e.type === exam_entity_1.ExamType.Final),
        };
        return exams;
    }
    async findAllOldExams() {
        let [err, exams] = await utils_1.to(this.examRepository.find({
            select: [
                'id',
                'title',
                'type',
                'description',
                'startDate',
                'endDate',
            ],
            where: {
                endDate: typeorm_2.LessThan(new Date()),
            },
            relations: ['categoryType'],
            order: { endDate: 'DESC' },
        }));
        if (err)
            throw new common_1.InternalServerErrorException();
        exams = {
            assignment: _.filter(exams, (e) => e.type === exam_entity_1.ExamType.Assignment),
            weekly: _.filter(exams, (e) => e.type === exam_entity_1.ExamType.Weekly),
            monthly: _.filter(exams, (e) => e.type === exam_entity_1.ExamType.Monthly),
            assesment: _.filter(exams, (e) => e.type === exam_entity_1.ExamType.Assesment),
            term: _.filter(exams, (e) => e.type === exam_entity_1.ExamType.Term),
            test: _.filter(exams, (e) => e.type === exam_entity_1.ExamType.Test),
            final: _.filter(exams, (e) => e.type === exam_entity_1.ExamType.Final),
        };
        return exams;
    }
    async findAllRawExams() {
        let [err, exams] = await utils_1.to(this.examRepository.find({
            select: [
                'id',
                'title',
                'type',
                'description',
                'startDate',
                'endDate',
                'createdAt',
            ],
            relations: ['categoryType'],
            order: { createdAt: 'DESC' },
        }));
        if (err)
            throw new common_1.InternalServerErrorException();
        exams = {
            assignment: _.filter(exams, (e) => e.type === exam_entity_1.ExamType.Assignment),
            weekly: _.filter(exams, (e) => e.type === exam_entity_1.ExamType.Weekly),
            monthly: _.filter(exams, (e) => e.type === exam_entity_1.ExamType.Monthly),
            assesment: _.filter(exams, (e) => e.type === exam_entity_1.ExamType.Assesment),
            term: _.filter(exams, (e) => e.type === exam_entity_1.ExamType.Term),
            test: _.filter(exams, (e) => e.type === exam_entity_1.ExamType.Test),
            final: _.filter(exams, (e) => e.type === exam_entity_1.ExamType.Final),
        };
        return exams;
    }
    async findLatestExam() {
        const [err, [examLatest]] = await utils_1.to(this.examRepository.find({
            select: ['id', 'title', 'description', 'type', 'startDate', 'endDate'],
            relations: ['categoryType'],
            order: { startDate: 'DESC' },
            take: 1,
        }));
        if (err)
            throw new common_1.InternalServerErrorException();
        return examLatest;
    }
    async findCurrentExam() {
        const [err, [examLatest]] = await utils_1.to(this.examRepository.find({
            select: ['id', 'title', 'description', 'type', 'startDate', 'endDate'],
            where: {
                startDate: typeorm_2.LessThanOrEqual(new Date()),
                endDate: typeorm_2.MoreThanOrEqual(new Date()),
            },
            relations: ['categoryType'],
            order: { startDate: 'DESC' },
            take: 1,
        }));
        if (err)
            throw new common_1.InternalServerErrorException();
        return examLatest;
    }
    async getFeaturedExams() {
        const [err, exams] = await utils_1.to(this.examRepository.find({
            where: [
                {
                    categoryIds: typeorm_2.Like('%,' + (await this.featuredCategoryId).toString() + ',%'),
                    startDate: typeorm_2.LessThanOrEqual(new Date()),
                },
                {
                    categoryIds: typeorm_2.Like((await this.featuredCategoryId).toString() + ',%'),
                    startDate: typeorm_2.LessThanOrEqual(new Date()),
                },
                {
                    categoryIds: typeorm_2.Like('%,' + (await this.featuredCategoryId).toString()),
                    startDate: typeorm_2.LessThanOrEqual(new Date()),
                },
            ],
            relations: ['categoryType'],
            order: { endDate: 'DESC' },
            take: 4,
        }));
        if (err)
            throw new common_1.InternalServerErrorException();
        return exams;
    }
    async findExamById(id, constraintByCategoryType = null, email = null) {
        if (constraintByCategoryType) {
            const [err, exam] = await utils_1.to(this.examRepository.findOne(+id));
            if (err)
                throw new common_1.InternalServerErrorException();
            if (!exam) {
                throw new common_1.UnauthorizedException('Forbidden: Unauthorized Access');
            }
            else if (!exam.categoryIds.includes(constraintByCategoryType.toString())) {
                throw new common_1.UnauthorizedException(`Forbidden: Unauthorized Access`);
            }
            return exam;
        }
        const [err, exam] = await utils_1.to(this.examRepository.findOne(id));
        if (err)
            throw new common_1.InternalServerErrorException();
        if (email) {
            if (exam.type >= this.oneTimeAttemptTypeBar) {
                const [err1, profile] = await utils_1.to(this.examProfileRepository.findOne({
                    user: email,
                }));
                if (err1)
                    throw new common_1.InternalServerErrorException();
                const [examProfile] = profile.exams.filter((exam) => exam.examId === +id);
                if (examProfile) {
                    if (examProfile.attemptNumbers >= 1) {
                        throw new common_1.UnauthorizedException(`Forbidden: Unauthorized Access: This Exam Can not be Attempt More Than One Time`);
                    }
                }
            }
        }
        return exam;
    }
    async findExamByCatId(id) {
        const [err, exams] = await utils_1.to(this.examRepository.find({
            select: ['id', 'title', 'description', 'startDate', 'endDate'],
            where: [
                {
                    categoryIds: typeorm_2.Like(id),
                    startDate: typeorm_2.LessThanOrEqual(new Date()),
                },
                {
                    categoryIds: typeorm_2.Like('%,' + id + ',%'),
                    startDate: typeorm_2.LessThanOrEqual(new Date()),
                },
                {
                    categoryIds: typeorm_2.Like(id + ',%'),
                    startDate: typeorm_2.LessThanOrEqual(new Date()),
                },
                {
                    categoryIds: typeorm_2.Like('%,' + id),
                    startDate: typeorm_2.LessThanOrEqual(new Date()),
                },
            ],
            relations: ['categoryType'],
            order: { endDate: 'DESC' },
        }));
        if (err)
            throw new common_1.InternalServerErrorException();
        return exams;
    }
    async findOldExamByCatId(id) {
        const [err, exams] = await utils_1.to(this.examRepository.find({
            select: ['id', 'title', 'description', 'startDate', 'endDate'],
            where: [
                {
                    categoryIds: typeorm_2.Like(id),
                    endDate: typeorm_2.LessThan(new Date()),
                },
                {
                    categoryIds: typeorm_2.Like('%,' + id + ',%'),
                    endDate: typeorm_2.LessThan(new Date()),
                },
                {
                    categoryIds: typeorm_2.Like(id + ',%'),
                    endDate: typeorm_2.LessThan(new Date()),
                },
                {
                    categoryIds: typeorm_2.Like('%,' + id),
                    endDate: typeorm_2.LessThan(new Date()),
                },
            ],
            relations: ['categoryType'],
            order: { endDate: 'DESC' },
        }));
        if (err)
            throw new common_1.InternalServerErrorException();
        return exams;
    }
    async findQuestionsByExamId(id, email) {
        const exam = await this.findExamById(id, null, email);
        if (exam) {
            let [err, questions] = await utils_1.to(this.questionRepository.find({
                where: { id: typeorm_2.In(exam.questions.map((e) => +e)) },
            }));
            if (err)
                throw new common_1.InternalServerErrorException();
            questions.forEach((question) => {
                question.stems.map((stem, index) => {
                    question.stems[index] = stem.qStem;
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
    async findFreeQuestionsByExamId(id) {
        const exam = await this.findExamById(id, await this.freeCategoryId);
        if (exam) {
            let [err, questions] = await utils_1.to(this.questionRepository
                .find({
                where: { id: typeorm_2.In(exam.questions.map((e) => +e)) },
            }));
            if (err)
                throw new common_1.InternalServerErrorException();
            questions.map((question) => {
                question.stems.map((stem, index) => {
                    question.stems[index] = stem.qStem;
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
    async findAllProfile() {
        const [err, profiles] = await utils_1.to(this.examProfileRepository.find());
        if (err)
            throw new common_1.InternalServerErrorException();
        return profiles;
    }
    async findProfileByUserEmail(email) {
        const [err, profile] = await utils_1.to(this.examProfileRepository.findOne({
            user: email,
        }));
        if (err)
            throw new common_1.InternalServerErrorException();
        return profile;
    }
    async getUserAvgResult(email) {
        const [err, profile] = await utils_1.to(this.examProfileRepository.findOne({
            user: email,
        }));
        if (err)
            throw new common_1.InternalServerErrorException();
        let totalAvgScore = 0;
        let totalMark = 0;
        profile &&
            profile.exams.map((e) => {
                totalAvgScore += e.averageScore;
                totalMark += e.totalMark;
            });
        return [totalAvgScore.toFixed(2), totalMark.toFixed(2)];
    }
    async getUserRank(email) {
        const profiles = await this.findAllProfile();
        let totalAvgScore = 0;
        const profilesModified = _.sortBy(profiles.map((profile) => ({
            user: profile.user,
            totalAvgScore: profile.exams
                .map((e) => (totalAvgScore += e.averageScore))
                .reverse()[0],
        })), (profile) => profile.totalAvgScore).reverse();
        let rank = 0;
        profilesModified.forEach((e, i) => {
            if (e.user === email)
                rank = i + 1;
            return;
        });
        return rank;
    }
    async createExam(createExamDto, creator) {
        const { title, type, categoryType, description, questions, startDate, endDate, singleQuestionMark, questionStemLength, penaltyMark, timeLimit, } = createExamDto;
        const exam = new exam_entity_1.Exam();
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
        const [err, result] = await utils_1.to(exam.save());
        if (err) {
            throw new common_1.InternalServerErrorException();
        }
        return result;
    }
    async updateExamById(id, createExamDto) {
        const { title, type, categoryType, description, questions, singleQuestionMark, questionStemLength, penaltyMark, timeLimit, } = createExamDto;
        const exam = await this.examRepository.findOne(+id).catch((e) => {
            console.log(e);
            throw new common_1.HttpException('Could not able to fetch oldQuestion from database ', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        });
        exam.title = title;
        exam.type = type;
        exam.categoryIds = categoryType;
        exam.description = description;
        exam.questions = questions;
        exam.singleQuestionMark = singleQuestionMark;
        exam.questionStemLength = questionStemLength;
        (exam.penaltyMark = penaltyMark), (exam.timeLimit = timeLimit);
        exam.categoryIds = categoryType;
        exam.categoryType = [];
        exam.createdAt = moment().format('YYYY-MM-DD HH=mm=sss');
        categoryType.forEach((e) => {
            exam.categoryType.push({ id: +e });
        });
        const [err, result] = await utils_1.to(exam.save());
        if (err) {
            console.log(err);
            throw new common_1.InternalServerErrorException();
        }
        return result;
    }
    async deleteExam(...args) {
        return await this.examRepository.delete(args);
    }
    async createFeedback(createFeedbackDto) {
        const { examId, name, email, feedbackStatus, message } = createFeedbackDto;
        const feedback = new feedback_entity_1.Feedback();
        feedback.examId = +examId;
        feedback.name = name;
        feedback.email = email;
        feedback.feedbackStatus = +feedbackStatus;
        feedback.message = message;
        const [err, oldFeedback] = await utils_1.to(this.feedbackRepository.findOne({ email, examId }));
        if (err) {
            console.log(err);
            throw new common_1.InternalServerErrorException();
        }
        if (oldFeedback)
            return { message: 'You already submitted a feedback.' };
        const [error, result] = await utils_1.to(feedback.save());
        if (error) {
            console.log(error);
            throw new common_1.InternalServerErrorException();
        }
        return { message: 'Your feedback is submitted successfuly.' };
    }
    async getFeedbackByExamId(examId) {
        const [err, feedbacks] = await utils_1.to(this.feedbackRepository.find({
            select: ['name', 'feedbackStatus', 'message'],
            where: { examId, status: feedback_entity_1.Status.Published },
        }));
        if (err) {
            console.log(err);
            throw new common_1.InternalServerErrorException();
        }
        return feedbacks;
    }
    async getPendingFeedback() {
        const [err, feedbacks] = await utils_1.to(this.feedbackRepository.find({
            select: ['id', 'name', 'feedbackStatus', 'message', 'examId'],
            where: { status: feedback_entity_1.Status.Pending },
        }));
        if (err) {
            console.log(err);
            throw new common_1.InternalServerErrorException();
        }
        return feedbacks;
    }
    async changePendingStatus(ids) {
        const [err, feedbacks] = await utils_1.to(this.feedbackRepository.find(ids));
        if (err) {
            console.log(err);
            throw new common_1.InternalServerErrorException();
        }
        feedbacks.forEach((feedback) => {
            if (ids.includes(feedback.id)) {
                feedback.status = feedback_entity_1.Status.Published;
            }
        });
        await this.feedbackRepository.save(feedbacks);
        return { message: 'Change Status to published successfully.' };
    }
};
ExamsService = __decorate([
    common_1.Injectable(),
    __param(1, typeorm_1.InjectRepository(question_repository_1.QuestionRepository)),
    __param(2, typeorm_1.InjectRepository(category_repository_1.CategoryRepository)),
    __param(3, typeorm_1.InjectRepository(exam_repository_1.ExamRepository)),
    __param(4, typeorm_1.InjectRepository(profie_repository_1.ExamProfileRepository)),
    __param(5, typeorm_1.InjectRepository(feedback_repository_1.FeedbackRepository)),
    __metadata("design:paramtypes", [users_service_1.UsersService,
        question_repository_1.QuestionRepository,
        category_repository_1.CategoryRepository,
        exam_repository_1.ExamRepository,
        profie_repository_1.ExamProfileRepository,
        feedback_repository_1.FeedbackRepository])
], ExamsService);
exports.ExamsService = ExamsService;
//# sourceMappingURL=exams.service.js.map