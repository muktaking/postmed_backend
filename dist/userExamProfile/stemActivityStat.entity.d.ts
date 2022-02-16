import { BaseEntity } from 'typeorm';
import { QuestionActivityStat } from './questionActivityStat.entity';
export declare class StemActivityStat extends BaseEntity {
    id: number;
    aStem: string;
    aStemStatus: string;
    questionActivityStat: QuestionActivityStat;
}
