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
const courses_service_1 = require("./courses.service");
const course_dto_1 = require("./dto/course.dto");
let CoursesController = class CoursesController {
    constructor(courseService) {
        this.courseService = courseService;
    }
    async createExam(createCourseDto, req) {
        return await this.courseService.createCourse(createCourseDto, req.user.id);
    }
    async getAllCourses() {
        return await this.courseService.findAllCourses();
    }
    async getAllCoursesEnrolledByStudent(req) {
        return await this.courseService.findAllCoursesEnrolledByStudent(req.user.id);
    }
    async approveEnrollment(course) {
        return await this.courseService.approveOrDenyEnrollment(course.id, course.stuIds, Boolean(course.deny));
    }
    async getCourseById(id) {
        return await this.courseService.findCourseById(id);
    }
    async updateCourseById(createCourseDto, id) {
        return await this.courseService.updateCourseById(createCourseDto, id);
    }
    async deleteCourseById(id) {
        return await this.courseService.deleteCourseById(id);
    }
    async enrollmentRequestedByStudent(courseId, req) {
        return await this.courseService.enrollmentRequestedByStudent(courseId, req.user.id);
    }
};
__decorate([
    common_1.Post(),
    common_1.UseGuards(passport_1.AuthGuard('jwt'), roles_guard_1.RolesGuard),
    roles_decorator_1.Role(user_entity_1.RolePermitted.admin),
    common_1.UsePipes(common_1.ValidationPipe),
    __param(0, common_1.Body()), __param(1, common_1.Req()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [course_dto_1.CreateCourseDto, Object]),
    __metadata("design:returntype", Promise)
], CoursesController.prototype, "createExam", null);
__decorate([
    common_1.Get(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], CoursesController.prototype, "getAllCourses", null);
__decorate([
    common_1.Get('enrolled/courses'),
    common_1.UseGuards(passport_1.AuthGuard('jwt'), roles_guard_1.RolesGuard),
    roles_decorator_1.Role(user_entity_1.RolePermitted.student),
    __param(0, common_1.Req()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CoursesController.prototype, "getAllCoursesEnrolledByStudent", null);
__decorate([
    common_1.Patch('enrolled'),
    common_1.UseGuards(passport_1.AuthGuard('jwt'), roles_guard_1.RolesGuard),
    roles_decorator_1.Role(user_entity_1.RolePermitted.admin),
    __param(0, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CoursesController.prototype, "approveEnrollment", null);
__decorate([
    common_1.Get(':id'),
    __param(0, common_1.Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CoursesController.prototype, "getCourseById", null);
__decorate([
    common_1.Patch(':id'),
    __param(0, common_1.Body()),
    __param(1, common_1.Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [course_dto_1.CreateCourseDto, Object]),
    __metadata("design:returntype", Promise)
], CoursesController.prototype, "updateCourseById", null);
__decorate([
    common_1.Delete(':id'),
    __param(0, common_1.Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CoursesController.prototype, "deleteCourseById", null);
__decorate([
    common_1.Patch('enroll/:id'),
    common_1.UseGuards(passport_1.AuthGuard('jwt'), roles_guard_1.RolesGuard),
    roles_decorator_1.Role(user_entity_1.RolePermitted.student),
    __param(0, common_1.Param('id')), __param(1, common_1.Req()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], CoursesController.prototype, "enrollmentRequestedByStudent", null);
CoursesController = __decorate([
    common_1.Controller('courses'),
    __metadata("design:paramtypes", [courses_service_1.CoursesService])
], CoursesController);
exports.CoursesController = CoursesController;
//# sourceMappingURL=courses.controller.js.map