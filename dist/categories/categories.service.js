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
const config = require("config");
const _ = require("lodash");
const question_entity_1 = require("../questions/question.entity");
const question_repository_1 = require("../questions/question.repository");
const utils_1 = require("../utils/utils");
const category_entity_1 = require("./category.entity");
const category_repository_1 = require("./category.repository");
const serverConfig = config.get("server");
const SERVER_URL = `${serverConfig.url}:${serverConfig.port}/`;
let CategoriesService = class CategoriesService {
    constructor(categoryRepository, questionRepository) {
        this.categoryRepository = categoryRepository;
        this.questionRepository = questionRepository;
    }
    async findAllCategories() {
        const [err, categories] = await utils_1.to(this.categoryRepository.find({ order: { slug: "ASC" } }));
        if (err)
            throw new common_1.InternalServerErrorException();
        let catHierarchy = [];
        categories.forEach((element, index, arr) => {
            let child = arr.filter((e) => {
                return element.id === +e.parentId;
            });
            if (child.length > 0) {
                element.child = child;
            }
            if (element.parentId === null) {
                catHierarchy.push(element);
            }
        });
        return { categories, catHierarchy };
    }
    async findCategoryBySlug(slug) {
        const [err, category] = await utils_1.to(this.categoryRepository.findOne({ slug: slug }));
        if (err)
            throw new common_1.InternalServerErrorException();
        return category;
    }
    async createCategory(categoryDto, image) {
        let { name, description, parentId, order } = categoryDto;
        name = utils_1.firstltrCapRestLow(name);
        order = +order;
        parentId = parentId === "Top" ? null : +parentId;
        const imageUrl = image.filename;
        try {
            let parent = await this.categoryRepository.findOne({ id: +parentId });
            let slug = parentId ? parent.slug : "Top";
            slug = slug + "_" + name;
            let category = new category_entity_1.Category();
            category.name = name;
            category.slug = slug;
            category.description = description;
            if (parentId)
                category.parentId = +parentId;
            category.order = order;
            category.imageUrl = imageUrl;
            let result = await category.save();
            return result;
        }
        catch (error) {
            console.log(error);
            utils_1.deleteImageFile(imageUrl);
            if (error.code == 11000) {
                throw new common_1.ConflictException(`This category is already exist.`);
            }
            else
                throw new common_1.InternalServerErrorException();
        }
    }
    async updateCategory(id, categoryDto, image) {
        let { name, description, parentId, order, slug } = categoryDto;
        name = utils_1.firstltrCapRestLow(name);
        let newCategorySlug;
        parentId = parentId !== "Top" ? +parentId : null;
        try {
        }
        catch (error) { }
        const [err, oldCategory] = await utils_1.to(this.categoryRepository.findOne({ id: +id }));
        if (err) {
            if (image)
                utils_1.deleteImageFile(image.filename);
            throw new common_1.InternalServerErrorException();
        }
        if (_.isEqual(oldCategory.parentId, parentId)) {
            const duplicateCategory = await this.categoryRepository.findOne({
                where: {
                    name: name,
                    slug: slug,
                    parentId: parentId,
                },
            });
            if (duplicateCategory) {
                duplicateCategory.description = description;
                duplicateCategory.order = order;
                if (image)
                    duplicateCategory.imageUrl = image.filename;
                const [err, res] = await utils_1.to(duplicateCategory.save());
                if (res)
                    return { msg: "category updated successully" };
                if (image)
                    utils_1.deleteImageFile(image.filename);
                if (err)
                    throw new common_1.ConflictException("Category by this name is already present");
            }
            else {
                if (image)
                    utils_1.deleteImageFile(image.filename);
                throw new common_1.ConflictException("Category by this name is already present");
            }
        }
        let childCategories = await this.categoryRepository.find({
            where: [{ id: +id }, { parentId: +id }],
            order: {
                slug: "ASC",
            },
        });
        let NewParentCategory;
        if (parentId) {
            NewParentCategory = await this.categoryRepository.findOne({
                id: +parentId,
            });
        }
        if (childCategories) {
            childCategories.forEach((element) => {
                if (element.id === +id) {
                    element.name = name;
                    element.description = description;
                    if (image) {
                        element.imageUrl = image.filename;
                    }
                    element.order = +order;
                    element.parentId = parentId !== "Top" ? +parentId : null;
                    newCategorySlug = element.slug = parentId
                        ? NewParentCategory.slug + "_" + name
                        : "Top_" + name;
                    return;
                }
                element.slug =
                    newCategorySlug + element.slug.split(oldCategory.name)[1];
            });
            try {
                childCategories.forEach(async (element) => {
                    await element.save();
                });
                return { msg: "Category updated successfully" };
            }
            catch (error) {
                console.log(error);
                utils_1.deleteImageFile(image.filename);
                throw new common_1.InternalServerErrorException();
            }
        }
    }
    async deleteCategoryById(id) {
        const [err, categoryToDelete] = await utils_1.to(this.categoryRepository.findOne({ id: +id }));
        if (err) {
            throw new common_1.InternalServerErrorException();
        }
        if (categoryToDelete) {
            const childCategories = await this.categoryRepository.find({
                where: { parentId: +id },
            });
            childCategories.forEach(async (element) => {
                element.parentId = categoryToDelete.parentId;
                element.slug = element.slug.replace("_" + categoryToDelete.name + "_", "_");
                try {
                    await element.save();
                }
                catch (error) {
                    console.log(error);
                }
            });
            try {
                await this.categoryRepository.delete({ id: +id });
                utils_1.deleteImageFile(categoryToDelete.imageUrl);
                const haveAnyQuestion = await this.questionRepository.findOne({
                    categoryId: +id,
                });
                if (haveAnyQuestion) {
                    let [uncategorized] = await category_entity_1.Category.find({
                        name: "Uncategorized",
                        parentId: null,
                    });
                    if (!uncategorized) {
                        uncategorized = new category_entity_1.Category();
                        uncategorized.name = "Uncategorized";
                        uncategorized.parentId = null;
                        uncategorized.slug = "Top / Uncategorized";
                        uncategorized.order = 10000;
                        uncategorized.description = "All uncategorized topics";
                        uncategorized.imageUrl = "/bootstrap/uncat.png";
                        await uncategorized.save();
                    }
                    await this.questionRepository
                        .createQueryBuilder()
                        .update(question_entity_1.Question)
                        .set({
                        categoryId: uncategorized.id,
                    })
                        .where({
                        categoryId: +id,
                    })
                        .execute();
                }
                return { message: "Category deleted successfully" };
            }
            catch (error) {
                console.log(error);
                throw new common_1.InternalServerErrorException();
            }
        }
    }
    async getFreeCategoryId() {
        const [err, category] = await utils_1.to(this.categoryRepository.findOne({ name: "Free" }));
        if (err)
            throw new common_1.InternalServerErrorException();
        return category ? category._id : null;
    }
};
CategoriesService = __decorate([
    common_1.Injectable(),
    __param(0, typeorm_1.InjectRepository(category_repository_1.CategoryRepository)),
    __metadata("design:paramtypes", [category_repository_1.CategoryRepository,
        question_repository_1.QuestionRepository])
], CategoriesService);
exports.CategoriesService = CategoriesService;
//# sourceMappingURL=categories.service.js.map