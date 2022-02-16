import { QuestionRepository } from 'src/questions/question.repository';
import { Category } from './category.entity';
import { CategoryRepository } from './category.repository';
import { createCategoryDto } from './dto/category.dto';
export declare class CategoriesService {
    private categoryRepository;
    private questionRepository;
    constructor(categoryRepository: CategoryRepository, questionRepository: QuestionRepository);
    findAllCategories(): Promise<{
        categories: any;
        catHierarchy: any[];
    }>;
    findCategoryBySlug(slug: string): Promise<any>;
    createCategory(categoryDto: createCategoryDto, image: any): Promise<Category>;
    updateCategory(id: string, categoryDto: createCategoryDto, image: any): Promise<{
        msg: string;
    }>;
    deleteCategoryById(id: string): Promise<{
        message: string;
    }>;
    getFreeCategoryId(): Promise<any>;
}
