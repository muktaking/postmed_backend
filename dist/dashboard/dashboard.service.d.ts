import { CategoryRepository } from "src/categories/category.repository";
import { ExamRepository } from "src/exams/exam.repository";
import { ExamsService } from "src/exams/exams.service";
import { UsersService } from "src/users/users.service";
export declare class DashboardService {
    private usersService;
    private categoryRepository;
    private examRepository;
    private readonly examService;
    constructor(usersService: UsersService, categoryRepository: CategoryRepository, examRepository: ExamRepository, examService: ExamsService);
    private featuredCategoryId;
    getFeaturedCategoryId(): Promise<any>;
    getStudentDashInfo(email: string): Promise<{
        userExamInfo: any;
        featuredExams: any;
        userExamStat: any;
    }>;
    getAdminDashInfo(userRole: any): Promise<{
        users: any;
        exams: any;
    }>;
    getFeaturedExams(): Promise<any>;
}
