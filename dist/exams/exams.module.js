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
const categories_module_1 = require("../categories/categories.module");
const category_repository_1 = require("../categories/category.repository");
const question_repository_1 = require("../questions/question.repository");
const users_module_1 = require("../users/users.module");
const exam_repository_1 = require("./exam.repository");
const exams_controller_1 = require("./exams.controller");
const exams_service_1 = require("./exams.service");
const profie_repository_1 = require("./profie.repository");
let ExamsModule = class ExamsModule {
};
ExamsModule = __decorate([
    common_1.Module({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([
                exam_repository_1.ExamRepository,
                category_repository_1.CategoryRepository,
                question_repository_1.QuestionRepository,
                profie_repository_1.ExamProfileRepository,
            ]),
            categories_module_1.CategoriesModule,
            users_module_1.UsersModule,
        ],
        controllers: [exams_controller_1.ExamsController],
        providers: [exams_service_1.ExamsService],
        exports: [exams_service_1.ExamsService],
    })
], ExamsModule);
exports.ExamsModule = ExamsModule;
//# sourceMappingURL=exams.module.js.map