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
const courseBasedExamProfile_entity_1 = require("./courseBasedExamProfile.entity");
const courseBasedProfile_entity_1 = require("./courseBasedProfile.entity");
function percentage(num, per) {
    return (num / 100) * per;
}
let CoursesProfile = class CoursesProfile extends typeorm_1.BaseEntity {
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn(),
    __metadata("design:type", Number)
], CoursesProfile.prototype, "id", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", Number)
], CoursesProfile.prototype, "courseId", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], CoursesProfile.prototype, "courseTitle", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", Number)
], CoursesProfile.prototype, "totalScore", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", Number)
], CoursesProfile.prototype, "totalMark", void 0);
__decorate([
    typeorm_1.ManyToOne(() => courseBasedProfile_entity_1.CourseBasedProfile, (courseBasedProfile) => courseBasedProfile.courses),
    __metadata("design:type", courseBasedProfile_entity_1.CourseBasedProfile)
], CoursesProfile.prototype, "profile", void 0);
__decorate([
    typeorm_1.OneToMany(() => courseBasedExamProfile_entity_1.CourseBasedExamProfile, (courseBasedExamProfile) => courseBasedExamProfile.course),
    __metadata("design:type", Array)
], CoursesProfile.prototype, "exams", void 0);
CoursesProfile = __decorate([
    typeorm_1.Entity()
], CoursesProfile);
exports.CoursesProfile = CoursesProfile;
//# sourceMappingURL=coursesProfile.entity.js.map