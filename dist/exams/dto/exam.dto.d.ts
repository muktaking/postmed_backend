import { ExamType } from '../exam.model';
export declare class CreateExamDto {
    title: string;
    type: ExamType;
    categoryType: Array<string>;
    description: string;
    questions: Array<number>;
    startDate: string;
    endDate: string;
    singleQuestionMark: number;
    questionStemLength: number;
    penaltyMark: number;
    timeLimit: number;
}
export declare class FindExamDto {
    id: string;
}
