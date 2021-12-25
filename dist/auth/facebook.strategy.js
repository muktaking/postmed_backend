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
const passport_1 = require("@nestjs/passport");
const typeorm_1 = require("@nestjs/typeorm");
const config = require("config");
const generator = require("generate-password");
const passport_facebook_1 = require("passport-facebook");
const user_entity_1 = require("../users/user.entity");
const user_repository_1 = require("../users/user.repository");
const utils_1 = require("../utils/utils");
const facebookConfig = config.get('facebook');
const jwtConfig = config.get('jwt');
let FacebookStrategy = class FacebookStrategy extends passport_1.PassportStrategy(passport_facebook_1.Strategy, 'facebook') {
    constructor(userRepository, jwtService) {
        super({
            clientID: process.env.APP_ID || facebookConfig.app_id,
            clientSecret: process.env.APP_SECRET || facebookConfig.app_secret,
            callbackURL: 'http://localhost:4000/auth/facebook/redirect',
            scope: 'email',
            profileFields: ['emails', 'name'],
        });
        this.userRepository = userRepository;
        this.jwtService = jwtService;
    }
    async validate(accessToken, refreshToken, profile, done) {
        const { id, name, emails } = profile;
        let payload;
        const [err, user] = await utils_1.to(this.userRepository.findOne({ fbId: id }));
        if (err)
            throw new common_1.InternalServerErrorException();
        if (user) {
            if (user.indentityStatus == user_entity_1.IdentityStatus.checked) {
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
                throw new common_1.UnauthorizedException('Admin does not approve you. Please contact with admin.');
            }
        }
        else {
            const newUser = new user_entity_1.User();
            newUser.fbId = id;
            newUser.firstName = name.givenName;
            newUser.lastName = name.familyName;
            newUser.email = emails[0].value;
            newUser.userName = name.givenName;
            newUser.password = generator
                .generateMultiple(3, {
                length: 10,
                uppercase: false,
            })
                .toString();
            newUser.loginProvider = user_entity_1.LoginProvider.facebook;
            newUser.identityStatus = user_entity_1.IdentityStatus.unchecked;
            newUser.avatar = 'boy';
            const [err, result] = await utils_1.to(newUser.save());
            console.log(err);
            if (err)
                throw new common_1.InternalServerErrorException();
        }
        done(null, payload);
    }
};
FacebookStrategy = __decorate([
    common_1.Injectable(),
    __param(0, typeorm_1.InjectRepository(user_repository_1.UserRepository)),
    __metadata("design:paramtypes", [user_repository_1.UserRepository,
        jwt_1.JwtService])
], FacebookStrategy);
exports.FacebookStrategy = FacebookStrategy;
//# sourceMappingURL=facebook.strategy.js.map