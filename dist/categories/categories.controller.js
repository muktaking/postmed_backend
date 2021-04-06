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
const fs = require("fs");
const multer_1 = require("multer");
const sharp = require("sharp");
const roles_decorator_1 = require("../roles.decorator");
const roles_guard_1 = require("../roles.guard");
const user_entity_1 = require("../users/user.entity");
const file_uploading_utils_1 = require("../utils/file-uploading.utils");
const categories_service_1 = require("./categories.service");
const category_dto_1 = require("./dto/category.dto");
let CategoriesController = class CategoriesController {
    constructor(categoriesService) {
        this.categoriesService = categoriesService;
    }
    async getAllCategories() {
        return await this.categoriesService.findAllCategories();
    }
    async getCategory(req) {
        return await this.categoriesService.findCategoryBySlug("Top_" + req.params[0].replace("/", "_"));
    }
    async createCategory(createCategoryDto, image) {
        if (!image) {
            throw new Error("Image is not Selected");
        }
        const resizeImage = await sharp(image.path)
            .resize(350, 180)
            .png()
            .toBuffer();
        const resizeImageName = image.filename.split(".")[0] + "_350_180.png";
        const resizeImagePathName = "./uploads/images/" + resizeImageName;
        fs.writeFileSync(resizeImagePathName, resizeImage);
        return await this.categoriesService.createCategory(createCategoryDto, {
            filename: resizeImageName,
        });
    }
    async updateCategory(id, createCategoryDto, image) {
        return await this.categoriesService.updateCategory(id, createCategoryDto, image);
    }
    async deleteCategoryById(id) {
        return await this.categoriesService.deleteCategoryById(id);
    }
};
__decorate([
    common_1.Get(),
    roles_decorator_1.Role(user_entity_1.RolePermitted.mentor),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], CategoriesController.prototype, "getAllCategories", null);
__decorate([
    common_1.Get("/*"),
    roles_decorator_1.Role(user_entity_1.RolePermitted.mentor),
    __param(0, common_1.Req()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CategoriesController.prototype, "getCategory", null);
__decorate([
    common_1.Post(),
    roles_decorator_1.Role(user_entity_1.RolePermitted.moderator),
    common_1.UsePipes(common_1.ValidationPipe),
    common_1.UseInterceptors(platform_express_1.FileInterceptor("image", {
        storage: multer_1.diskStorage({
            destination: "./uploads/images",
            filename: file_uploading_utils_1.editFileName,
        }),
        fileFilter: file_uploading_utils_1.imageFileFilter,
    })),
    __param(0, common_1.Body()),
    __param(1, common_1.UploadedFile()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [category_dto_1.createCategoryDto, Object]),
    __metadata("design:returntype", Promise)
], CategoriesController.prototype, "createCategory", null);
__decorate([
    common_1.Patch(),
    roles_decorator_1.Role(user_entity_1.RolePermitted.moderator),
    common_1.UsePipes(common_1.ValidationPipe),
    common_1.UseInterceptors(platform_express_1.FileInterceptor("image", {
        storage: multer_1.diskStorage({
            destination: "./uploads/images",
            filename: file_uploading_utils_1.editFileName,
        }),
        fileFilter: file_uploading_utils_1.imageFileFilter,
    })),
    __param(0, common_1.Body("id")),
    __param(1, common_1.Body()),
    __param(2, common_1.UploadedFile()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, category_dto_1.createCategoryDto, Object]),
    __metadata("design:returntype", Promise)
], CategoriesController.prototype, "updateCategory", null);
__decorate([
    common_1.Delete(),
    roles_decorator_1.Role(user_entity_1.RolePermitted.moderator),
    common_1.UsePipes(common_1.ValidationPipe),
    __param(0, common_1.Body("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CategoriesController.prototype, "deleteCategoryById", null);
CategoriesController = __decorate([
    common_1.UseGuards(passport_1.AuthGuard("jwt"), roles_guard_1.RolesGuard),
    common_1.Controller("categories"),
    __metadata("design:paramtypes", [categories_service_1.CategoriesService])
], CategoriesController);
exports.CategoriesController = CategoriesController;
//# sourceMappingURL=categories.controller.js.map