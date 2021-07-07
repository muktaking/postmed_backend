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
const typeorm_1 = require("@nestjs/typeorm");
const roles_decorator_1 = require("../roles.decorator");
const user_entity_1 = require("../users/user.entity");
const utils_1 = require("../utils/utils");
const typeorm_2 = require("typeorm");
const routine_entity_1 = require("./routine.entity");
const routine_repository_1 = require("./routine.repository");
let RoutineService = class RoutineService {
    constructor(routineRepository) {
        this.routineRepository = routineRepository;
    }
    async getRoutine() {
        const [err, routine] = await utils_1.to(this.routineRepository.find({
            where: {
                endDate: typeorm_2.MoreThanOrEqual(new Date()),
            },
        }));
        if (err) {
            console.log(err);
            throw new common_1.InternalServerErrorException();
        }
        return routine;
    }
    async getRawRoutine() {
        const [err, routine] = await utils_1.to(this.routineRepository.find());
        if (err) {
            console.log(err);
            throw new common_1.InternalServerErrorException();
        }
        return routine;
    }
    async getSyllabusById(id) {
        const [err, syllabus] = await utils_1.to(this.routineRepository.findOne(+id));
        if (err) {
            console.log(err);
            throw new common_1.InternalServerErrorException();
        }
        return syllabus;
    }
    async addASyllabus(addASyllabusDto) {
        const { startDate, endDate, syllabus } = addASyllabusDto;
        const routine = new routine_entity_1.Routine();
        routine.startDate = startDate;
        routine.endDate = endDate;
        routine.syllabus = syllabus;
        const [err, result] = await utils_1.to(routine.save());
        if (err) {
            console.log(err);
            throw new common_1.InternalServerErrorException();
        }
        return { message: 'Syllabus added successfully' };
    }
    async editASyllabus(addASyllabusDto) {
        const { id, startDate, endDate, syllabus } = addASyllabusDto;
        const [error, routine] = await utils_1.to(this.routineRepository.findOne(+id));
        if (error) {
            console.log(error);
            throw new common_1.InternalServerErrorException();
        }
        routine.startDate = startDate;
        routine.endDate = endDate;
        routine.syllabus = syllabus;
        const [err, result] = await utils_1.to(routine.save());
        if (err) {
            console.log(err);
            throw new common_1.InternalServerErrorException();
        }
        return { message: 'Syllabus edited successfully' };
    }
    async deleteASyllabus(id) {
        const [err, result] = await utils_1.to(this.routineRepository.delete(+id));
        if (err) {
            console.log(err);
            throw new common_1.InternalServerErrorException();
        }
        return { message: 'Syllabus deleted successfully' };
    }
};
__decorate([
    common_1.UseGuards(passport_1.AuthGuard('jwt')),
    roles_decorator_1.Role(user_entity_1.RolePermitted.admin),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], RoutineService.prototype, "getRawRoutine", null);
__decorate([
    common_1.UseGuards(passport_1.AuthGuard('jwt')),
    roles_decorator_1.Role(user_entity_1.RolePermitted.admin),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], RoutineService.prototype, "getSyllabusById", null);
__decorate([
    common_1.UseGuards(passport_1.AuthGuard('jwt')),
    roles_decorator_1.Role(user_entity_1.RolePermitted.admin),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], RoutineService.prototype, "addASyllabus", null);
__decorate([
    common_1.UseGuards(passport_1.AuthGuard('jwt')),
    roles_decorator_1.Role(user_entity_1.RolePermitted.admin),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], RoutineService.prototype, "editASyllabus", null);
__decorate([
    common_1.UseGuards(passport_1.AuthGuard('jwt')),
    roles_decorator_1.Role(user_entity_1.RolePermitted.admin),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], RoutineService.prototype, "deleteASyllabus", null);
RoutineService = __decorate([
    common_1.Injectable(),
    __param(0, typeorm_1.InjectRepository(routine_repository_1.RoutineRepository)),
    __metadata("design:paramtypes", [routine_repository_1.RoutineRepository])
], RoutineService);
exports.RoutineService = RoutineService;
//# sourceMappingURL=routine.service.js.map