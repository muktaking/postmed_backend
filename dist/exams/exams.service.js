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
const jspdf_1 = require("jspdf");
const _ = require("lodash");
const category_repository_1 = require("../categories/category.repository");
const course_repository_1 = require("../courses/course.repository");
const courses_service_1 = require("../courses/courses.service");
const question_repository_1 = require("../questions/question.repository");
const userExamCourseProfile_repository_1 = require("../userExamProfile/userExamCourseProfile.repository");
const userExamProfile_entity_1 = require("../userExamProfile/userExamProfile.entity");
const userExamProfile_repository_1 = require("../userExamProfile/userExamProfile.repository");
const user_entity_1 = require("../users/user.entity");
const users_service_1 = require("../users/users.service");
const utils_1 = require("../utils/utils");
const typeorm_2 = require("typeorm");
const exam_entity_1 = require("./exam.entity");
const exam_repository_1 = require("./exam.repository");
const feedback_entity_1 = require("./feedback.entity");
const feedback_repository_1 = require("./feedback.repository");
let ExamsService = class ExamsService {
    constructor(usersService, coursesService, questionRepository, courseRepository, categoryRepository, examRepository, feedbackRepository, userExamCourseProfileRepository, userExamProfileRepository) {
        this.usersService = usersService;
        this.coursesService = coursesService;
        this.questionRepository = questionRepository;
        this.courseRepository = courseRepository;
        this.categoryRepository = categoryRepository;
        this.examRepository = examRepository;
        this.feedbackRepository = feedbackRepository;
        this.userExamCourseProfileRepository = userExamCourseProfileRepository;
        this.userExamProfileRepository = userExamProfileRepository;
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
    async findUserExamInfo(id, courseId) {
        const examTotalNumber = await this.findExamTotalNumberByCourseId(+courseId);
        const examTotalTaken = await this.findTotalExamTakenByCourseId(+id, +courseId);
        const rank = await this.getUserRank(+id, +courseId);
        const totalStudent = await this.coursesService.findAllEnrolledStudentNumberByCourseId(+courseId);
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
        const [err, profile] = await utils_1.to(this.userExamProfileRepository.findOne({
            where: { id: +id },
        }));
        if (err)
            throw new common_1.InternalServerErrorException();
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
        const [err, profile] = await utils_1.to(this.userExamProfileRepository.findOne({
            id: +id,
        }));
        if (err)
            throw new common_1.InternalServerErrorException();
        if (profile) {
            const [course] = profile.courses.filter((c) => c.courseId === +courseId);
            if (course) {
                return course.exams.length;
            }
        }
        return 0;
    }
    async findExamTotalNumber() {
        const [err, examTotal] = await utils_1.to(this.examRepository.count());
        if (err)
            throw new common_1.InternalServerErrorException();
        return examTotal;
    }
    async findExamTotalNumberByCourseId(courseId) {
        const [err, exams] = await utils_1.to(this.examRepository.find({
            where: [
                {
                    courseIds: typeorm_2.Like(courseId),
                    startDate: typeorm_2.LessThanOrEqual(new Date()),
                },
                {
                    courseIds: typeorm_2.Like('%,' + courseId + ',%'),
                    startDate: typeorm_2.LessThanOrEqual(new Date()),
                },
                {
                    courseIds: typeorm_2.Like(courseId + ',%'),
                    startDate: typeorm_2.LessThanOrEqual(new Date()),
                },
                {
                    courseIds: typeorm_2.Like('%,' + courseId),
                    startDate: typeorm_2.LessThanOrEqual(new Date()),
                },
            ],
        }));
        if (err)
            throw new common_1.InternalServerErrorException('Can not get total course number');
        return exams.length;
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
    async findAllExamsByCourseIds(courseId, stuIds) {
        const [error, course] = utils_1.to(await this.courseRepository.findOne(+courseId));
        if (error)
            throw new common_1.InternalServerErrorException();
        if (course.length > 0) {
            if (course.enrolledStuIds && course.enrolledStuIds.includes(stuIds)) {
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
                        where: [
                            {
                                courseIds: typeorm_2.Like(courseId),
                                startDate: typeorm_2.LessThanOrEqual(new Date()),
                            },
                            {
                                courseIds: typeorm_2.Like('%,' + courseId + ',%'),
                                startDate: typeorm_2.LessThanOrEqual(new Date()),
                            },
                            {
                                courseIds: typeorm_2.Like(courseId + ',%'),
                                startDate: typeorm_2.LessThanOrEqual(new Date()),
                            },
                            {
                                courseIds: typeorm_2.Like('%,' + courseId),
                                startDate: typeorm_2.LessThanOrEqual(new Date()),
                            },
                        ],
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
        }
        else {
            throw new common_1.UnauthorizedException(`Forbidden: Unauthorized Access: Please enroll for the required course.`);
        }
    }
    async findAllPlainExamsByCourseIds(courseId, filter = null) {
        const [error, course] = await utils_1.to(this.courseRepository.findOne({
            where: { id: +courseId, endDate: typeorm_2.MoreThanOrEqual(new Date()) },
        }));
        if (error)
            throw new common_1.InternalServerErrorException();
        if (course) {
            if (filter &&
                Object.keys(filter).length !== 0) {
                const { text, examType } = filter;
                let [err, exams] = await utils_1.to(this.examRepository.find({
                    select: [
                        'id',
                        'title',
                        'type',
                        'description',
                        'startDate',
                        'endDate',
                    ],
                    where: [
                        {
                            courseIds: typeorm_2.Like(courseId),
                            title: typeorm_2.Like('%' + text + '%'),
                            type: typeorm_2.In(examType),
                            startDate: typeorm_2.LessThanOrEqual(new Date()),
                        },
                        {
                            courseIds: typeorm_2.Like('%,' + courseId + ',%'),
                            title: typeorm_2.Like('%' + text + '%'),
                            type: typeorm_2.In(examType),
                            startDate: typeorm_2.LessThanOrEqual(new Date()),
                        },
                        {
                            courseIds: typeorm_2.Like(courseId + ',%'),
                            title: typeorm_2.Like('%' + text + '%'),
                            type: typeorm_2.In(examType),
                            startDate: typeorm_2.LessThanOrEqual(new Date()),
                        },
                        {
                            courseIds: typeorm_2.Like('%,' + courseId),
                            title: typeorm_2.Like('%' + text + '%'),
                            type: typeorm_2.In(examType),
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
            let [err, exams] = await utils_1.to(this.examRepository.find({
                select: [
                    'id',
                    'title',
                    'type',
                    'description',
                    'startDate',
                    'endDate',
                ],
                where: [
                    {
                        courseIds: typeorm_2.Like(courseId),
                        startDate: typeorm_2.LessThanOrEqual(new Date()),
                    },
                    {
                        courseIds: typeorm_2.Like('%,' + courseId + ',%'),
                        startDate: typeorm_2.LessThanOrEqual(new Date()),
                    },
                    {
                        courseIds: typeorm_2.Like(courseId + ',%'),
                        startDate: typeorm_2.LessThanOrEqual(new Date()),
                    },
                    {
                        courseIds: typeorm_2.Like('%,' + courseId),
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
        else {
            throw new common_1.NotFoundException();
        }
    }
    async findAllPlainExamsByCourseIdsWithAuth(courseId, stuIds, filter = null) {
        const [error, course] = await utils_1.to(this.courseRepository.findOne({
            where: { id: +courseId, endDate: typeorm_2.MoreThanOrEqual(new Date()) },
        }));
        if (error)
            throw new common_1.InternalServerErrorException();
        if (course) {
            if (filter &&
                Object.keys(filter).length !== 0) {
                const { text, examType } = filter;
                let [err, exams] = await utils_1.to(this.examRepository.find({
                    select: [
                        'id',
                        'title',
                        'type',
                        'description',
                        'startDate',
                        'endDate',
                    ],
                    where: [
                        {
                            courseIds: typeorm_2.Like(courseId),
                            title: typeorm_2.Like('%' + text + '%'),
                            type: typeorm_2.In(examType),
                            startDate: typeorm_2.LessThanOrEqual(new Date()),
                        },
                        {
                            courseIds: typeorm_2.Like('%,' + courseId + ',%'),
                            title: typeorm_2.Like('%' + text + '%'),
                            type: typeorm_2.In(examType),
                            startDate: typeorm_2.LessThanOrEqual(new Date()),
                        },
                        {
                            courseIds: typeorm_2.Like(courseId + ',%'),
                            title: typeorm_2.Like('%' + text + '%'),
                            type: typeorm_2.In(examType),
                            startDate: typeorm_2.LessThanOrEqual(new Date()),
                        },
                        {
                            courseIds: typeorm_2.Like('%,' + courseId),
                            title: typeorm_2.Like('%' + text + '%'),
                            type: typeorm_2.In(examType),
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
            let [err, exams] = await utils_1.to(this.examRepository.find({
                select: [
                    'id',
                    'title',
                    'type',
                    'description',
                    'startDate',
                    'endDate',
                ],
                where: [
                    {
                        courseIds: typeorm_2.Like(courseId),
                        startDate: typeorm_2.LessThanOrEqual(new Date()),
                    },
                    {
                        courseIds: typeorm_2.Like('%,' + courseId + ',%'),
                        startDate: typeorm_2.LessThanOrEqual(new Date()),
                    },
                    {
                        courseIds: typeorm_2.Like(courseId + ',%'),
                        startDate: typeorm_2.LessThanOrEqual(new Date()),
                    },
                    {
                        courseIds: typeorm_2.Like('%,' + courseId),
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
        else {
            throw new common_1.NotFoundException();
        }
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
                'courseIds',
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
    async findLatestExamByCourseId(courseId) {
        this.findAllExamsByCourseIds;
        const [err, [examLatest]] = await utils_1.to(this.examRepository.find({
            select: ['id', 'title', 'description', 'type', 'startDate', 'endDate'],
            where: [
                {
                    courseIds: typeorm_2.Like(courseId),
                    startDate: typeorm_2.LessThanOrEqual(new Date()),
                },
                {
                    courseIds: typeorm_2.Like('%,' + courseId + ',%'),
                    startDate: typeorm_2.LessThanOrEqual(new Date()),
                },
                {
                    courseIds: typeorm_2.Like(courseId + ',%'),
                    startDate: typeorm_2.LessThanOrEqual(new Date()),
                },
                {
                    courseIds: typeorm_2.Like('%,' + courseId),
                    startDate: typeorm_2.LessThanOrEqual(new Date()),
                },
            ],
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
    async getFeaturedExams(courseId = null) {
        if (courseId) {
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
            return exams.filter((exam) => exam.courseIds.includes(courseId.toString()));
        }
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
    async findExamById(examId, courseId = null, constraintByCategoryType = null, stuId = null) {
        if (constraintByCategoryType) {
            const [err, exam] = await utils_1.to(this.examRepository.findOne(+examId));
            if (err)
                throw new common_1.InternalServerErrorException();
            if (!exam) {
                throw new common_1.UnauthorizedException('Forbidden: Unauthorized Access.');
            }
            else if (!exam.categoryIds.includes(constraintByCategoryType.toString())) {
                throw new common_1.UnauthorizedException(`Forbidden: Unauthorized Access.`);
            }
            return exam;
        }
        const [err, exam] = await utils_1.to(this.examRepository.findOne(+examId));
        if (err)
            throw new common_1.InternalServerErrorException();
        if (stuId) {
            if (courseId) {
                const [err, course] = await utils_1.to(this.courseRepository.find({
                    where: [
                        {
                            id: +courseId,
                            enrolledStuIds: typeorm_2.Like(+stuId),
                            endDate: typeorm_2.MoreThanOrEqual(new Date()),
                        },
                        {
                            id: +courseId,
                            enrolledStuIds: typeorm_2.Like('%,' + stuId + ',%'),
                            endDate: typeorm_2.MoreThanOrEqual(new Date()),
                        },
                        {
                            id: +courseId,
                            enrolledStuIds: typeorm_2.Like(stuId + ',%'),
                            endDate: typeorm_2.MoreThanOrEqual(new Date()),
                        },
                        {
                            id: +courseId,
                            enrolledStuIds: typeorm_2.Like('%,' + stuId),
                            endDate: typeorm_2.MoreThanOrEqual(new Date()),
                        },
                    ],
                }));
                if (err)
                    throw new common_1.InternalServerErrorException();
                if (course.length < 1) {
                    throw new common_1.UnauthorizedException(`Forbidden: Unauthorized Access. Please enroll for the required course or the course is ended.`);
                }
            }
        }
        return exam;
    }
    async findExamByCatId(id) {
        const [err, exams] = await utils_1.to(this.examRepository.find({
            select: ['id', 'title', 'type', 'description', 'startDate', 'endDate'],
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
    async findQuestionsByExamId(id, user) {
        const [examId, courseId] = id.split('_');
        const exam = await this.findExamById(examId, courseId, null, user.id);
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
        const exam = await this.findExamById(id, null, await this.freeCategoryId);
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
        const [err, profiles] = await utils_1.to(this.userExamProfileRepository.find());
        if (err)
            throw new common_1.InternalServerErrorException();
        return profiles;
    }
    async getUserAvgResultByCourseId(id, courseId) {
        const [err, profile] = await utils_1.to(this.userExamProfileRepository.findOne({
            where: { id: +id },
            relations: ['courses'],
        }));
        if (err)
            throw new common_1.InternalServerErrorException();
        if (profile) {
            const [course] = profile.courses.filter((c) => c.courseId === +courseId);
            if (course) {
                return [course.totalScore, course.totalMark];
            }
        }
        return null;
    }
    async getUserRank(id, courseId) {
        let [error, courses] = await utils_1.to(this.userExamCourseProfileRepository.find({
            where: { courseId: +courseId },
            relations: ['userExamProfile'],
        }));
        if (error)
            throw new common_1.InternalServerErrorException();
        courses = _.sortBy(courses, [(o) => +o.totalScore]).reverse();
        let rank = 0;
        courses.forEach((e, i) => {
            if (e.userExamProfile.id === +id)
                rank = i + 1;
            return;
        });
        return rank;
    }
    async createExam(createExamDto, creator) {
        const { title, type, categoryType, courseType, description, questions, startDate, endDate, singleQuestionMark, questionStemLength, penaltyMark, timeLimit, } = createExamDto;
        if (creator.role < user_entity_1.RolePermitted.coordinator) {
            const [error, accessRight] = await utils_1.to(this.usersService.getAccessRight(creator.id));
            console.log(error, accessRight);
            if (error)
                throw new common_1.InternalServerErrorException(error.message);
            if (accessRight) {
                const accessableCourseIds = accessRight.accesableCourseIds;
                if (!accessableCourseIds.includes(courseType.toString())) {
                    throw new common_1.UnauthorizedException();
                }
            }
            else {
                throw new common_1.UnauthorizedException();
            }
        }
        const exam = new exam_entity_1.Exam();
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
        const [err, result] = await utils_1.to(exam.save());
        if (err) {
            throw new common_1.InternalServerErrorException();
        }
        return result;
    }
    async updateExamById(id, createExamDto) {
        const { title, type, categoryType, courseType, description, questions, singleQuestionMark, questionStemLength, penaltyMark, timeLimit, } = createExamDto;
        const exam = await this.examRepository.findOne(+id).catch((e) => {
            throw new common_1.HttpException('Could not able to fetch oldQuestion from database ', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
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
        categoryType.forEach((e) => {
            exam.categoryType.push({ id: +e });
        });
        courseType.forEach((e) => {
            exam.courseType.push({ id: +e });
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
            where: { status: feedback_entity_1.Status.Pending },
            relations: ['exam'],
        }));
        if (err) {
            console.log(err);
            throw new common_1.InternalServerErrorException();
        }
        return feedbacks;
    }
    async changePendingStatus(ids, deny = false) {
        if (deny) {
            const [err, results] = await utils_1.to(this.feedbackRepository.delete({ id: typeorm_2.In(ids) }));
            if (err) {
                throw new common_1.InternalServerErrorException();
            }
            return { message: 'Change Status to published successfully.' };
        }
        const [err, feedbacks] = await utils_1.to(this.feedbackRepository.find(ids));
        if (err) {
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
    async getPdfByExamId(examId) {
        const doc = new jspdf_1.jsPDF();
        doc.text('Hello world!', 10, 10);
        return doc.output();
    }
};
ExamsService = __decorate([
    common_1.Injectable(),
    __param(2, typeorm_1.InjectRepository(question_repository_1.QuestionRepository)),
    __param(3, typeorm_1.InjectRepository(course_repository_1.CourseRepository)),
    __param(4, typeorm_1.InjectRepository(category_repository_1.CategoryRepository)),
    __param(5, typeorm_1.InjectRepository(exam_repository_1.ExamRepository)),
    __param(6, typeorm_1.InjectRepository(feedback_repository_1.FeedbackRepository)),
    __param(7, typeorm_1.InjectRepository(userExamCourseProfile_repository_1.UserExamCourseProfileRepository)),
    __param(8, typeorm_1.InjectRepository(userExamProfile_repository_1.UserExamProfileRepository)),
    __metadata("design:paramtypes", [users_service_1.UsersService,
        courses_service_1.CoursesService,
        question_repository_1.QuestionRepository,
        category_repository_1.CategoryRepository,
        category_repository_1.CategoryRepository,
        exam_repository_1.ExamRepository,
        feedback_repository_1.FeedbackRepository,
        userExamCourseProfile_repository_1.UserExamCourseProfileRepository,
        userExamProfile_repository_1.UserExamProfileRepository])
], ExamsService);
exports.ExamsService = ExamsService;
//# sourceMappingURL=exams.service.js.map