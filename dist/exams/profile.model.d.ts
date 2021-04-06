import * as mongoose from "mongoose";
export interface ExamProfile extends mongoose.Document {
    user: string;
    exams: Array<ExamStat>;
}
export interface ExamStat {
    _id: string;
    attemptNumbers: number;
    averageScore: number;
    totalMark: number;
    firstAttemptTime: number;
    lastAttemptTime: number;
}
export declare const ExamProfileSchema: mongoose.Schema<any>;
