import { CreateExamDto } from "./dto/exam.dto";
import { ExamsService } from "./exams.service";
export declare class ExamsController {
    private readonly examService;
    constructor(examService: ExamsService);
    createExam(createExamDto: CreateExamDto, req: any): Promise<any>;
    findAllExams(): Promise<any>;
    findLatestExam(): Promise<any>;
    findFeaturedExam(): Promise<any>;
    findExamById(id: any): Promise<any>;
    findQuestionsByExamId(id: any): Promise<{
        exam: {
            id: any;
            singleQuestionMark: any;
            singleStemMark: any;
            penaltyMark: any;
            timeLimit: any;
        };
        questions: any;
    }>;
    findFreeQuestionsByExamId(id: any): Promise<{
        exam: {
            id: any;
            singleQuestionMark: any;
            singleStemMark: any;
            penaltyMark: any;
            timeLimit: any;
        };
        questions: any;
    }>;
    updateExamById(examId: any, createExamDto: CreateExamDto): Promise<any>;
    deleteQuestionById(examId: any): Promise<import("typeorm").DeleteResult>;
    deleteQuestion(examIds: any): Promise<import("typeorm").DeleteResult>;
}
