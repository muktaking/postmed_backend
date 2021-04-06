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
const exams_module_1 = require("../exams/exams.module");
const profie_repository_1 = require("../exams/profie.repository");
const question_repository_1 = require("../questions/question.repository");
const users_module_1 = require("../users/users.module");
const postexams_controller_1 = require("./postexams.controller");
const postexams_service_1 = require("./postexams.service");
let PostexamsModule = class PostexamsModule {
};
PostexamsModule = __decorate([
    common_1.Module({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([profie_repository_1.ExamProfileRepository, question_repository_1.QuestionRepository]),
            exams_module_1.ExamsModule,
            users_module_1.UsersModule,
        ],
        controllers: [postexams_controller_1.PostexamsController],
        providers: [postexams_service_1.PostexamsService],
    })
], PostexamsModule);
exports.PostexamsModule = PostexamsModule;
//# sourceMappingURL=postexams.module.js.map