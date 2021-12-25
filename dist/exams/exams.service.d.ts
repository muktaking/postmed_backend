import { InternalServerErrorException } from '@nestjs/common';
import { CategoryRepository } from 'src/categories/category.repository';
import { QuestionRepository } from 'src/questions/question.repository';
import { UsersService } from 'src/users/users.service';
import { CreateExamDto } from './dto/exam.dto';
import { ExamRepository } from './exam.repository';
import { FeedbackRepository } from './feedback.repository';
import { ExamProfileRepository } from './profie.repository';
import { Profile } from './profile.entity';
export declare class ExamsService {
    private readonly usersService;
    private questionRepository;
    private courseRepository;
    private categoryRepository;
    private examRepository;
    private examProfileRepository;
    private feedbackRepository;
    constructor(usersService: UsersService, questionRepository: QuestionRepository, courseRepository: CategoryRepository, categoryRepository: CategoryRepository, examRepository: ExamRepository, examProfileRepository: ExamProfileRepository, feedbackRepository: FeedbackRepository);
    private freeCategoryId;
    private oneTimeAttemptTypeBar;
    getFreeCategoryId(): Promise<any>;
    private featuredCategoryId;
    getFeaturedCategoryId(): Promise<any>;
    findUserExamInfo(email: string): Promise<{
        totalExam: any[];
        rank: (number | InternalServerErrorException)[];
        upcomingExam: any[];
        result: string[];
    }>;
    findUserExamStat(email: string): Promise<{
        examTitles: any[];
        stat: any[];
    }>;
    findTotalExamTaken(email: string): Promise<any>;
    findExamTotalNumber(): Promise<any>;
    findAllExams(): Promise<any>;
    findAllExamsByCourseIds(courseId: any, stuIds: string): Promise<any>;
    findAllPlainExamsByCourseIds(courseId: any, stuIds: string): Promise<any>;
    findAllOldExams(): Promise<any>;
    findAllRawExams(): Promise<any>;
    findLatestExam(): Promise<any>;
    findCurrentExam(): Promise<any>;
    getFeaturedExams(): Promise<any>;
    findExamById(id: string, constraintByCategoryType?: any, email?: any, stuId?: any): Promise<any>;
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
    findAllProfile(): Promise<Profile[]>;
    findProfileByUserEmail(email: string): Promise<Profile>;
    getUserAvgResult(email: string): Promise<string[]>;
    getUserRank(email: string): Promise<number>;
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
