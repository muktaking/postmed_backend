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
const bcrypt = require("bcryptjs");
const csv = require("csv-parser");
const fs = require("fs");
const utils_1 = require("../utils/utils");
const typeorm_2 = require("typeorm");
const accessRight_repository_1 = require("./accessRight.repository");
const user_entity_1 = require("./user.entity");
const user_repository_1 = require("./user.repository");
let UsersService = class UsersService {
    constructor(userRepository, accessRightRepository) {
        this.userRepository = userRepository;
        this.accessRightRepository = accessRightRepository;
    }
    async createUser(createUserDto) {
        let { firstName, lastName, userName, password, email, gender, } = createUserDto;
        const user = new user_entity_1.User();
        user.firstName = firstName;
        user.lastName = lastName;
        user.userName = userName;
        user.email = email;
        user.avatar = 'boy';
        user.gender = gender;
        try {
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(password, salt);
            await user.save();
            return user;
        }
        catch (error) {
            console.log(error);
            if (error.code == 11000) {
                throw new common_1.ConflictException(`Email: ['${email}'] is already exist.`);
            }
            else
                throw new common_1.InternalServerErrorException();
        }
    }
    async createUsersByUpload(res, file) {
        const results = [];
        fs.createReadStream(file.path)
            .pipe(csv())
            .on('data', (data) => results.push(data))
            .on('end', () => {
            fs.unlink(file.path, (err) => {
                if (err) {
                    console.log(err);
                }
            });
            Promise.all(results.map(async (user) => {
                await this.createUser(user);
            }))
                .then((response) => {
                res.json({ message: 'Successfully Uploaded Users' });
            })
                .catch((error) => {
                res.status(common_1.HttpStatus.CONFLICT).json({ message: error.message });
            });
        });
    }
    async editUser(editUser, userStat) {
        let { id, firstName, lastName, userName, password, email, gender, role, identityStatus, mobile, institution, faculty, address, accessableCourseIds, canCreateExam, } = editUser;
        const [err, user] = await utils_1.to(this.userRepository.findOne({
            where: { id: +id },
            relations: ['accessRight'],
        }));
        if (err)
            throw new common_1.InternalServerErrorException(err.message);
        if (+id === userStat || userStat.role >= user_entity_1.RolePermitted.mentor) {
            user.firstName = firstName;
            user.lastName = lastName;
            user.userName = userName;
            user.gender = gender;
        }
        if (+id === userStat || userStat.role >= user_entity_1.RolePermitted.moderator) {
            user.email = email;
            user.mobile = mobile;
            user.institution = institution;
            user.faculty = faculty;
            user.address = address;
            if (password) {
                const salt = await bcrypt.genSalt(10);
                user.password = await bcrypt.hash(password, salt);
            }
        }
        if (userStat.role >= user_entity_1.RolePermitted.coordinator) {
            user.role =
                +role > user_entity_1.RolePermitted.coordinator ? user_entity_1.RolePermitted.moderator : +role;
            user.identityStatus = +identityStatus;
            if (accessableCourseIds && accessableCourseIds.length > 0) {
                if (+role > user_entity_1.RolePermitted.student &&
                    +role < user_entity_1.RolePermitted.coordinator) {
                    if (user.accessRight) {
                        user.accessRight.accessableCourseIds = accessableCourseIds;
                        user.accessRight.canCreateExam =
                            canCreateExam === '1' ? true : false;
                        const [error, accessRightResponse] = await utils_1.to(user.accessRight.save());
                        if (error)
                            throw new common_1.InternalServerErrorException(error.message);
                    }
                    else {
                        const accessRight = this.accessRightRepository.create({
                            accessableCourseIds: accessableCourseIds,
                            canCreateExam: canCreateExam === '1' ? true : false,
                        });
                        const [error, accessRightResponse] = await utils_1.to(accessRight.save());
                        if (error)
                            throw new common_1.InternalServerErrorException(error.message);
                        user.accessRight = accessRight;
                    }
                }
            }
        }
        try {
            await user.save();
            return { message: 'User edited successfully' };
        }
        catch (error) {
            console.log(error);
            if (error.code == 11000) {
                throw new common_1.ConflictException(`Email: ['${email}'] is already exist.`);
            }
            else
                throw new common_1.InternalServerErrorException();
        }
    }
    async deleteUser(id) {
        const [err, result] = await utils_1.to(this.userRepository.delete(+id));
        if (err) {
            throw new common_1.InternalServerErrorException();
        }
        return { message: `User deleted successfully` };
    }
    async findAllUsers(user) {
        return await this.userRepository.find({
            where: {
                role: typeorm_2.LessThanOrEqual(user.role),
            },
            relations: ['accessRight'],
        });
    }
    async findOneUser(email, nameOnly = false, isForAuth = false) {
        if (nameOnly) {
            const [err, user] = await utils_1.to(this.userRepository.findOne({ email }, { select: ['id', 'firstName', 'lastName'] }));
            if (err)
                throw new common_1.InternalServerErrorException();
            if (user == null)
                return;
            return { name: user.firstName + ' ' + user.lastName, id: user.id };
        }
        if (isForAuth) {
            const [err, user] = await utils_1.to(this.userRepository.findOne({ email: email }, { select: ['id', 'email', 'password', 'role'] }));
            if (err)
                throw new common_1.InternalServerErrorException();
            return user;
        }
        const [err, user] = await utils_1.to(this.userRepository.findOne({ email: email }, {
            select: [
                'id',
                'firstName',
                'userName',
                'lastName',
                'role',
                'email',
                'avatar',
                'createdAt',
                'mobile',
                'faculty',
                'institution',
                'address',
                'gender',
            ],
        }));
        if (err)
            throw new common_1.InternalServerErrorException();
        return user;
    }
    async findOneUserById(id, nameOnly = false, isForAuth = false) {
        if (nameOnly) {
            const [err, user] = await utils_1.to(this.userRepository.findOne({ id: +id }, { select: ['id', 'firstName', 'lastName'] }));
            if (err)
                throw new common_1.InternalServerErrorException();
            if (user == null)
                return;
            return { name: user.firstName + ' ' + user.lastName, id: user.id };
        }
        if (isForAuth) {
            const [err, user] = await utils_1.to(this.userRepository.findOne({ id: +id }, { select: ['id', 'email', 'password', 'role'] }));
            if (err)
                throw new common_1.InternalServerErrorException();
            return user;
        }
        const [err, user] = await utils_1.to(this.userRepository.findOne({ id: +id }, {
            select: [
                'id',
                'firstName',
                'userName',
                'lastName',
                'role',
                'email',
                'avatar',
                'createdAt',
                'mobile',
                'faculty',
                'institution',
                'address',
                'gender',
            ],
        }));
        if (err)
            throw new common_1.InternalServerErrorException();
        return user;
    }
    async findAllStudentNumber() {
        const [err, result] = await utils_1.to(this.userRepository
            .createQueryBuilder('user')
            .where('user.role = :role', { role: user_entity_1.RolePermitted.student.toString() })
            .getCount());
        if (err)
            return 100;
        return result;
    }
    async changeAvatar(id, name) {
        const [err, result] = await utils_1.to(this.userRepository.update(id, { avatar: name }));
        if (err) {
            console.log(err);
            throw new common_1.HttpException('Avatart can not be updated', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
        return result;
    }
    async getAccessRight(id) {
        const [err, user] = await utils_1.to(this.userRepository.findOne({
            where: { id: +id },
            relations: ['accessRight'],
        }));
        if (err)
            throw new common_1.InternalServerErrorException(err.message);
        return user.accessRight;
    }
};
UsersService = __decorate([
    common_1.Injectable(),
    __param(0, typeorm_1.InjectRepository(user_repository_1.UserRepository)),
    __param(1, typeorm_1.InjectRepository(accessRight_repository_1.AccessRightRepository)),
    __metadata("design:paramtypes", [user_repository_1.UserRepository,
        accessRight_repository_1.AccessRightRepository])
], UsersService);
exports.UsersService = UsersService;
//# sourceMappingURL=users.service.js.map