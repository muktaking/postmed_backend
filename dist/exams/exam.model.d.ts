import * as mongoose from "mongoose";
export interface Exam extends mongoose.Document {
    id: string;
    title: string;
    type: ExamType;
    categoryType: Array<string>;
    description: string;
    questions: Array<string>;
    singleQuestionMark: number;
    questionStemLength: number;
    singleStemMark: number;
    penaltyMark: number;
    timeLimit: number;
    createdAt: Date;
    creator: string;
}
export declare enum ExamType {
    Assignment = 0,
    Weekly = 1,
    Monthly = 2,
    Assesment = 3,
    Term = 4,
    Test = 5,
    Final = 6
}
export declare const ExamSchema: mongoose.Schema<any>;
