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
const examActivityStat_repository_1 = require("./examActivityStat.repository");
const questionActivityStat_repository_1 = require("./questionActivityStat.repository");
const stemActivityStat_repository_1 = require("./stemActivityStat.repository");
const userExamCourseProfile_repository_1 = require("./userExamCourseProfile.repository");
const userExamExamProfile_repository_1 = require("./userExamExamProfile.repository");
const userExamProfile_controller_1 = require("./userExamProfile.controller");
const userExamProfile_repository_1 = require("./userExamProfile.repository");
const userExamprofile_service_1 = require("./userExamprofile.service");
let UserExamProfileModule = class UserExamProfileModule {
};
UserExamProfileModule = __decorate([
    common_1.Module({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([
                userExamProfile_repository_1.UserExamProfileRepository,
                userExamCourseProfile_repository_1.UserExamCourseProfileRepository,
                userExamExamProfile_repository_1.UserExamExamProfileRepository,
                examActivityStat_repository_1.ExamActivityStatRepository,
                questionActivityStat_repository_1.QuestionActivityStatRepository,
                stemActivityStat_repository_1.StemActivityStatRepository,
            ]),
        ],
        controllers: [userExamProfile_controller_1.UserExamProfileController],
        providers: [userExamprofile_service_1.UserExamProfileService],
        exports: [userExamprofile_service_1.UserExamProfileService],
    })
], UserExamProfileModule);
exports.UserExamProfileModule = UserExamProfileModule;
//# sourceMappingURL=userExamProfile.module.js.map