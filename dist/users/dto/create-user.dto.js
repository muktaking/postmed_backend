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
const class_validator_1 = require("class-validator");
const user_entity_1 = require("../user.entity");
const user_model_1 = require("../user.model");
class createUserDto {
}
__decorate([
    class_validator_1.IsString(),
    class_validator_1.IsNotEmpty(),
    class_validator_1.MaxLength(15),
    __metadata("design:type", String)
], createUserDto.prototype, "firstName", void 0);
__decorate([
    class_validator_1.IsOptional(),
    class_validator_1.IsString(),
    class_validator_1.MaxLength(15),
    __metadata("design:type", String)
], createUserDto.prototype, "lastName", void 0);
__decorate([
    class_validator_1.IsString(),
    class_validator_1.IsNotEmpty(),
    class_validator_1.MaxLength(15),
    __metadata("design:type", String)
], createUserDto.prototype, "userName", void 0);
__decorate([
    class_validator_1.IsString(),
    class_validator_1.IsNotEmpty(),
    class_validator_1.Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{6,})/, {
        message: 'Your Password is too weak',
    }),
    __metadata("design:type", String)
], createUserDto.prototype, "password", void 0);
__decorate([
    class_validator_1.IsEmail(),
    __metadata("design:type", String)
], createUserDto.prototype, "email", void 0);
__decorate([
    class_validator_1.IsNotEmpty(),
    class_validator_1.IsEnum(['male', 'female']),
    __metadata("design:type", String)
], createUserDto.prototype, "gender", void 0);
__decorate([
    class_validator_1.IsOptional(),
    __metadata("design:type", Number)
], createUserDto.prototype, "role", void 0);
__decorate([
    class_validator_1.IsOptional(),
    __metadata("design:type", String)
], createUserDto.prototype, "mobile", void 0);
__decorate([
    class_validator_1.IsOptional(),
    __metadata("design:type", String)
], createUserDto.prototype, "institution", void 0);
__decorate([
    class_validator_1.IsOptional(),
    __metadata("design:type", Number)
], createUserDto.prototype, "faculty", void 0);
__decorate([
    class_validator_1.IsOptional(),
    __metadata("design:type", String)
], createUserDto.prototype, "address", void 0);
exports.createUserDto = createUserDto;
//# sourceMappingURL=create-user.dto.js.map