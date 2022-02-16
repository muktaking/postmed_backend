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
const platform_express_1 = require("@nestjs/platform-express");
const multer_1 = require("multer");
const roles_decorator_1 = require("../roles.decorator");
const file_uploading_utils_1 = require("../utils/file-uploading.utils");
const user_entity_1 = require("./user.entity");
const users_service_1 = require("./users.service");
let UsersController = class UsersController {
    constructor(userService) {
        this.userService = userService;
    }
    async getUserById(req) {
        return await this.userService.findOneUser(req.user.email);
    }
    async changeAvatar(req, name) {
        return await this.userService.changeAvatar(req.user.id, name);
    }
    async createUsersByUpload(res, file) {
        return await this.userService.createUsersByUpload(res, file);
    }
    async editUser(editUser, req) {
        return await this.userService.editUser(editUser, req.user);
    }
    async deleteUser(id) {
        return await this.userService.deleteUser(id);
    }
};
__decorate([
    common_1.Get(),
    common_1.UseGuards(passport_1.AuthGuard('jwt')),
    __param(0, common_1.Req()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "getUserById", null);
__decorate([
    common_1.Post('/avatar/:name'),
    common_1.UseGuards(passport_1.AuthGuard('jwt')),
    __param(0, common_1.Req()), __param(1, common_1.Param('name')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "changeAvatar", null);
__decorate([
    common_1.Post('/files'),
    common_1.UseGuards(passport_1.AuthGuard('jwt')),
    roles_decorator_1.Role(user_entity_1.RolePermitted.coordinator),
    common_1.UseInterceptors(platform_express_1.FileInterceptor('file', {
        storage: multer_1.diskStorage({
            destination: './uploads/files',
            filename: file_uploading_utils_1.editFileName,
        }),
        fileFilter: file_uploading_utils_1.csvFileFilter,
    })),
    __param(0, common_1.Res()), __param(1, common_1.UploadedFile()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "createUsersByUpload", null);
__decorate([
    common_1.Put('/:id'),
    common_1.UseGuards(passport_1.AuthGuard('jwt')),
    roles_decorator_1.Role(user_entity_1.RolePermitted.student),
    __param(0, common_1.Body()), __param(1, common_1.Req()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "editUser", null);
__decorate([
    common_1.Delete('/:id'),
    common_1.UseGuards(passport_1.AuthGuard('jwt')),
    roles_decorator_1.Role(user_entity_1.RolePermitted.coordinator),
    __param(0, common_1.Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "deleteUser", null);
UsersController = __decorate([
    common_1.Controller('users'),
    __metadata("design:paramtypes", [users_service_1.UsersService])
], UsersController);
exports.UsersController = UsersController;
//# sourceMappingURL=users.controller.js.map