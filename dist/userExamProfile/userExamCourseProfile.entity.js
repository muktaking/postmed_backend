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
const userExamExamProfile_entity_1 = require("./userExamExamProfile.entity");
const userExamProfile_entity_1 = require("./userExamProfile.entity");
function percentage(num, per) {
    return (num / 100) * per;
}
let UserExamCourseProfile = class UserExamCourseProfile extends typeorm_1.BaseEntity {
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn(),
    __metadata("design:type", Number)
], UserExamCourseProfile.prototype, "id", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", Number)
], UserExamCourseProfile.prototype, "courseId", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], UserExamCourseProfile.prototype, "courseTitle", void 0);
__decorate([
    typeorm_1.Column({ type: 'numeric', precision: 10, scale: 2 }),
    __metadata("design:type", Number)
], UserExamCourseProfile.prototype, "totalScore", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", Number)
], UserExamCourseProfile.prototype, "totalMark", void 0);
__decorate([
    typeorm_1.ManyToOne(() => userExamProfile_entity_1.UserExamProfile, (userExamProfile) => userExamProfile.courses),
    __metadata("design:type", userExamProfile_entity_1.UserExamProfile)
], UserExamCourseProfile.prototype, "userExamProfile", void 0);
__decorate([
    typeorm_1.OneToMany(() => userExamExamProfile_entity_1.UserExamExamProfile, (userExamExamProfile) => userExamExamProfile.course, { cascade: true, eager: true }),
    __metadata("design:type", Array)
], UserExamCourseProfile.prototype, "exams", void 0);
UserExamCourseProfile = __decorate([
    typeorm_1.Entity()
], UserExamCourseProfile);
exports.UserExamCourseProfile = UserExamCourseProfile;
//# sourceMappingURL=userExamCourseProfile.entity.js.map