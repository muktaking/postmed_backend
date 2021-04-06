import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import * as config from "config";
import * as _ from "lodash";
import { Question } from "src/questions/question.entity";
import { QuestionRepository } from "src/questions/question.repository";
import { deleteImageFile, firstltrCapRestLow, to } from "../utils/utils";
import { Category } from "./category.entity";
import { CategoryRepository } from "./category.repository";
import { createCategoryDto } from "./dto/category.dto";

const serverConfig = config.get("server");
const SERVER_URL = `${serverConfig.url}:${serverConfig.port}/`;

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(CategoryRepository)
    private categoryRepository: CategoryRepository,
    private questionRepository: QuestionRepository
  ) {}

  async findAllCategories() {
    const [err, categories] = await to(
      this.categoryRepository.find({ order: { slug: "ASC" } })
    ); // fetch categories with name property and sort by name in ascending order;
    if (err) throw new InternalServerErrorException();
    //function to storing category according to their hierarchy
    let catHierarchy: Array<any> = [];
    categories.forEach((element, index, arr) => {
      let child = arr.filter((e) => {
        return element.id === +e.parentId;
      }); //store child into parent
      if (child.length > 0) {
        element.child = child;
      }
      if (element.parentId === null) {
        catHierarchy.push(element);
      }
    });
    return { categories, catHierarchy };
  }

  async findCategoryBySlug(slug: string) {
    const [err, category] = await to(
      this.categoryRepository.findOne({ slug: slug })
    );
    if (err) throw new InternalServerErrorException();

    return category;
  }

  async createCategory(categoryDto: createCategoryDto, image: any) {
    let { name, description, parentId, order } = categoryDto;
    name = firstltrCapRestLow(name);
    order = +order;
    parentId = parentId === "Top" ? null : +parentId;
    const imageUrl = image.filename;

    try {
      let parent = await this.categoryRepository.findOne({ id: +parentId });

      let slug = parentId ? parent.slug : "Top";
      slug = slug + "_" + name;

      //create a new category and save in db
      let category = new Category();
      category.name = name;
      category.slug = slug;
      category.description = description;
      if (parentId) category.parentId = +parentId;
      category.order = order;
      category.imageUrl = imageUrl;

      let result = await category.save();
      return result;
    } catch (error) {
      console.log(error);
      deleteImageFile(imageUrl);
      if (error.code == 11000) {
        throw new ConflictException(`This category is already exist.`);
      } else throw new InternalServerErrorException();
    }
  }

  async updateCategory(id: string, categoryDto: createCategoryDto, image: any) {
    let { name, description, parentId, order, slug } = categoryDto;

    name = firstltrCapRestLow(name);
    let newCategorySlug;
    parentId = parentId !== "Top" ? +parentId : null;
    try {
    } catch (error) {}
    const [err, oldCategory] = await to(
      this.categoryRepository.findOne({ id: +id })
    );
    if (err) {
      if (image) deleteImageFile(image.filename);
      throw new InternalServerErrorException();
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
        if (image) duplicateCategory.imageUrl = image.filename;
        const [err, res] = await to(duplicateCategory.save());

        if (res) return { msg: "category updated successully" };
        if (image) deleteImageFile(image.filename);
        if (err)
          throw new ConflictException(
            "Category by this name is already present"
          );
      } else {
        if (image) deleteImageFile(image.filename);
        //if (err)
        throw new ConflictException("Category by this name is already present");
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
      } catch (error) {
        console.log(error);
        deleteImageFile(image.filename);
        throw new InternalServerErrorException();
      }
    }
  }

  async deleteCategoryById(id: string) {
    const [err, categoryToDelete] = await to(
      this.categoryRepository.findOne({ id: +id })
    );
    if (err) {
      throw new InternalServerErrorException();
    }

    if (categoryToDelete) {
      const childCategories = await this.categoryRepository.find({
        where: { parentId: +id },
      });
      childCategories.forEach(async (element) => {
        element.parentId = categoryToDelete.parentId;
        element.slug = element.slug.replace(
          "_" + categoryToDelete.name + "_",
          "_"
        );
        try {
          await element.save();
        } catch (error) {
          console.log(error);
        }
      });
      try {
        await this.categoryRepository.delete({ id: +id });
        deleteImageFile(categoryToDelete.imageUrl);
        // search for questions and shift them to uncategorized
        const haveAnyQuestion = await this.questionRepository.findOne({
          categoryId: +id,
        });
        if (haveAnyQuestion) {
          let [uncategorized] = await Category.find({
            name: "Uncategorized",
            parentId: null,
          });
          if (!uncategorized) {
            uncategorized = new Category();
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
            .update(Question)
            .set({
              categoryId: uncategorized.id,
            })
            .where({
              categoryId: +id,
            })
            .execute();
        }
        return { message: "Category deleted successfully" };
      } catch (error) {
        console.log(error);
        throw new InternalServerErrorException();
      }

      //
      //return res.redirect('/category');
    }
  }

  async getFreeCategoryId() {
    const [err, category] = await to(
      this.categoryRepository.findOne({ name: "Free" })
    );
    if (err) throw new InternalServerErrorException();
    return category ? category._id : null;
  }
}
