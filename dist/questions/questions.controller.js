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
const passport_1 = require("@nestjs/passport");
const platform_express_1 = require("@nestjs/platform-express");
const multer_1 = require("multer");
const roles_decorator_1 = require("../roles.decorator");
const roles_guard_1 = require("../roles.guard");
const user_model_1 = require("../users/user.model");
const file_uploading_utils_1 = require("../utils/file-uploading.utils");
const create_question_dto_1 = require("./create-question.dto");
const stem_validation_pipe_1 = require("./pipe/stem-validation.pipe");
const questions_service_1 = require("./questions.service");
let QuestionsController = class QuestionsController {
    constructor(questionService) {
        this.questionService = questionService;
    }
    async getAllQuestions() {
        return await this.questionService.findAllQuestions();
    }
    async getQuestionById(id) {
        return await this.questionService.findQuestionById(id.id);
    }
    async getQuestionsByCategory(categoryId) {
        return await this.questionService.findQuestionByFilter("categoryId", categoryId.id);
    }
    async createQuestion(createQuestionDto, stem, req) {
        return await this.questionService.createQuestion(createQuestionDto, stem, req.user.id);
    }
    async createQuestionByUpload(req, category, file) {
        return await this.questionService.createQuestionByUpload(req.user.id, category, file);
    }
    async updateQuestionById(questionId, createQuestionDto, stem, req) {
        return await this.questionService.updateQuestionById(questionId.id, createQuestionDto, stem, req.user.id);
    }
    async deleteQuestionById(questionId) {
        return await this.questionService.deleteQuestion(questionId.id);
    }
    async deleteQuestion(questionIds) {
        return await this.questionService.deleteQuestion(...questionIds.ids);
    }
};
__decorate([
    common_1.Get(),
    common_1.UseGuards(passport_1.AuthGuard("jwt")),
    roles_decorator_1.Role(user_model_1.RolePermitted.mentor),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], QuestionsController.prototype, "getAllQuestions", null);
__decorate([
    common_1.Get(":id"),
    common_1.UseGuards(passport_1.AuthGuard("jwt")),
    roles_decorator_1.Role(user_model_1.RolePermitted.mentor),
    __param(0, common_1.Param()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], QuestionsController.prototype, "getQuestionById", null);
__decorate([
    roles_decorator_1.Role(user_model_1.RolePermitted.moderator),
    common_1.Get("/category/:id"),
    __param(0, common_1.Param()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], QuestionsController.prototype, "getQuestionsByCategory", null);
__decorate([
    common_1.Post(),
    roles_decorator_1.Role(user_model_1.RolePermitted.mentor),
    common_1.UsePipes(common_1.ValidationPipe),
    __param(0, common_1.Body()),
    __param(1, common_1.Body("stem", stem_validation_pipe_1.StemValidationPipe)),
    __param(2, common_1.Req()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_question_dto_1.CreateQuestionDto, Object, Object]),
    __metadata("design:returntype", Promise)
], QuestionsController.prototype, "createQuestion", null);
__decorate([
    common_1.Post("/files"),
    roles_decorator_1.Role(user_model_1.RolePermitted.mentor),
    common_1.UsePipes(common_1.ValidationPipe),
    common_1.UseInterceptors(platform_express_1.FileInterceptor("file", {
        storage: multer_1.diskStorage({
            destination: "./uploads/files",
            filename: file_uploading_utils_1.editFileName,
        }),
        fileFilter: file_uploading_utils_1.excelFileFilter,
    })),
    __param(0, common_1.Req()),
    __param(1, common_1.Body("category")),
    __param(2, common_1.UploadedFile()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", Promise)
], QuestionsController.prototype, "createQuestionByUpload", null);
__decorate([
    common_1.Patch("/:id"),
    roles_decorator_1.Role(user_model_1.RolePermitted.mentor),
    __param(0, common_1.Param()),
    __param(1, common_1.Body()),
    __param(2, common_1.Body("stem", stem_validation_pipe_1.StemValidationPipe)),
    __param(3, common_1.Req()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_question_dto_1.CreateQuestionDto, Object, Object]),
    __metadata("design:returntype", Promise)
], QuestionsController.prototype, "updateQuestionById", null);
__decorate([
    common_1.Delete("/:id"),
    roles_decorator_1.Role(user_model_1.RolePermitted.moderator),
    __param(0, common_1.Param()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], QuestionsController.prototype, "deleteQuestionById", null);
__decorate([
    common_1.Delete(),
    roles_decorator_1.Role(user_model_1.RolePermitted.coordinator),
    __param(0, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], QuestionsController.prototype, "deleteQuestion", null);
QuestionsController = __decorate([
    common_1.UseGuards(passport_1.AuthGuard("jwt"), roles_guard_1.RolesGuard),
    common_1.Controller("questions"),
    __metadata("design:paramtypes", [questions_service_1.QuestionsService])
], QuestionsController);
exports.QuestionsController = QuestionsController;
//# sourceMappingURL=questions.controller.js.map