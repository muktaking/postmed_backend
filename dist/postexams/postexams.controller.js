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
const get_answers_dto_1 = require("./dto/get-answers.dto");
const answer_validation_pipe_1 = require("./pipe/answer-validation.pipe");
const postexams_service_1 = require("./postexams.service");
let PostexamsController = class PostexamsController {
    constructor(postexamsService) {
        this.postexamsService = postexamsService;
    }
    async postExamTasking(getAnswersDto, answers, req) {
        return await this.postexamsService.postExamTasking(getAnswersDto, answers, req.user);
    }
    async postExamTaskingForFree(getAnswersDto, answers) {
        return await this.postexamsService.postExamTaskingForFree(getAnswersDto, answers);
    }
    async examRankByIdForGuest(id) {
        return await this.postexamsService.examRankById(id);
    }
};
__decorate([
    common_1.Post(),
    common_1.UseGuards(passport_1.AuthGuard("jwt")),
    common_1.UsePipes(common_1.ValidationPipe),
    __param(0, common_1.Body()),
    __param(1, common_1.Body("answers", answer_validation_pipe_1.AnswerValidationPipe)),
    __param(2, common_1.Req()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [get_answers_dto_1.GetAnswersDto, Array, Object]),
    __metadata("design:returntype", Promise)
], PostexamsController.prototype, "postExamTasking", null);
__decorate([
    common_1.Post("free"),
    common_1.UsePipes(common_1.ValidationPipe),
    __param(0, common_1.Body()),
    __param(1, common_1.Body("answers", answer_validation_pipe_1.AnswerValidationPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [get_answers_dto_1.GetAnswersDto, Array]),
    __metadata("design:returntype", Promise)
], PostexamsController.prototype, "postExamTaskingForFree", null);
__decorate([
    common_1.Get("rank/:id"),
    __param(0, common_1.Param("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PostexamsController.prototype, "examRankByIdForGuest", null);
PostexamsController = __decorate([
    common_1.Controller("postexams"),
    __metadata("design:paramtypes", [postexams_service_1.PostexamsService])
], PostexamsController);
exports.PostexamsController = PostexamsController;
//# sourceMappingURL=postexams.controller.js.map