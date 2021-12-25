import { CreateQuestionDto } from './create-question.dto';
import { QuestionsService } from './questions.service';
import { Stem } from './stem.entity';
export declare class QuestionsController {
    private readonly questionService;
    constructor(questionService: QuestionsService);
    getAllQuestions(): Promise<any>;
    getQuestionById(id: any): Promise<any>;
    getQuestionsByCategory(categoryId: any): Promise<any>;
    createQuestion(createQuestionDto: CreateQuestionDto, stem: {
        stem: Stem[];
        error: string;
    }, req: any): Promise<{
        result: any;
        message: string;
    }>;
    createQuestionByUpload(req: any, category: string, file: string): Promise<any>;
    updateQuestionById(questionId: any, createQuestionDto: CreateQuestionDto, stem: {
        stem: Stem[];
        error: string;
    }, req: any): Promise<{
        id: number;
        title: string;
        categoryId: number;
        qType: import("./question.entity").QType;
        qText: string;
        stems: Stem[];
        generalFeedback: string;
        tags: string;
        createDate: import("typeorm").Timestamp;
        modifiedDate: string | import("typeorm").Timestamp;
        creatorId: number;
        modifiedById: number;
    } & import("./question.entity").Question>;
    deleteQuestionById(questionId: any): Promise<{
        message: string;
    }>;
    deleteQuestion(questionIds: any): Promise<{
        message: string;
    }>;
}
