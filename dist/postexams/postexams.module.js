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
const courses_module_1 = require("../courses/courses.module");
const courseBasedExamProfile_entity_1 = require("../exams/courseBasedExamProfile.entity");
const courseBasedExamProfile_repository_1 = require("../exams/courseBasedExamProfile.repository");
const courseBasedProfile_entity_1 = require("../exams/courseBasedProfile.entity");
const coursesProfile_entity_1 = require("../exams/coursesProfile.entity");
const exams_module_1 = require("../exams/exams.module");
const profie_repository_1 = require("../exams/profie.repository");
const question_repository_1 = require("../questions/question.repository");
const userExamProfile_module_1 = require("../userExamProfile/userExamProfile.module");
const users_module_1 = require("../users/users.module");
const postexams_controller_1 = require("./postexams.controller");
const postexams_service_1 = require("./postexams.service");
let PostexamsModule = class PostexamsModule {
};
PostexamsModule = __decorate([
    common_1.Module({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([
                profie_repository_1.ExamProfileRepository,
                question_repository_1.QuestionRepository,
                coursesProfile_entity_1.CoursesProfile,
                courseBasedProfile_entity_1.CourseBasedProfile,
                courseBasedExamProfile_entity_1.CourseBasedExamProfile,
                courseBasedExamProfile_repository_1.CourseBasedExamProfileRepository,
            ]),
            exams_module_1.ExamsModule,
            users_module_1.UsersModule,
            courses_module_1.CoursesModule,
            userExamProfile_module_1.UserExamProfileModule,
        ],
        controllers: [postexams_controller_1.PostexamsController],
        providers: [postexams_service_1.PostexamsService],
    })
], PostexamsModule);
exports.PostexamsModule = PostexamsModule;
//# sourceMappingURL=postexams.module.js.map