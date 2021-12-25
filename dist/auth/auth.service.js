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
const jwt_1 = require("@nestjs/jwt");
const typeorm_1 = require("@nestjs/typeorm");
const bcrypt = require("bcryptjs");
const config = require("config");
const crypto = require("crypto");
const generator = require("generate-password");
const _ = require("lodash");
const nodemailer = require("nodemailer");
const user_entity_1 = require("../users/user.entity");
const user_repository_1 = require("../users/user.repository");
const utils_1 = require("../utils/utils");
const typeorm_2 = require("typeorm");
const users_service_1 = require("../users/users.service");
const moment = require('moment');
const jwtConfig = config.get('jwt');
const emailConfig = config.get('email');
const baseSiteConfig = config.get('base_site');
let AuthService = class AuthService {
    constructor(userRepository, usersService, jwtService) {
        this.userRepository = userRepository;
        this.usersService = usersService;
        this.jwtService = jwtService;
    }
    async validateUser(email, password) {
        let user = await this.usersService.findOneUser(email, false, true);
        if (user) {
            const isValid = await bcrypt.compare(password, user.password);
            user = isValid ? _.pick(user, ['email', 'role', 'id']) : null;
            return user;
        }
        return null;
    }
    async login(user) {
        const payload = {
            email: user.email,
            id: user.id,
            role: user.role,
        };
        const accessToken = await this.jwtService.sign(payload);
        return {
            accessToken,
            id: user.id,
            expireIn: process.env.JWT_EXPIRESIN || jwtConfig.expiresIn,
        };
    }
    async reset(email) {
        console.log(email);
        crypto.randomBytes(32, (err, buffer) => {
            if (err) {
                console.log(err);
                throw new common_1.InternalServerErrorException();
            }
            const token = buffer.toString('hex');
            this.userRepository
                .findOne({ email })
                .then((user) => {
                if (!user) {
                    throw new common_1.HttpException('User is not available', common_1.HttpStatus.NOT_FOUND);
                }
                user.resetToken = token;
                user.resetTokenExpiration = moment()
                    .add(3 * 60 * 60 * 1000, 'milliseconds')
                    .format('YYYY-MM-DD HH:mm:ss');
                user
                    .save()
                    .then((saved) => {
                    let transporter = nodemailer.createTransport({
                        host: process.env.EMAIL_HOST || emailConfig.host,
                        port: process.env.EMAIL_PORT || emailConfig.port,
                        secure: process.env.IS_SECURE || emailConfig.is_secure,
                        auth: {
                            user: process.env.EMAIL_USER || emailConfig.user,
                            pass: process.env.EMAIL_PASSWORD || emailConfig.password,
                        },
                        tls: {
                            rejectUnauthorized: false,
                        },
                    });
                    let mailOptions = {
                        from: `"No-reply" <${process.env.EMAIL_USER ||
                            emailConfig.user}>`,
                        to: email,
                        subject: 'Reset Your Password, ',
                        html: `<h3>Reset Your Password</h3>
                          <p>If you request for password reset, click this <a href="${process
                            .env.BASE_SITE_URL ||
                            baseSiteConfig.url}/reset/${token}">reset link</a></p>
                  `,
                    };
                    transporter.sendMail(mailOptions, (error, info) => {
                        if (error) {
                            console.log(error);
                        }
                        console.log(info);
                    });
                    return { message: 'Reset password successfull' };
                })
                    .catch((err) => {
                    console.log(err);
                });
            })
                .catch((err) => {
                console.log(err);
            });
        });
    }
    async resetPassword(token, password) {
        const newPassword = password;
        const passwordToken = token;
        const [err, user] = await utils_1.to(this.userRepository.findOne({
            where: {
                resetToken: passwordToken,
                resetTokenExpiration: typeorm_2.MoreThan(moment().format('YYYY-MM-DD HH:mm:ss')),
            },
        }));
        if (err) {
            throw new common_1.InternalServerErrorException();
        }
        if (user) {
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(password, salt);
            user.resetToken = null;
            user.resetTokenExpiration = undefined;
            await user.save();
            return { message: 'Password reset Successfully' };
        }
        else {
            throw new common_1.HttpException('Password Can not be resetted. Reset token may ne expired', common_1.HttpStatus.GONE);
        }
    }
    async facebookLogin({ userID, name, email, accessToken, picture }) {
        let payload;
        const [err, user] = await utils_1.to(this.userRepository.findOne({ fbId: userID }));
        if (err)
            throw new common_1.InternalServerErrorException();
        if (user) {
            if (user.identityStatus == user_entity_1.IdentityStatus.checked) {
                payload = {
                    email: user.email,
                    id: user.id,
                    role: user.role,
                };
                accessToken = await this.jwtService.sign(payload);
                return {
                    accessToken,
                    id: user.id,
                    expireIn: process.env.JWT_EXPIRESIN || jwtConfig.expiresIn,
                };
            }
            else {
                throw new common_1.UnauthorizedException('Admin has not approved your account. Please contact with admin.');
            }
        }
        else {
            const newUser = new user_entity_1.User();
            newUser.fbId = userID;
            newUser.firstName = name.split(' ')[0];
            newUser.lastName = name.split(' ').reverse()[0];
            newUser.email = email;
            newUser.userName = name.split(' ')[0];
            newUser.password = generator
                .generateMultiple(3, {
                length: 10,
                uppercase: false,
            })
                .toString();
            newUser.loginProvider = user_entity_1.LoginProvider.facebook;
            newUser.identityStatus = user_entity_1.IdentityStatus.unchecked;
            newUser.avatar = picture.data.url;
            const [err, result] = await utils_1.to(newUser.save());
            console.log(err);
            if (err)
                throw new common_1.InternalServerErrorException();
            return { message: 'Wait until Admin approve your account.' };
        }
    }
};
AuthService = __decorate([
    common_1.Injectable(),
    __param(0, typeorm_1.InjectRepository(user_repository_1.UserRepository)),
    __metadata("design:paramtypes", [user_repository_1.UserRepository,
        users_service_1.UsersService,
        jwt_1.JwtService])
], AuthService);
exports.AuthService = AuthService;
//# sourceMappingURL=auth.service.js.map