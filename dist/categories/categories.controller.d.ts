import { CategoriesService } from './categories.service';
import { createCategoryDto } from './dto/category.dto';
export declare class CategoriesController {
    private categoriesService;
    constructor(categoriesService: CategoriesService);
    getAllCategories(): Promise<{
        categories: any;
        catHierarchy: any[];
    }>;
    getCategory(req: any): Promise<any>;
    createCategory(createCategoryDto: createCategoryDto, image: any): Promise<import("./category.entity").Category>;
    updateCategory(id: string, createCategoryDto: createCategoryDto, image: any): Promise<{
        msg: string;
    }>;
    deleteCategoryById(id: string): Promise<{
        message: string;
    }>;
}
