import { CategoryRepository } from 'src/categories/category.repository';
import { CoursesService } from 'src/courses/courses.service';
import { ExamRepository } from 'src/exams/exam.repository';
import { ExamsService } from 'src/exams/exams.service';
import { UserExamProfileRepository } from 'src/userExamProfile/userExamProfile.repository';
import { User } from 'src/users/user.entity';
import { UsersService } from 'src/users/users.service';
export declare class DashboardService {
    private usersService;
    private categoryRepository;
    private examRepository;
    private userExamProfileRepository;
    private readonly examService;
    private readonly courseService;
    constructor(usersService: UsersService, categoryRepository: CategoryRepository, examRepository: ExamRepository, userExamProfileRepository: UserExamProfileRepository, examService: ExamsService, courseService: CoursesService);
    private featuredCategoryId;
    getFeaturedCategoryId(): Promise<any>;
    getStudentDashInfo(id: any): Promise<any[]>;
    getAdminDashInfo(user: User): Promise<{
        users: any[];
        exams: any[];
        feedbacks: any[];
        expectedEnrolled: any[];
    }>;
}
