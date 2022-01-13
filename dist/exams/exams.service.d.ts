import { InternalServerErrorException } from '@nestjs/common';
import { CategoryRepository } from 'src/categories/category.repository';
import { CoursesService } from 'src/courses/courses.service';
import { QuestionRepository } from 'src/questions/question.repository';
import { UserExamCourseProfileRepository } from 'src/userExamProfile/userExamCourseProfile.repository';
import { UserExamProfile } from 'src/userExamProfile/userExamProfile.entity';
import { UserExamProfileRepository } from 'src/userExamProfile/userExamProfile.repository';
import { UsersService } from 'src/users/users.service';
import { CreateExamDto } from './dto/exam.dto';
import { ExamRepository } from './exam.repository';
import { FeedbackRepository } from './feedback.repository';
export declare class ExamsService {
    private readonly usersService;
    private readonly coursesService;
    private questionRepository;
    private courseRepository;
    private categoryRepository;
    private examRepository;
    private feedbackRepository;
    private userExamCourseProfileRepository;
    private userExamProfileRepository;
    constructor(usersService: UsersService, coursesService: CoursesService, questionRepository: QuestionRepository, courseRepository: CategoryRepository, categoryRepository: CategoryRepository, examRepository: ExamRepository, feedbackRepository: FeedbackRepository, userExamCourseProfileRepository: UserExamCourseProfileRepository, userExamProfileRepository: UserExamProfileRepository);
    private freeCategoryId;
    private oneTimeAttemptTypeBar;
    getFreeCategoryId(): Promise<any>;
    private featuredCategoryId;
    getFeaturedCategoryId(): Promise<any>;
    findUserExamInfo(id: any, courseId: any): Promise<{
        totalExam: any[];
        rank: (number | InternalServerErrorException)[];
        upcomingExam: any[];
        result: any[];
    }>;
    findUserExamStat(id: any, courseId: any): Promise<{
        examTitles: any[];
        stat: any[];
    }>;
    findTotalExamTakenByCourseId(id: any, courseId: any): Promise<any>;
    findExamTotalNumber(): Promise<any>;
    findExamTotalNumberByCourseId(courseId: any): Promise<any>;
    findAllExams(): Promise<any>;
    findAllExamsByCourseIds(courseId: any, stuIds: string): Promise<any>;
    findAllPlainExamsByCourseIds(courseId: any, stuIds: string, filter?: any): Promise<any>;
    findAllOldExams(): Promise<any>;
    findAllRawExams(): Promise<any>;
    findLatestExam(): Promise<any>;
    findLatestExamByCourseId(courseId: any): Promise<any>;
    findCurrentExam(): Promise<any>;
    getFeaturedExams(courseId?: any): Promise<any>;
    findExamById(id: string, constraintByCategoryType?: any, stuId?: any): Promise<any>;
    findExamByCatId(id: string): Promise<any>;
    findOldExamByCatId(id: string): Promise<any>;
    findQuestionsByExamId(id: string, user: any): Promise<{
        exam: {
            id: any;
            singleQuestionMark: any;
            singleStemMark: any;
            penaltyMark: any;
            timeLimit: any;
        };
        questions: any;
    }>;
    findFreeQuestionsByExamId(id: string): Promise<{
        exam: {
            id: any;
            singleQuestionMark: any;
            singleStemMark: any;
            penaltyMark: any;
            timeLimit: any;
        };
        questions: any;
    }>;
    findAllProfile(): Promise<UserExamProfile[]>;
    getUserAvgResultByCourseId(id: any, courseId: any): Promise<any[]>;
    getUserRank(id: any, courseId: any): Promise<number>;
    createExam(createExamDto: any, creator: string): Promise<any>;
    updateExamById(id: string, createExamDto: CreateExamDto): Promise<any>;
    deleteExam(...args: any[]): Promise<import("typeorm").DeleteResult>;
    createFeedback(createFeedbackDto: any): Promise<{
        message: string;
    }>;
    getFeedbackByExamId(examId: any): Promise<any>;
    getPendingFeedback(): Promise<any>;
    changePendingStatus(ids: any, deny?: boolean): Promise<{
        message: string;
    }>;
}
