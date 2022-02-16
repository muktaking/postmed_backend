import { BaseEntity } from 'typeorm';
import { ExamActivityStat } from './examActivityStat.entity';
import { StemActivityStat } from './stemActivityStat.entity';
export declare class QuestionActivityStat extends BaseEntity {
    id: number;
    questionId: number;
    score: number;
    wrongScore: number;
    penaltyScore: number;
    rightStems: number;
    wrongStems: number;
    stemActivityStat: StemActivityStat[];
    examActivityStat: ExamActivityStat;
}
