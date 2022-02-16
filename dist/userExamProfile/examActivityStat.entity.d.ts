import { BaseEntity, Timestamp } from 'typeorm';
import { QuestionActivityStat } from './questionActivityStat.entity';
import { UserExamExamProfile } from './userExamExamProfile.entity';
export declare class ExamActivityStat extends BaseEntity {
    id: number;
    totalScore: number;
    totalWrongScore: number;
    totalPenaltyScore: number;
    totalRightStems: number;
    totalWrongStems: number;
    totalRightSbaQuestions: number;
    totalWrongSbaQuestions: number;
    attemptTime: Timestamp | string;
    questionActivityStat: QuestionActivityStat[];
    userExamExamProfile: UserExamExamProfile;
}
