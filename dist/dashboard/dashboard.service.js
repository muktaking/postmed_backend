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
const category_repository_1 = require("../categories/category.repository");
const courses_service_1 = require("../courses/courses.service");
const exam_repository_1 = require("../exams/exam.repository");
const exams_service_1 = require("../exams/exams.service");
const userExamProfile_repository_1 = require("../userExamProfile/userExamProfile.repository");
const user_entity_1 = require("../users/user.entity");
const users_service_1 = require("../users/users.service");
const utils_1 = require("../utils/utils");
let DashboardService = class DashboardService {
    constructor(usersService, categoryRepository, examRepository, userExamProfileRepository, examService, courseService) {
        this.usersService = usersService;
        this.categoryRepository = categoryRepository;
        this.examRepository = examRepository;
        this.userExamProfileRepository = userExamProfileRepository;
        this.examService = examService;
        this.courseService = courseService;
        this.featuredCategoryId = this.getFeaturedCategoryId();
    }
    async getFeaturedCategoryId() {
        const [err, category] = await utils_1.to(this.categoryRepository.findOne({ name: 'Featured' }));
        if (err)
            throw new common_1.InternalServerErrorException();
        return category ? category.id : null;
    }
    async getStudentDashInfo(id) {
        const userDashExamInfo = [];
        const [error, enrolledCourses] = await utils_1.to(this.courseService.findAllCoursesEnrolledByStudent(id));
        if (error)
            throw new common_1.InternalServerErrorException('Can not get all enrolled courses');
        if (enrolledCourses) {
            for (const course of enrolledCourses) {
                const [errorUserExamProfile, userExamProfile] = await utils_1.to(this.userExamProfileRepository.findOne({
                    where: { id: +id },
                    relations: ['courses'],
                }));
                if (errorUserExamProfile)
                    throw new common_1.InternalServerErrorException(errorUserExamProfile);
                if (userExamProfile) {
                    const userExamCourseProfile = userExamProfile.courses &&
                        userExamProfile.courses.filter((e) => e.courseId === +course.id);
                    if (userExamCourseProfile.length > 0) {
                        const [err, userExamInfo] = await utils_1.to(this.examService.findUserExamInfo(id, course.id));
                        if (err)
                            throw new common_1.InternalServerErrorException('Can not get user exam info. ' + err);
                        const [err1, userExamStat] = await utils_1.to(this.examService.findUserExamStat(id, course.id));
                        if (err1)
                            throw new common_1.InternalServerErrorException('Can not get user exam stat' + err1);
                        const [err2, featuredExams] = await utils_1.to(this.examService.getFeaturedExams(course.id));
                        if (err2)
                            throw new common_1.InternalServerErrorException('Can not get featured exams' + err2);
                        userDashExamInfo.push({
                            id: course.id,
                            title: course.title,
                            userExamInfo,
                            userExamStat,
                            featuredExams,
                        });
                    }
                }
            }
        }
        return userDashExamInfo.reverse();
    }
    async getAdminDashInfo(user) {
        let users = [];
        let exams = [];
        let feedbacks = [];
        let expectedEnrolled = [];
        let err = undefined;
        [err, users] = await utils_1.to(this.usersService.findAllUsers(user));
        [err, exams] = await utils_1.to(this.examService.findAllRawExams());
        if (user.role >= user_entity_1.RolePermitted.mentor) {
            [err, feedbacks] = await utils_1.to(this.examService.getPendingFeedback());
        }
        if (user.role > user_entity_1.RolePermitted.mentor) {
            [err, expectedEnrolled] = await utils_1.to(this.courseService.expectedEnrolledStuInfo(user));
        }
        return { users, exams, feedbacks, expectedEnrolled };
    }
};
DashboardService = __decorate([
    common_1.Injectable(),
    __param(1, typeorm_1.InjectRepository(category_repository_1.CategoryRepository)),
    __param(2, typeorm_1.InjectRepository(exam_repository_1.ExamRepository)),
    __param(3, typeorm_1.InjectRepository(userExamProfile_repository_1.UserExamProfileRepository)),
    __metadata("design:paramtypes", [users_service_1.UsersService,
        category_repository_1.CategoryRepository,
        exam_repository_1.ExamRepository,
        userExamProfile_repository_1.UserExamProfileRepository,
        exams_service_1.ExamsService,
        courses_service_1.CoursesService])
], DashboardService);
exports.DashboardService = DashboardService;
//# sourceMappingURL=dashboard.service.js.map