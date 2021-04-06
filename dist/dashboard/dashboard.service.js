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
const exam_repository_1 = require("../exams/exam.repository");
const exams_service_1 = require("../exams/exams.service");
const users_service_1 = require("../users/users.service");
const utils_1 = require("../utils/utils");
const typeorm_2 = require("typeorm");
let DashboardService = class DashboardService {
    constructor(usersService, categoryRepository, examRepository, examService) {
        this.usersService = usersService;
        this.categoryRepository = categoryRepository;
        this.examRepository = examRepository;
        this.examService = examService;
        this.featuredCategoryId = this.getFeaturedCategoryId();
    }
    async getFeaturedCategoryId() {
        const [err, category] = await utils_1.to(this.categoryRepository.findOne({ name: "Featured" }));
        if (err)
            throw new common_1.InternalServerErrorException();
        return category ? category.id : null;
    }
    async getStudentDashInfo(email) {
        const [err, userExamInfo] = await utils_1.to(this.examService.findUserExamInfo(email));
        if (err)
            throw new common_1.InternalServerErrorException();
        const [err1, userExamStat] = await utils_1.to(this.examService.findUserExamStat(email));
        if (err1)
            throw new common_1.InternalServerErrorException();
        const featuredExams = await this.getFeaturedExams();
        return { userExamInfo, featuredExams, userExamStat };
    }
    async getAdminDashInfo(userRole) {
        const [err, users] = await utils_1.to(this.usersService.findAllUsers(userRole));
        const [err1, exams] = await utils_1.to(this.examService.findAllExams());
        return { users, exams };
    }
    async getFeaturedExams() {
        const [err, exams] = await utils_1.to(this.examRepository.find({
            where: [
                {
                    categoryIds: typeorm_2.Like("%," + (await this.featuredCategoryId).toString() + ",%"),
                },
                {
                    categoryIds: typeorm_2.Like((await this.featuredCategoryId).toString() + ",%"),
                },
                {
                    categoryIds: typeorm_2.Like("%," + (await this.featuredCategoryId).toString()),
                },
            ],
            relations: ["categoryType"],
            order: { id: "DESC" },
            take: 5,
        }));
        if (err)
            throw new common_1.InternalServerErrorException();
        return exams;
    }
};
DashboardService = __decorate([
    common_1.Injectable(),
    __param(1, typeorm_1.InjectRepository(category_repository_1.CategoryRepository)),
    __param(2, typeorm_1.InjectRepository(exam_repository_1.ExamRepository)),
    __metadata("design:paramtypes", [users_service_1.UsersService,
        category_repository_1.CategoryRepository,
        exam_repository_1.ExamRepository,
        exams_service_1.ExamsService])
], DashboardService);
exports.DashboardService = DashboardService;
//# sourceMappingURL=dashboard.service.js.map