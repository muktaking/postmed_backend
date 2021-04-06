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
const category_entity_1 = require("../categories/category.entity");
const typeorm_1 = require("typeorm");
var ExamType;
(function (ExamType) {
    ExamType[ExamType["Assignment"] = 0] = "Assignment";
    ExamType[ExamType["Weekly"] = 1] = "Weekly";
    ExamType[ExamType["Monthly"] = 2] = "Monthly";
    ExamType[ExamType["Assesment"] = 3] = "Assesment";
    ExamType[ExamType["Term"] = 4] = "Term";
    ExamType[ExamType["Test"] = 5] = "Test";
    ExamType[ExamType["Final"] = 6] = "Final";
})(ExamType = exports.ExamType || (exports.ExamType = {}));
var answerStatus;
(function (answerStatus) {
    answerStatus[answerStatus["True"] = 1] = "True";
    answerStatus[answerStatus["False"] = 0] = "False";
    answerStatus[answerStatus["NotAnswered"] = -1] = "NotAnswered";
})(answerStatus = exports.answerStatus || (exports.answerStatus = {}));
let Exam = class Exam extends typeorm_1.BaseEntity {
    singleStemMarkCalculator() {
        this.singleStemMark = +(this.singleQuestionMark / this.questionStemLength).toFixed(2);
    }
};
__decorate([
    typeorm_1.BeforeInsert(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], Exam.prototype, "singleStemMarkCalculator", null);
__decorate([
    typeorm_1.PrimaryGeneratedColumn(),
    __metadata("design:type", Number)
], Exam.prototype, "id", void 0);
__decorate([
    typeorm_1.Column({ type: "varchar", length: 200, nullable: false }),
    __metadata("design:type", String)
], Exam.prototype, "title", void 0);
__decorate([
    typeorm_1.Column({ type: "enum", enum: ExamType }),
    __metadata("design:type", Number)
], Exam.prototype, "type", void 0);
__decorate([
    typeorm_1.Column({ type: "simple-array" }),
    __metadata("design:type", Array)
], Exam.prototype, "categoryIds", void 0);
__decorate([
    typeorm_1.ManyToMany(() => category_entity_1.Category, { onUpdate: "CASCADE", onDelete: "CASCADE" }),
    typeorm_1.JoinTable(),
    __metadata("design:type", Object)
], Exam.prototype, "categoryType", void 0);
__decorate([
    typeorm_1.Column({ type: "varchar", length: 255, nullable: false }),
    __metadata("design:type", String)
], Exam.prototype, "description", void 0);
__decorate([
    typeorm_1.Column({ type: "simple-array" }),
    __metadata("design:type", Array)
], Exam.prototype, "questions", void 0);
__decorate([
    typeorm_1.Column({ default: 1 }),
    __metadata("design:type", Number)
], Exam.prototype, "singleQuestionMark", void 0);
__decorate([
    typeorm_1.Column({ default: 5 }),
    __metadata("design:type", Number)
], Exam.prototype, "questionStemLength", void 0);
__decorate([
    typeorm_1.Column({ type: "float" }),
    __metadata("design:type", Number)
], Exam.prototype, "singleStemMark", void 0);
__decorate([
    typeorm_1.Column({ type: "float", default: 0 }),
    __metadata("design:type", Number)
], Exam.prototype, "penaltyMark", void 0);
__decorate([
    typeorm_1.Column({ default: 40 }),
    __metadata("design:type", Number)
], Exam.prototype, "timeLimit", void 0);
__decorate([
    typeorm_1.Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" }),
    __metadata("design:type", Object)
], Exam.prototype, "createdAt", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", Number)
], Exam.prototype, "creatorId", void 0);
Exam = __decorate([
    typeorm_1.Entity()
], Exam);
exports.Exam = Exam;
//# sourceMappingURL=exam.entity.js.map