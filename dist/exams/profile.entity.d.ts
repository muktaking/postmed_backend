import { BaseEntity } from "typeorm";
import { ExamType } from "./exam.entity";
import { ExamProfile } from "./examProfile.entity";
export interface ExamStat {
    id: string;
    title: string;
    type: ExamType;
    attemptNumbers: number;
    averageScore: number;
    totalMark: number;
    firstAttemptTime: number;
    lastAttemptTime: number;
}
export declare class Profile extends BaseEntity {
    id: number;
    user: string;
    exams: ExamProfile[];
}
