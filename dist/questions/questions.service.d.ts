import { User } from 'src/users/user.entity';
import { CreateQuestionDto } from './create-question.dto';
import { Question } from './question.entity';
import { QuestionRepository } from './question.repository';
import { Stem } from './stem.entity';
export declare class QuestionsService {
    private questionRepository;
    constructor(questionRepository: QuestionRepository);
    findAllQuestions(): Promise<any>;
    findQuestionById(id: any): Promise<any>;
    findQuestionByFilter(filterName: any, filterValue: any): Promise<any>;
    createQuestion(createQuestionDto: CreateQuestionDto, stem: {
        stem: Stem[];
        error: string;
    }, creator: string): Promise<{
        result: any;
        message: string;
    }>;
    createQuestionByUpload(creator: any, category: any, file: any): Promise<any>;
    updateQuestionById(id: string, createQuestionDto: CreateQuestionDto, stem: {
        stem: Stem[];
        error: string;
    }, modifiedBy: User): Promise<{
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
    } & Question>;
    deleteQuestion(...args: any[]): Promise<{
        message: string;
    }>;
    private toCollection;
}
