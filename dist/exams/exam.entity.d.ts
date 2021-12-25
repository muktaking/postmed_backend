import { BaseEntity, Timestamp } from 'typeorm';
export declare enum ExamType {
    Assignment = 0,
    Weekly = 1,
    Monthly = 2,
    Assesment = 3,
    Term = 4,
    Test = 5,
    Final = 6
}
export declare enum answerStatus {
    True = 1,
    False = 0,
    NotAnswered = -1
}
export declare class Exam extends BaseEntity {
    singleStemMarkCalculator(): void;
    id: number;
    title: string;
    type: ExamType;
    categoryIds: string[];
    categoryType: any;
    courseIds: string[];
    courseType: any;
    description: string;
    questions: number[];
    singleQuestionMark: number;
    questionStemLength: number;
    singleStemMark: number;
    penaltyMark: number;
    timeLimit: number;
    createdAt: Timestamp | string;
    startDate: Timestamp;
    endDate: Timestamp;
    creatorId: number;
}
