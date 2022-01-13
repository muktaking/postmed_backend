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
const exam_entity_1 = require("../exams/exam.entity");
const userExamCourseProfile_entity_1 = require("./userExamCourseProfile.entity");
let UserExamExamProfile = class UserExamExamProfile extends typeorm_1.BaseEntity {
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn(),
    __metadata("design:type", Number)
], UserExamExamProfile.prototype, "id", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", Number)
], UserExamExamProfile.prototype, "examId", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], UserExamExamProfile.prototype, "examTitle", void 0);
__decorate([
    typeorm_1.Column({ type: 'enum', enum: exam_entity_1.ExamType }),
    __metadata("design:type", Number)
], UserExamExamProfile.prototype, "examType", void 0);
__decorate([
    typeorm_1.Column({ default: 1 }),
    __metadata("design:type", Number)
], UserExamExamProfile.prototype, "attemptNumbers", void 0);
__decorate([
    typeorm_1.Column({ type: 'simple-array', default: 0 }),
    __metadata("design:type", Array)
], UserExamExamProfile.prototype, "score", void 0);
__decorate([
    typeorm_1.Column({ type: 'float', default: 0 }),
    __metadata("design:type", Number)
], UserExamExamProfile.prototype, "totalMark", void 0);
__decorate([
    typeorm_1.Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' }),
    __metadata("design:type", typeorm_1.Timestamp)
], UserExamExamProfile.prototype, "firstAttemptTime", void 0);
__decorate([
    typeorm_1.Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' }),
    __metadata("design:type", Object)
], UserExamExamProfile.prototype, "lastAttemptTime", void 0);
__decorate([
    typeorm_1.ManyToOne(() => userExamCourseProfile_entity_1.UserExamCourseProfile, (userExamcourseProfile) => userExamcourseProfile.exams),
    __metadata("design:type", userExamCourseProfile_entity_1.UserExamCourseProfile)
], UserExamExamProfile.prototype, "course", void 0);
UserExamExamProfile = __decorate([
    typeorm_1.Entity()
], UserExamExamProfile);
exports.UserExamExamProfile = UserExamExamProfile;
//# sourceMappingURL=userExamExamProfile.entity.js.map