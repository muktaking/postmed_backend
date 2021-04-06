import { InternalServerErrorException } from "@nestjs/common";
import { CategoryRepository } from "src/categories/category.repository";
import { QuestionRepository } from "src/questions/question.repository";
import { UsersService } from "src/users/users.service";
import { CreateExamDto } from "./dto/exam.dto";
import { ExamRepository } from "./exam.repository";
import { ExamProfileRepository } from "./profie.repository";
import { Profile } from "./profile.entity";
export declare class ExamsService {
    private readonly usersService;
    private questionRepository;
    private categoryRepository;
    private examRepository;
    private examProfileRepository;
    constructor(usersService: UsersService, questionRepository: QuestionRepository, categoryRepository: CategoryRepository, examRepository: ExamRepository, examProfileRepository: ExamProfileRepository);
    private freeCategoryId;
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
    findLatestExam(): Promise<any>;
    getFeaturedExams(): Promise<any>;
    findExamById(id: string, constraintByCategoryType?: any): Promise<any>;
    findQuestionsByExamId(id: string): Promise<{
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
    createExam(createExamDto: CreateExamDto, creator: string): Promise<any>;
    updateExamById(id: string, createExamDto: CreateExamDto): Promise<any>;
    deleteExam(...args: any[]): Promise<import("typeorm").DeleteResult>;
}
