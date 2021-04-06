import { BaseEntity } from "typeorm";
import { Question } from "./question.entity";
export declare class Stem extends BaseEntity {
    id: number;
    qStem: string;
    aStem: string;
    fbStem?: string;
    question: Question;
}
