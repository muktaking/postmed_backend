"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const category_repository_1 = require("../categories/category.repository");
const courses_module_1 = require("../courses/courses.module");
const exam_repository_1 = require("../exams/exam.repository");
const exams_module_1 = require("../exams/exams.module");
const userExamProfile_module_1 = require("../userExamProfile/userExamProfile.module");
const userExamProfile_repository_1 = require("../userExamProfile/userExamProfile.repository");
const users_module_1 = require("../users/users.module");
const dashboard_controller_1 = require("./dashboard.controller");
const dashboard_service_1 = require("./dashboard.service");
let DashboardModule = class DashboardModule {
};
DashboardModule = __decorate([
    common_1.Module({
        controllers: [dashboard_controller_1.DashboardController],
        providers: [dashboard_service_1.DashboardService],
        imports: [
            typeorm_1.TypeOrmModule.forFeature([
                exam_repository_1.ExamRepository,
                category_repository_1.CategoryRepository,
                userExamProfile_repository_1.UserExamProfileRepository,
            ]),
            exams_module_1.ExamsModule,
            users_module_1.UsersModule,
            courses_module_1.CoursesModule,
            userExamProfile_module_1.UserExamProfileModule,
        ],
    })
], DashboardModule);
exports.DashboardModule = DashboardModule;
//# sourceMappingURL=dashboard.module.js.map