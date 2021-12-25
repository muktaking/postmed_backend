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
var RolePermitted;
(function (RolePermitted) {
    RolePermitted[RolePermitted["guest"] = 0] = "guest";
    RolePermitted[RolePermitted["student"] = 1] = "student";
    RolePermitted[RolePermitted["mentor"] = 2] = "mentor";
    RolePermitted[RolePermitted["moderator"] = 3] = "moderator";
    RolePermitted[RolePermitted["coordinator"] = 4] = "coordinator";
    RolePermitted[RolePermitted["admin"] = 5] = "admin";
})(RolePermitted = exports.RolePermitted || (exports.RolePermitted = {}));
var Faculty;
(function (Faculty) {
    Faculty[Faculty["basic"] = 0] = "basic";
    Faculty[Faculty["medicine"] = 1] = "medicine";
    Faculty[Faculty["surgery"] = 2] = "surgery";
    Faculty[Faculty["gynecology"] = 3] = "gynecology";
    Faculty[Faculty["paediatrics"] = 4] = "paediatrics";
})(Faculty = exports.Faculty || (exports.Faculty = {}));
var LoginProvider;
(function (LoginProvider) {
    LoginProvider[LoginProvider["local"] = 0] = "local";
    LoginProvider[LoginProvider["facebook"] = 1] = "facebook";
})(LoginProvider = exports.LoginProvider || (exports.LoginProvider = {}));
var IdentityStatus;
(function (IdentityStatus) {
    IdentityStatus[IdentityStatus["unchecked"] = 0] = "unchecked";
    IdentityStatus[IdentityStatus["checked"] = 1] = "checked";
    IdentityStatus[IdentityStatus["unrequired"] = 2] = "unrequired";
})(IdentityStatus = exports.IdentityStatus || (exports.IdentityStatus = {}));
var Gender;
(function (Gender) {
    Gender["male"] = "male";
    Gender["female"] = "female";
})(Gender = exports.Gender || (exports.Gender = {}));
let User = class User extends typeorm_1.BaseEntity {
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn(),
    __metadata("design:type", Number)
], User.prototype, "id", void 0);
__decorate([
    typeorm_1.Column({ type: 'bigint', nullable: true }),
    __metadata("design:type", String)
], User.prototype, "fbId", void 0);
__decorate([
    typeorm_1.Column({ type: 'varchar', length: 15, nullable: false }),
    __metadata("design:type", String)
], User.prototype, "firstName", void 0);
__decorate([
    typeorm_1.Column({ type: 'varchar', length: 15, nullable: false }),
    __metadata("design:type", String)
], User.prototype, "lastName", void 0);
__decorate([
    typeorm_1.Column({ type: 'varchar', length: 15, nullable: false }),
    __metadata("design:type", String)
], User.prototype, "userName", void 0);
__decorate([
    typeorm_1.Column({ type: 'varchar', length: 255, nullable: false }),
    __metadata("design:type", String)
], User.prototype, "avatar", void 0);
__decorate([
    typeorm_1.Column({ type: 'varchar', nullable: false }),
    __metadata("design:type", String)
], User.prototype, "password", void 0);
__decorate([
    typeorm_1.Column({ type: 'varchar', unique: true, nullable: false }),
    __metadata("design:type", String)
], User.prototype, "email", void 0);
__decorate([
    typeorm_1.Column({ type: 'enum', enum: Gender }),
    __metadata("design:type", String)
], User.prototype, "gender", void 0);
__decorate([
    typeorm_1.Column({ type: 'enum', enum: RolePermitted, default: RolePermitted.student }),
    __metadata("design:type", Number)
], User.prototype, "role", void 0);
__decorate([
    typeorm_1.Column({ type: 'enum', enum: LoginProvider, default: LoginProvider.local }),
    __metadata("design:type", Number)
], User.prototype, "loginProvider", void 0);
__decorate([
    typeorm_1.Column({
        type: 'enum',
        enum: IdentityStatus,
        default: IdentityStatus.unrequired,
    }),
    __metadata("design:type", Number)
], User.prototype, "identityStatus", void 0);
__decorate([
    typeorm_1.Column({ type: 'varchar', nullable: true }),
    __metadata("design:type", String)
], User.prototype, "mobile", void 0);
__decorate([
    typeorm_1.Column({ type: 'varchar', nullable: true }),
    __metadata("design:type", String)
], User.prototype, "institution", void 0);
__decorate([
    typeorm_1.Column({ type: 'enum', enum: Faculty, nullable: true }),
    __metadata("design:type", Number)
], User.prototype, "faculty", void 0);
__decorate([
    typeorm_1.Column({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], User.prototype, "address", void 0);
__decorate([
    typeorm_1.Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' }),
    __metadata("design:type", typeorm_1.Timestamp)
], User.prototype, "createdAt", void 0);
__decorate([
    typeorm_1.Column({ nullable: true }),
    __metadata("design:type", String)
], User.prototype, "resetToken", void 0);
__decorate([
    typeorm_1.Column({ type: 'timestamp', nullable: true }),
    __metadata("design:type", typeorm_1.Timestamp)
], User.prototype, "resetTokenExpiration", void 0);
User = __decorate([
    typeorm_1.Entity()
], User);
exports.User = User;
//# sourceMappingURL=user.entity.js.map