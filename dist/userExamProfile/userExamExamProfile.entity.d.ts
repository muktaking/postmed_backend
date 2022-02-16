import { BaseEntity, Timestamp } from 'typeorm';
import { ExamType } from '../exams/exam.entity';
import { ExamActivityStat } from './examActivityStat.entity';
import { UserExamCourseProfile } from './userExamCourseProfile.entity';
export interface ExamStat {
    id: string;
    title: string;
    type: ExamType;
    attemptNumbers: number;
    score: number[];
    totalMark: number;
    firstAttemptTime: number;
    lastAttemptTime: number;
}
export declare class UserExamExamProfile extends BaseEntity {
    id: number;
    examId: number;
    examTitle: string;
    examType: ExamType;
    attemptNumbers: number;
    score: number[];
    totalMark: number;
    firstAttemptTime: Timestamp;
    lastAttemptTime: Timestamp | string;
    course: UserExamCourseProfile;
    examActivityStat: ExamActivityStat[];
}
