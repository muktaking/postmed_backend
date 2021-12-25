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
const user_entity_1 = require("./user.entity");
const user_repository_1 = require("./user.repository");
let UsersService = class UsersService {
    constructor(userRepository) {
        this.userRepository = userRepository;
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
        let { id, firstName, lastName, userName, password, email, gender, role, identityStatus, mobile, institution, faculty, address, } = editUser;
        const [err, user] = await utils_1.to(this.userRepository.findOne(+id));
        if (err) {
            console.log(err);
            throw new common_1.InternalServerErrorException();
        }
        if (userStat.role >= user_entity_1.RolePermitted.admin) {
            user.firstName = firstName;
            user.lastName = lastName;
            user.userName = userName;
            user.email = email;
            user.gender = gender;
            user.mobile = mobile;
            user.role = +role;
            user.identityStatus = +identityStatus;
            if (password) {
                const salt = await bcrypt.genSalt(10);
                user.password = await bcrypt.hash(password, salt);
            }
        }
        if (+id === userStat.id && user.role < user_entity_1.RolePermitted.admin) {
            user.firstName = firstName;
            user.lastName = lastName;
            user.userName = userName;
            user.email = email;
            user.gender = gender;
            user.mobile = mobile;
            user.institution = institution;
            user.faculty = faculty;
            user.address = address;
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
    async findAllUsers(userRole) {
        return await this.userRepository.find({
            select: [
                'id',
                'firstName',
                'userName',
                'lastName',
                'role',
                'email',
                'avatar',
                'createdAt',
                'gender',
                'loginProvider',
                'identityStatus',
                'mobile',
                'faculty',
                'institution',
            ],
            where: {
                role: typeorm_2.LessThan(userRole),
            },
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
};
UsersService = __decorate([
    common_1.Injectable(),
    __param(0, typeorm_1.InjectRepository(user_repository_1.UserRepository)),
    __metadata("design:paramtypes", [user_repository_1.UserRepository])
], UsersService);
exports.UsersService = UsersService;
//# sourceMappingURL=users.service.js.map