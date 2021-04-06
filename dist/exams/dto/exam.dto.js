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
Object.defineProperty(exports, "__esModule", { value: true });
const class_validator_1 = require("class-validator");
const exam_model_1 = require("../exam.model");
class CreateExamDto {
}
__decorate([
    class_validator_1.IsNotEmpty(),
    class_validator_1.IsString(),
    __metadata("design:type", String)
], CreateExamDto.prototype, "title", void 0);
__decorate([
    class_validator_1.IsNotEmpty(),
    class_validator_1.IsEnum([
        exam_model_1.ExamType.Assignment.toString(),
        exam_model_1.ExamType.Weekly.toString(),
        exam_model_1.ExamType.Monthly.toString(),
        exam_model_1.ExamType.Term.toString(),
        exam_model_1.ExamType.Assesment.toString(),
        exam_model_1.ExamType.Test.toString(),
        exam_model_1.ExamType.Final.toString(),
    ]),
    __metadata("design:type", Number)
], CreateExamDto.prototype, "type", void 0);
__decorate([
    class_validator_1.IsNotEmpty(),
    class_validator_1.IsNumberString({ each: true }),
    __metadata("design:type", Array)
], CreateExamDto.prototype, "categoryType", void 0);
__decorate([
    class_validator_1.IsNotEmpty(),
    class_validator_1.IsString(),
    __metadata("design:type", String)
], CreateExamDto.prototype, "description", void 0);
__decorate([
    class_validator_1.IsNotEmpty(),
    class_validator_1.IsArray(),
    __metadata("design:type", Array)
], CreateExamDto.prototype, "questions", void 0);
__decorate([
    class_validator_1.IsOptional(),
    class_validator_1.IsNotEmpty(),
    __metadata("design:type", Number)
], CreateExamDto.prototype, "singleQuestionMark", void 0);
__decorate([
    class_validator_1.IsOptional(),
    class_validator_1.IsNotEmpty(),
    __metadata("design:type", Number)
], CreateExamDto.prototype, "questionStemLength", void 0);
__decorate([
    class_validator_1.IsOptional(),
    class_validator_1.IsNotEmpty(),
    __metadata("design:type", Number)
], CreateExamDto.prototype, "penaltyMark", void 0);
__decorate([
    class_validator_1.IsOptional(),
    class_validator_1.IsNotEmpty(),
    __metadata("design:type", Number)
], CreateExamDto.prototype, "timeLimit", void 0);
exports.CreateExamDto = CreateExamDto;
class FindExamDto {
}
__decorate([
    class_validator_1.IsNotEmpty(),
    class_validator_1.IsNumberString(),
    __metadata("design:type", String)
], FindExamDto.prototype, "id", void 0);
exports.FindExamDto = FindExamDto;
//# sourceMappingURL=exam.dto.js.map