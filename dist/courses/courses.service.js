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
const typeorm_1 = require("@nestjs/typeorm");
const user_repository_1 = require("../users/user.repository");
const utils_1 = require("../utils/utils");
const typeorm_2 = require("typeorm");
const course_entity_1 = require("./course.entity");
const course_repository_1 = require("./course.repository");
let CoursesService = class CoursesService {
    constructor(courseRepository, userRepository) {
        this.courseRepository = courseRepository;
        this.userRepository = userRepository;
    }
    async createCourse(createCourseDto, creator) {
        const { title, description, startDate, endDate } = createCourseDto;
        const course = new course_entity_1.Course();
        course.title = title;
        course.description = description;
        course.startDate = startDate;
        course.endDate = endDate;
        course.creatorId = +creator;
        const [err, result] = await utils_1.to(course.save());
        if (err) {
            throw new common_1.InternalServerErrorException();
        }
        return result;
    }
    async findAllCourses() {
        const [err, courses] = await utils_1.to(this.courseRepository.find());
        if (err)
            throw new common_1.InternalServerErrorException();
        return courses;
    }
    async findAllCoursesEnrolledByStudent(stuId) {
        const [err, courses] = await utils_1.to(this.courseRepository.find({
            where: [
                {
                    enrolledStuIds: typeorm_2.Like(stuId),
                },
                {
                    enrolledStuIds: typeorm_2.Like('%,' + stuId + ',%'),
                },
                {
                    enrolledStuIds: typeorm_2.Like(stuId + ',%'),
                },
                {
                    enrolledStuIds: typeorm_2.Like('%,' + stuId),
                },
            ],
        }));
        console.log(err);
        if (err)
            throw new common_1.InternalServerErrorException();
        return courses;
    }
    async findCourseById(id) {
        const [err, course] = await utils_1.to(this.courseRepository.findOne({ id: +id }));
        if (err)
            throw new common_1.InternalServerErrorException();
        return course;
    }
    async updateCourseById(courseUpdated, id) {
        const { title, description, startDate, endDate } = courseUpdated;
        const [err, course] = await utils_1.to(this.courseRepository.findOne({ id: +id }));
        if (err)
            throw new common_1.InternalServerErrorException();
        course.title = title;
        course.description = description;
        course.startDate = startDate;
        course.endDate = endDate;
        const [err1, result] = await utils_1.to(course.save());
        if (err1)
            throw new common_1.InternalServerErrorException();
        return result;
    }
    async deleteCourseById(id) {
        const [err, result] = await utils_1.to(this.courseRepository.delete({ id: +id }));
        if (err)
            throw new common_1.InternalServerErrorException();
        return result;
    }
    async enrollmentRequestedByStudent(courseId, stuId) {
        const course = await this.findCourseById(courseId);
        if (course) {
            if (course.enrolledStuIds &&
                course.enrolledStuIds.includes(stuId.toString())) {
                return {
                    message: 'You have already enrolled. Please enjoy the exam.',
                };
            }
            if (course.expectedEnrolledStuIds &&
                course.expectedEnrolledStuIds.includes(stuId.toString())) {
                return {
                    message: 'You have already requested for enrollment. Please wait for the admin approval.',
                };
            }
            else
                course.expectedEnrolledStuIds
                    ? course.expectedEnrolledStuIds.push(+stuId)
                    : (course.expectedEnrolledStuIds = [+stuId]);
        }
        const [err, result] = await utils_1.to(course.save());
        if (err)
            throw new common_1.InternalServerErrorException();
        return {
            message: 'Your enrollment order is placed. Please wait for the admin approval.',
        };
    }
    async expectedEnrolledStuByCourseId(courseId) {
        const course = await this.findCourseById(courseId);
        if (course) {
            const expectedEnrolledStuIds = course.expectedEnrolledStuIds;
            const [err, stuInfos] = await utils_1.to(this.userRepository.find({
                select: [
                    'id',
                    'firstName',
                    'lastName',
                    'email',
                    'institution',
                    'faculty',
                ],
                where: { id: typeorm_2.In(expectedEnrolledStuIds) },
            }));
            if (err)
                throw new common_1.InternalServerErrorException();
            return stuInfos;
        }
    }
    async expectedEnrolledStuInfo() {
        const [err, courses] = await utils_1.to(this.courseRepository.find({
            select: [
                'id',
                'title',
                'startDate',
                'endDate',
                'expectedEnrolledStuIds',
            ],
        }));
        if (err)
            throw new common_1.InternalServerErrorException();
        if (courses) {
            const coursesWithStuInfos = [];
            for (const course of courses) {
                const expectedEnrolledStuIds = course.expectedEnrolledStuIds;
                const [err, stuInfos] = await utils_1.to(this.userRepository.find({
                    select: [
                        'id',
                        'firstName',
                        'lastName',
                        'email',
                        'institution',
                        'faculty',
                    ],
                    where: { id: typeorm_2.In(expectedEnrolledStuIds) },
                }));
                if (err)
                    throw new common_1.InternalServerErrorException();
                coursesWithStuInfos.push({
                    id: course.id,
                    title: course.title,
                    startDate: course.startDate,
                    endDate: course.endDate,
                    stuInfos,
                });
            }
            return coursesWithStuInfos;
        }
    }
    async approveOrDenyEnrollment(courseId, stuIds, deny = false) {
        const [err, course] = await utils_1.to(this.findCourseById(courseId));
        if (err)
            throw new common_1.InternalServerErrorException();
        stuIds.forEach((element) => {
            if (!deny) {
                course.enrolledStuIds
                    ? course.enrolledStuIds.push(element)
                    : (course.enrolledStuIds = [element]);
            }
            const index = course.expectedEnrolledStuIds.indexOf(element.toString());
            if (index > -1) {
                course.expectedEnrolledStuIds.splice(index, 1);
            }
        });
        const [err1, result] = await utils_1.to(course.save());
        if (err1)
            throw new common_1.InternalServerErrorException();
        return {
            message: deny ? 'Enrollment denied' : 'Enrollment successful',
        };
    }
};
CoursesService = __decorate([
    common_1.Injectable(),
    __param(0, typeorm_1.InjectRepository(course_repository_1.CourseRepository)),
    __param(1, typeorm_1.InjectRepository(user_repository_1.UserRepository)),
    __metadata("design:paramtypes", [course_repository_1.CourseRepository,
        user_repository_1.UserRepository])
], CoursesService);
exports.CoursesService = CoursesService;
//# sourceMappingURL=courses.service.js.map