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
const typeorm_1 = require("typeorm");
const exam_entity_1 = require("./exam.entity");
const profile_entity_1 = require("./profile.entity");
function percentage(num, per) {
    return (num / 100) * per;
}
let ExamProfile = class ExamProfile extends typeorm_1.BaseEntity {
    updateAvgScore(v) {
        if (!this.averageScore)
            return v;
        return +((this.averageScore * (this.attemptNumbers - 1) +
            percentage(v, Math.floor(10 / (this.attemptNumbers - 1)))) /
            this.attemptNumbers).toFixed(2);
    }
};
__decorate([
    typeorm_1.BeforeInsert(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ExamProfile.prototype, "updateAvgScore", null);
__decorate([
    typeorm_1.PrimaryGeneratedColumn(),
    __metadata("design:type", Number)
], ExamProfile.prototype, "id", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", Number)
], ExamProfile.prototype, "examId", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], ExamProfile.prototype, "examTitle", void 0);
__decorate([
    typeorm_1.Column({ type: "enum", enum: exam_entity_1.ExamType }),
    __metadata("design:type", Number)
], ExamProfile.prototype, "examType", void 0);
__decorate([
    typeorm_1.Column({ default: 1 }),
    __metadata("design:type", Number)
], ExamProfile.prototype, "attemptNumbers", void 0);
__decorate([
    typeorm_1.Column({ type: "float", default: 0 }),
    __metadata("design:type", Number)
], ExamProfile.prototype, "averageScore", void 0);
__decorate([
    typeorm_1.Column({ type: "float", default: 0 }),
    __metadata("design:type", Number)
], ExamProfile.prototype, "totalMark", void 0);
__decorate([
    typeorm_1.Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" }),
    __metadata("design:type", typeorm_1.Timestamp)
], ExamProfile.prototype, "firstAttemptTime", void 0);
__decorate([
    typeorm_1.Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" }),
    __metadata("design:type", typeorm_1.Timestamp)
], ExamProfile.prototype, "lastAttemptTime", void 0);
__decorate([
    typeorm_1.ManyToOne(() => profile_entity_1.Profile, (profile) => profile.exams),
    __metadata("design:type", profile_entity_1.Profile)
], ExamProfile.prototype, "profile", void 0);
ExamProfile = __decorate([
    typeorm_1.Entity()
], ExamProfile);
exports.ExamProfile = ExamProfile;
//# sourceMappingURL=examProfile.entity.js.map