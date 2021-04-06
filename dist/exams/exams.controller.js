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
const roles_decorator_1 = require("../roles.decorator");
const roles_guard_1 = require("../roles.guard");
const user_entity_1 = require("../users/user.entity");
const exam_dto_1 = require("./dto/exam.dto");
const exams_service_1 = require("./exams.service");
let ExamsController = class ExamsController {
    constructor(examService) {
        this.examService = examService;
    }
    async createExam(createExamDto, req) {
        return await this.examService.createExam(createExamDto, req.user.id);
    }
    async findAllExams() {
        return await this.examService.findAllExams();
    }
    async findLatestExam() {
        return await this.examService.findLatestExam();
    }
    async findFeaturedExam() {
        return await this.examService.getFeaturedExams();
    }
    async findExamById(id) {
        return await this.examService.findExamById(id);
    }
    async findQuestionsByExamId(id) {
        return await this.examService.findQuestionsByExamId(id);
    }
    async findFreeQuestionsByExamId(id) {
        return await this.examService.findFreeQuestionsByExamId(id);
    }
    async updateExamById(examId, createExamDto) {
        return await this.examService.updateExamById(examId.id, createExamDto);
    }
    async deleteQuestionById(examId) {
        return await this.examService.deleteExam(examId.id);
    }
    async deleteQuestion(examIds) {
        return await this.examService.deleteExam(...examIds.ids);
    }
};
__decorate([
    common_1.Post(),
    common_1.UseGuards(passport_1.AuthGuard("jwt"), roles_guard_1.RolesGuard),
    roles_decorator_1.Role(user_entity_1.RolePermitted.mentor),
    common_1.UsePipes(common_1.ValidationPipe),
    __param(0, common_1.Body()), __param(1, common_1.Req()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [exam_dto_1.CreateExamDto, Object]),
    __metadata("design:returntype", Promise)
], ExamsController.prototype, "createExam", null);
__decorate([
    common_1.Get(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ExamsController.prototype, "findAllExams", null);
__decorate([
    common_1.Get("/latest"),
    common_1.UseGuards(passport_1.AuthGuard("jwt"), roles_guard_1.RolesGuard),
    roles_decorator_1.Role(user_entity_1.RolePermitted.student),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ExamsController.prototype, "findLatestExam", null);
__decorate([
    common_1.Get("/featured"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ExamsController.prototype, "findFeaturedExam", null);
__decorate([
    common_1.Get(":id"),
    common_1.UseGuards(passport_1.AuthGuard("jwt"), roles_guard_1.RolesGuard),
    roles_decorator_1.Role(user_entity_1.RolePermitted.student),
    __param(0, common_1.Param("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ExamsController.prototype, "findExamById", null);
__decorate([
    common_1.Get("questions/:id"),
    common_1.UseGuards(passport_1.AuthGuard("jwt")),
    roles_decorator_1.Role(user_entity_1.RolePermitted.student),
    __param(0, common_1.Param("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ExamsController.prototype, "findQuestionsByExamId", null);
__decorate([
    common_1.Get("free/questions/:id"),
    __param(0, common_1.Param("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ExamsController.prototype, "findFreeQuestionsByExamId", null);
__decorate([
    common_1.Patch(":id"),
    __param(0, common_1.Param()), __param(1, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, exam_dto_1.CreateExamDto]),
    __metadata("design:returntype", Promise)
], ExamsController.prototype, "updateExamById", null);
__decorate([
    common_1.Delete(":id"),
    roles_decorator_1.Role(user_entity_1.RolePermitted.coordinator),
    __param(0, common_1.Param()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ExamsController.prototype, "deleteQuestionById", null);
__decorate([
    common_1.Delete(),
    roles_decorator_1.Role(user_entity_1.RolePermitted.coordinator),
    __param(0, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ExamsController.prototype, "deleteQuestion", null);
ExamsController = __decorate([
    common_1.Controller("exams"),
    __metadata("design:paramtypes", [exams_service_1.ExamsService])
], ExamsController);
exports.ExamsController = ExamsController;
//# sourceMappingURL=exams.controller.js.map