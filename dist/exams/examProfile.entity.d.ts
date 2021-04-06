import { BaseEntity, Timestamp } from "typeorm";
import { ExamType } from "./exam.entity";
import { Profile } from "./profile.entity";
export declare class ExamProfile extends BaseEntity {
    updateAvgScore(v: any): any;
    id: number;
    examId: number;
    examTitle: string;
    examType: ExamType;
    attemptNumbers: number;
    averageScore: number;
    totalMark: number;
    firstAttemptTime: Timestamp;
    lastAttemptTime: Timestamp;
    profile: Profile;
}
