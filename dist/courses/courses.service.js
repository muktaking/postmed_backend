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
const user_entity_1 = require("../users/user.entity");
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
    async createCourse(createCourseDto, imagePath, creator) {
        const { title, description, price, startDate, endDate } = createCourseDto;
        const course = new course_entity_1.Course();
        course.title = title;
        course.description = description;
        course.price = price ? +price : null;
        course.imageUrl = imagePath;
        course.startDate = startDate;
        course.endDate = endDate;
        course.creatorId = +creator;
        const [err, result] = await utils_1.to(course.save());
        if (err) {
            throw new common_1.InternalServerErrorException();
        }
        return { message: 'Created Course Successfully' };
    }
    async findAllCourses(user = null) {
        if (user &&
            (user.role === user_entity_1.RolePermitted.mentor ||
                user.role === user_entity_1.RolePermitted.moderator)) {
            const [error, userDetails] = await utils_1.to(this.userRepository.findOne({
                where: { id: user.id },
                relations: ['accessRight'],
            }));
            if (error)
                throw new common_1.InternalServerErrorException(error.message);
            if (userDetails.accessRight) {
                const accessableCourseIds = userDetails.accessRight.accessableCourseIds;
                const [err, courses] = await utils_1.to(this.courseRepository.find({
                    where: {
                        id: typeorm_2.In(accessableCourseIds),
                        endDate: typeorm_2.MoreThanOrEqual(new Date()),
                    },
                    order: { startDate: 'DESC' },
                }));
                if (err)
                    throw new common_1.InternalServerErrorException(err.message);
                return courses;
            }
            return null;
        }
        const [err, courses] = await utils_1.to(this.courseRepository.find({
            where: { endDate: typeorm_2.MoreThanOrEqual(new Date()) },
            order: { startDate: 'DESC' },
        }));
        if (err)
            throw new common_1.InternalServerErrorException();
        return courses;
    }
    async findAllRawCourses() {
        const [err, courses] = await utils_1.to(this.courseRepository.find({
            order: { startDate: 'DESC' },
        }));
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
            order: { startDate: 'DESC' },
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
    async updateCourseById(courseUpdated, id, imagePath) {
        const { title, description, price, startDate, endDate } = courseUpdated;
        const [err, course] = await utils_1.to(this.courseRepository.findOne({ id: +id }));
        if (err)
            throw new common_1.InternalServerErrorException(err.message);
        course.title = title;
        course.description = description;
        course.price = price;
        course.startDate = startDate;
        course.endDate = endDate;
        if (imagePath) {
            const [delImageErr, delImageRes] = await utils_1.to(utils_1.deleteImageFile(course.imageUrl));
            if (delImageErr)
                throw new common_1.InternalServerErrorException(delImageErr.message);
            if (delImageRes) {
                course.imageUrl = imagePath;
            }
        }
        const [err1, result] = await utils_1.to(course.save());
        if (err1)
            throw new common_1.InternalServerErrorException(err1.message);
        return { message: 'Successfuly Edited the course' };
    }
    async deleteCourseById(id) {
        const [err, course] = await utils_1.to(this.courseRepository.findOne({ id: +id }));
        if (err)
            throw new common_1.InternalServerErrorException();
        const [delImageErr, delImageRes] = await utils_1.to(utils_1.deleteImageFile(course.imageUrl));
        if (delImageErr)
            throw new common_1.InternalServerErrorException(delImageErr.message);
        if (delImageRes) {
            const [error, result] = await utils_1.to(this.courseRepository.delete({ id: +id }));
            if (error)
                throw new common_1.InternalServerErrorException();
            return { message: 'Successfuly deleted the course' };
        }
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
            if (!course.price) {
                if (course.enrolledStuIds) {
                    course.enrolledStuIds.push(+stuId);
                }
                else {
                    course.enrolledStuIds = [+stuId];
                }
                const [err, result] = await utils_1.to(course.save());
                if (err)
                    throw new common_1.InternalServerErrorException();
                return {
                    message: 'You have successfully enrolled. Please enjoy the exam.',
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
    async expectedEnrolledStuInfo(user) {
        let accessableCourseIds = null;
        let courses = null;
        let err = null;
        if (user.role === user_entity_1.RolePermitted.moderator) {
            const [error, userDetails] = await utils_1.to(this.userRepository.findOne({
                where: { id: user.id },
                relations: ['accessRight'],
            }));
            if (error)
                throw new common_1.InternalServerErrorException(error.message);
            if (userDetails.accessRight) {
                accessableCourseIds = userDetails.accessRight.accessableCourseIds;
                [err, courses] = await utils_1.to(this.courseRepository.find({
                    select: [
                        'id',
                        'title',
                        'startDate',
                        'endDate',
                        'expectedEnrolledStuIds',
                    ],
                    where: { id: typeorm_2.In(accessableCourseIds) },
                    order: { startDate: 'DESC' },
                }));
                if (err)
                    throw new common_1.InternalServerErrorException();
            }
            else {
                return [];
            }
        }
        else {
            [err, courses] = await utils_1.to(this.courseRepository.find({
                select: [
                    'id',
                    'title',
                    'startDate',
                    'endDate',
                    'expectedEnrolledStuIds',
                ],
                order: { startDate: 'DESC' },
            }));
            if (err)
                throw new common_1.InternalServerErrorException();
        }
        if (courses) {
            const coursesWithStuInfos = [];
            for (const course of courses) {
                const expectedEnrolledStuIds = course.expectedEnrolledStuIds
                    ? course.expectedEnrolledStuIds
                    : [];
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
    async findAllEnrolledStudentNumberByCourseId(courseId) {
        const [err, course] = await utils_1.to(this.findCourseById(courseId));
        if (err)
            throw new common_1.InternalServerErrorException('All Enrolled Student Number Can Not Be Counted');
        return course.enrolledStuIds.length;
    }
    async findAllEnrolledStudentByCourseId(courseId) {
        const [err, course] = await utils_1.to(this.findCourseById(courseId));
        if (err)
            throw new common_1.InternalServerErrorException('All Enrolled Student Number Can Not Be Counted');
        return course.enrolledStuIds;
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